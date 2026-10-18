const test = require('node:test');
const assert = require('node:assert/strict');
const { once } = require('node:events');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const app = require('../../dist/app').default;
const UserModel = require('../../dist/infrastructure/database/models/userModel').default;
const PaymentModel = require('../../dist/infrastructure/database/models/paymentModel').default;
const RevokedTokenModel = require('../../dist/infrastructure/database/models/revokedTokenModel').default;
const { QueryBuilder } = require('../../dist/shared/utils/queryBuilder');
const CourtTypeModel = require('../../dist/infrastructure/database/models/courtTypeModel').default;
const GovernorateModel = require('../../dist/infrastructure/database/models/governorateModel').default;

test('payment review filters pending requests, exposes safe details and updates subscriptions once', async (context) => {
    const originalSecret = process.env.JWT_SECRET;
    process.env.JWT_SECRET = 'payment-review-integration-test';
    context.after(() => { if (originalSecret === undefined) delete process.env.JWT_SECRET; else process.env.JWT_SECRET = originalSecret; });
    const adminId = '507f1f77bcf86cd799439011';
    const userId = '507f1f77bcf86cd799439012';
    const approvedId = '507f1f77bcf86cd799439013';
    const rejectedId = '507f1f77bcf86cd799439014';
    let userSaves = 0;
    let paymentSaves = 0;
    let filter;
    let projection;
    const admin = { _id: adminId, role: 'admin', active: true };
    const user = { _id: userId, name: 'Subscriber', email: 'user@example.test', phone: '01012345678', role: 'user', active: true, verified: true, isSubscribed: false, password: 'private-hash', resetCode: 'private-code', async save() { userSaves += 1; } };
    const payments = new Map([approvedId, rejectedId].map((id) => [id, {
        _id: id, user: userId, amount: 100, currency: 'EGP', walletType: 'Cash', walletNumber: '01012345678', receiptImageUrl: 'receipt.jpeg', paymentStatus: 'PENDING',
        async save() { paymentSaves += 1; }, toObject() { return { ...this }; },
    }]));
    context.mock.method(RevokedTokenModel, 'exists', async () => false);
    context.mock.method(UserModel, 'findById', (id) => {
        const document = String(id) === adminId ? admin : user;
        const query = Promise.resolve(document);
        query.session = async () => document;
        query.select = (fields) => {
            projection = fields;
            return { async lean() { return Object.fromEntries(Object.entries(document).filter(([key]) => key === '_id' || fields.split(' ').includes(key))); } };
        };
        return query;
    });
    context.mock.method(PaymentModel, 'findById', (id) => {
        let populated = false;
        const payment = payments.get(String(id));
        const query = {
            populate(options) { if (options.path === 'user') { populated = true; assert.ok(!options.select.includes('password')); } return this; },
            async session() { return payment; },
            then(resolve, reject) { return Promise.resolve(payment ? { ...payment, user: populated ? { _id: userId, name: user.name, email: user.email, phone: user.phone } : payment.user } : null).then(resolve, reject); },
        };
        return query;
    });
    context.mock.method(mongoose, 'startSession', async () => ({ async withTransaction(callback) { return callback(); }, async endSession() {} }));
    context.mock.method(QueryBuilder.prototype, 'execute', async function () {
        filter = this.mongooseQuery.getFilter();
        assert.ok(this.mongooseQuery.getPopulatedPaths().includes('user'));
        return { data: [...payments.values()].filter((payment) => payment.paymentStatus === 'PENDING'), pagination: { totalDocuments: 2, page: 1, limit: 10 } };
    });
    const server = app.listen(0, '127.0.0.1');
    context.after(() => new Promise((resolve, reject) => { server.close((error) => error ? reject(error) : resolve()); server.closeAllConnections(); }));
    await once(server, 'listening');
    const base = `http://127.0.0.1:${server.address().port}/api/v1`;
    const request = (path, id = adminId, method = 'GET', body) => fetch(`${base}${path}`, {
        method, headers: { ...(id ? { Authorization: `Bearer ${jwt.sign({ id }, process.env.JWT_SECRET)}` } : {}), 'Content-Type': 'application/json' }, ...(body ? { body: JSON.stringify(body) } : {}),
    });
    const pending = await request('/payment?status=PENDING&page=1&limit=10');
    assert.equal(pending.status, 200);
    assert.equal((await pending.json()).data.list.length, 2);
    assert.equal(filter.status, undefined);
    const statusFilter = new RegExp(filter.paymentStatus.$regex, 'i');
    assert.ok(statusFilter.test('PENDING'));
    assert.ok(!statusFilter.test('APPROVED'));
    assert.ok(!statusFilter.test('REJECTED'));
    const detail = await request(`/payment/${approvedId}`);
    assert.equal(detail.status, 200);
    const detailData = (await detail.json()).data;
    assert.equal(detailData.receiptImageUrl, 'receipt.jpeg');
    assert.equal(detailData.user.name, 'Subscriber');
    const userDetail = await request(`/admin-management/users/${userId}`);
    assert.equal(userDetail.status, 200);
    const userData = (await userDetail.json()).data;
    assert.equal(userData.phone, user.phone);
    assert.equal(userData.password, undefined);
    assert.equal(userData.resetCode, undefined);
    assert.ok(projection.includes('isSubscribed'));
    assert.equal((await request(`/payment/approve/${approvedId}`, adminId, 'POST', {})).status, 200);
    assert.equal(user.isSubscribed, true);
    assert.equal(user.currentsubscriptionStatus, 'ACTIVE');
    assert.equal(user.currentSubscriptionId, approvedId);
    assert.equal(payments.get(approvedId).reviewedByAdminId.toString(), adminId);
    assert.ok(payments.get(approvedId).reviewedAt instanceof Date);
    assert.equal((await request(`/payment/decline/${approvedId}`, adminId, 'POST', {})).status, 409);
    assert.equal(userSaves, 1);
    assert.equal(paymentSaves, 1);
    assert.equal((await request(`/payment/decline/${rejectedId}`, adminId, 'POST', { rejectionReason: 'Unreadable receipt', rejectionMessage: 'Please upload a clear copy' })).status, 200);
    assert.equal(payments.get(rejectedId).paymentStatus, 'REJECTED');
    assert.equal(payments.get(rejectedId).rejectionReason, 'Unreadable receipt');
    assert.equal(user.isSubscribed, true);
    assert.equal((await request(`/payment/${rejectedId}/status`, adminId, 'PUT', { status: 'PENDING' })).status, 400);
    assert.equal((await request('/payment/approve/invalid', adminId, 'POST', {})).status, 400);
    assert.equal((await request('/payment', userId)).status, 403);
    assert.equal((await request('/payment', null)).status, 401);
    assert.equal((await request('/payment/507f1f77bcf86cd799439099')).status, 404);
    const thirdId = '507f1f77bcf86cd799439015';
    payments.set(thirdId, { ...payments.get(rejectedId), _id: thirdId, paymentStatus: 'PENDING', rejectionReason: null });
    user.isSubscribed = false;
    const statusUpdate = await request(`/payment/${thirdId}/status`, adminId, 'PUT', { status: 'REJECTED', rejectionReason: 'Wrong amount' });
    assert.equal(statusUpdate.status, 200);
    assert.equal(payments.get(thirdId).paymentStatus, 'REJECTED');
    assert.equal(user.isSubscribed, false);
    assert.equal(user.currentsubscriptionStatus, 'INACTIVE');
});

