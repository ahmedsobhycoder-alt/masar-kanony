const test = require('node:test');
const assert = require('node:assert/strict');
const { once } = require('node:events');
const jwt = require('jsonwebtoken');
const app = require('../../dist/app').default;
const UserModel = require('../../dist/infrastructure/database/models/userModel').default;
const WalletModel = require('../../dist/infrastructure/database/models/paymentOptionModel').default;
const PaymentModel = require('../../dist/infrastructure/database/models/paymentModel').default;
const RevokedTokenModel = require('../../dist/infrastructure/database/models/revokedTokenModel').default;

test('the compiled application serves the dashboard user and wallet APIs', async (context) => {
    const originalSecret = process.env.JWT_SECRET;
    process.env.JWT_SECRET = 'admin-management-integration-test';
    context.after(() => {
        if (originalSecret === undefined) delete process.env.JWT_SECRET;
        else process.env.JWT_SECRET = originalSecret;
    });
    const admin = { _id: '507f1f77bcf86cd799439011', role: 'admin', active: true };
    context.mock.method(UserModel, 'findById', async () => admin);
    context.mock.method(RevokedTokenModel, 'exists', async () => false);
    const query = (rows) => ({ select() { return this; }, sort() { return this; }, skip() { return this; }, limit() { return this; }, async lean() { return rows; } });
    context.mock.method(UserModel, 'find', () => query([{ _id: '507f1f77bcf86cd799439012', name: 'Example user', isSubscribed: true }]));
    context.mock.method(UserModel, 'countDocuments', async () => 1);
    context.mock.method(WalletModel, 'find', () => query([{ _id: '507f1f77bcf86cd799439013', paymentType: 'Example wallet', phone: '01012345678' }]));
    context.mock.method(WalletModel, 'countDocuments', async () => 1);
    context.mock.method(PaymentModel, 'aggregate', async () => [{ _id: 'Example wallet', count: 3 }]);
    const server = app.listen(0, '127.0.0.1');
    context.after(() => new Promise((resolve, reject) => {
        server.close((error) => error ? reject(error) : resolve());
        server.closeAllConnections();
    }));
    await once(server, 'listening');
    const base = `http://127.0.0.1:${server.address().port}/api/v1/admin-management`;
    const headers = { Authorization: `Bearer ${jwt.sign({ id: admin._id }, process.env.JWT_SECRET)}` };

    for (const path of ['/users?page=1&limit=10&search=', '/wallets?page=1&limit=10&search=']) {
        const response = await fetch(`${base}${path}`, { headers });
        assert.equal(response.status, 200, path);
        const result = await response.json();
        assert.equal(result.status, true);
        assert.equal(result.data.list.length, 1);
        assert.equal(result.data.paginationResult.totalDocuments, 1);
    }
    for (const path of ['/users/stats', '/wallets/stats']) {
        const response = await fetch(`${base}${path}`, { headers });
        assert.equal(response.status, 200, path);
        assert.equal((await response.json()).data.total, 1);
    }
    const unauthenticated = await fetch(`${base}/users?page=1&limit=10&search=`);
    assert.equal(unauthenticated.status, 401);
});
