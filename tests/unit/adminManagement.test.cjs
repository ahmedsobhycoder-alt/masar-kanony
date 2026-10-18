const test = require('node:test');
const assert = require('node:assert/strict');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const router = require('../../dist/presentation/routes/adminManagementRoute').default;
const UserModel = require('../../dist/infrastructure/database/models/userModel').default;
const WalletModel = require('../../dist/infrastructure/database/models/paymentOptionModel').default;
const RevokedTokenModel = require('../../dist/infrastructure/database/models/revokedTokenModel').default;
const PaymentModel = require('../../dist/infrastructure/database/models/paymentModel').default;
const { createPaymentValidator } = require('../../dist/presentation/validators/paymentValidator');
const { protect, optionalProtect, allowedTo } = require('../../dist/presentation/middlewares/authMiddleware');

const invoke = async (method, path, req) => {
    const layer = router.stack.find((item) => item.route?.path === path && item.route.methods[method]);
    let result;
    const res = { statusCode: 200, status(code) { this.statusCode = code; return this; }, json(value) { result = value; return this; } };
    await layer.route.stack.at(-1).handle(req, res, (error) => { throw error; });
    return { result, status: res.statusCode };
};

test('user search escapes patterns and checks name, email and phone without exposing credentials', async (context) => {
    let filter;
    let projection;
    const chain = { select(value) { projection = value; return this; }, sort() { return this; }, skip() { return this; }, limit() { return this; }, async lean() { return []; } };
    context.mock.method(UserModel, 'find', (value) => { filter = value; return chain; });
    context.mock.method(UserModel, 'countDocuments', async () => 0);
    await invoke('get', '/users', { query: { search: 'name.*' } });
    assert.deepEqual(filter.$or.map((item) => Object.keys(item)[0]), ['name', 'email', 'phone']);
    assert.equal(filter.$or[0].name.$regex, 'name\\.\\*');
    assert.ok(projection.includes('isSubscribed'));
    assert.ok(!projection.includes('password'));
    assert.ok(!projection.includes('resetCode'));
});

test('user summaries count all accounts independently of table search', async (context) => {
    context.mock.method(UserModel, 'countDocuments', async (filter) => filter ? 4 : 10);
    const { result } = await invoke('get', '/users/stats', { query: { search: 'someone' } });
    assert.deepEqual(result.data, { total: 10, subscribed: 4, unsubscribed: 6 });
});

test('administrators cannot block or demote themselves', async () => {
    const req = { params: { id: 'admin-id' }, user: { _id: 'admin-id' }, body: { active: false } };
    await assert.rejects(invoke('put', '/users/:id', req), /own account/);
    req.body = { role: 'user' };
    await assert.rejects(invoke('put', '/users/:id', req), /own account/);
});

test('user updates allow roles and blocking but ignore injected subscription and password fields', async (context) => {
    let update;
    context.mock.method(UserModel, 'findByIdAndUpdate', (id, data) => {
        update = data;
        return { select() { return this; }, async lean() { return { _id: id, ...data.$set }; } };
    });
    await invoke('put', '/users/:id', { params: { id: 'user-id' }, user: { _id: 'admin-id' }, body: { role: 'admin', active: false, password: 'injected', isSubscribed: true } });
    assert.deepEqual(update, { $set: { role: 'admin', active: false } });
});

test('wallet deactivation updates availability and preserves payment history', async (context) => {
    let update;
    context.mock.method(WalletModel, 'findByIdAndUpdate', async (id, data) => { update = data; return { _id: id, ...data.$set }; });
    const { result } = await invoke('put', '/wallets/:id', { params: { id: 'wallet-id' }, body: { active: false, injected: true } });
    assert.deepEqual(update, { $set: { active: false } });
    assert.equal(result.data.active, false);
});