test('receipt images use valid production URLs without duplicating existing URLs', (context) => {
    const previousNodeEnv = process.env.NODE_ENV;
    const previousBase = process.env.BASE_URL;
    process.env.NODE_ENV = 'production';
    process.env.BASE_URL = 'https://example.test/';
    context.after(() => {
        if (previousNodeEnv === undefined) delete process.env.NODE_ENV; else process.env.NODE_ENV = previousNodeEnv;
        if (previousBase === undefined) delete process.env.BASE_URL; else process.env.BASE_URL = previousBase;
    });
    const receipt = PaymentModel.hydrate({ receiptImageUrl: 'receipt.jpeg' });
    assert.equal(receipt.receiptImageUrl, 'https://example.test/uploads/payments/receipt.jpeg');
    const external = PaymentModel.hydrate({ receiptImageUrl: 'https://example.test/already.jpeg' });
    assert.equal(external.receiptImageUrl, 'https://example.test/already.jpeg');
});

test('court API combines name, court type and governorate filters', async (context) => {
    let filter;
    context.mock.method(CourtTypeModel, 'find', () => ({ async select() { return [{ name: 'Civil' }]; } }));
    context.mock.method(GovernorateModel, 'find', () => ({ async select() { return [{ name: 'Cairo' }]; } }));
    context.mock.method(QueryBuilder.prototype, 'execute', async function () {
        filter = this.mongooseQuery.getFilter();
        return { data: [], pagination: { totalDocuments: 0, page: 1, limit: 10 } };
    });
    const server = app.listen(0, '127.0.0.1');
    context.after(() => new Promise((resolve, reject) => { server.close((error) => error ? reject(error) : resolve()); server.closeAllConnections(); }));
    await once(server, 'listening');
    const response = await fetch(`http://127.0.0.1:${server.address().port}/api/v1/courts?name=North&courtType=Civil&governorate=Cairo&page=1&limit=10`);
    assert.equal(response.status, 200);
    assert.ok(new RegExp(filter.name.$regex, 'i').test('North Court'));
    assert.ok(filter.courtType.$in[0].test('Civil'));
    assert.ok(filter.governorate.$in[0].test('Cairo'));
});