test('admin-created accounts are verified and cannot inject subscription fields', async (context) => {
    let created;
    context.mock.method(UserModel, 'exists', async () => false);
    context.mock.method(UserModel, 'create', async (data) => { created = data; return { _id: 'new-user' }; });
    context.mock.method(UserModel, 'findById', () => ({ select() { return this; }, async lean() { return { name: 'New user' }; } }));
    const { status } = await invoke('post', '/users', { body: { name: 'New user', email: 'new@example.com', phone: '01012345678', password: 'password123', role: 'user', isSubscribed: true, resetCode: 'injected' } });
    assert.equal(status, 201);
    assert.equal(created.verified, true);
    assert.equal(created.password, 'password123');
    assert.equal(created.isSubscribed, undefined);
    assert.equal(created.resetCode, undefined);
});

test('new user validation rejects invalid contact details, short passwords and unsupported roles', async () => {
    const layer = router.stack.find((item) => item.route?.path === '/users' && item.route.methods.post);
    const req = { body: { name: 'Valid name', email: 'not-email', phone: '123', password: 'short', role: 'superadmin' }, query: {}, params: {}, headers: {} };
    for (const middleware of layer.route.stack) if (middleware.handle.run) await middleware.handle.run(req);
    const fields = validationResult(req).array().map((item) => item.path);
    for (const field of ['email', 'phone', 'password', 'role']) assert.ok(fields.includes(field));
});

test('wallet summaries rank types by payment request usage', async (context) => {
    let pipeline;
    context.mock.method(WalletModel, 'countDocuments', async (filter) => filter ? 2 : 3);
    context.mock.method(PaymentModel, 'aggregate', async (value) => { pipeline = value; return [{ _id: 'Vodafone Cash', count: 8 }]; });
    const { result } = await invoke('get', '/wallets/stats', {});
    assert.equal(result.data.mostUsed._id, 'Vodafone Cash');
    assert.equal(result.data.mostUsed.count, 8);
    assert.equal(result.data.active, 2);
    assert.deepEqual(pipeline[0], { $group: { _id: '$walletType', count: { $sum: 1 } } });
});

test('payment validation requires an active wallet with the matching phone and type', async (context) => {
    let available = true;
    const filters = [];
    context.mock.method(WalletModel, 'exists', async (filter) => { filters.push(filter); return available; });
    const validate = async () => {
        const req = { body: { walletNumber: '01012345678', walletType: 'Vodafone Cash' }, query: {}, params: {}, headers: {} };
        for (const validator of createPaymentValidator) if (validator.run) await validator.run(req);
        return validationResult(req).array().filter((item) => ['walletType', 'walletNumber'].includes(item.path));
    };
    assert.equal((await validate()).length, 0);
    assert.deepEqual(filters[0], { phone: '01012345678', paymentType: 'Vodafone Cash', active: { $ne: false } });
    available = false;
    assert.ok((await validate()).length > 0);
});

test('admin routes reject missing authentication and ordinary users', async () => {
    const req = { headers: {}, t: (value) => value };
    let error;
    await protect(req, {}, (value) => { error = value; });
    assert.equal(error.statusCode, 401);
    await allowedTo(['admin'])({ user: { role: 'user' }, t: (value) => value }, {}, (value) => { error = value; });
    assert.equal(error.statusCode, 403);
});

test('blocked users lose authenticated access even with an existing valid token', async (context) => {
    const previous = process.env.JWT_SECRET;
    process.env.JWT_SECRET = 'admin-management-test-secret';
    context.after(() => { if (previous === undefined) delete process.env.JWT_SECRET; else process.env.JWT_SECRET = previous; });
    const token = jwt.sign({ id: 'blocked-user' }, process.env.JWT_SECRET);
    context.mock.method(RevokedTokenModel, 'exists', async () => false);
    context.mock.method(UserModel, 'findById', async () => ({ active: false }));
    const req = { headers: { authorization: `Bearer ${token}` }, t: (value) => value };
    let error;
    await protect(req, {}, (value) => { error = value; });
    assert.equal(error.statusCode, 401);
    await optionalProtect(req, {}, () => {});
    assert.equal(req.user, null);
});
