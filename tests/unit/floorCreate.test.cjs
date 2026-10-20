const test = require('node:test');
const assert = require('node:assert/strict');
const Floor = require('../../dist/infrastructure/database/models/floorModel').default;
const { floorRepoImpl } = require('../../dist/infrastructure/database/repositories/floorRepoImpl');

for (const legacy of [true, false]) {
    test(`floor creation explains ${legacy ? 'legacy global index' : 'duplicate within court'} errors`, async (context) => {
        context.mock.method(console, 'error', () => {});
        context.mock.method(Floor, 'create', async () => {
            throw Object.assign(new Error('duplicate key'), {
                code: 11000, keyPattern: legacy ? { floorName: 1 } : { court: 1, floorName: 1 },
            });
        });
        await assert.rejects(floorRepoImpl.createFloor({}), (error) => {
            assert.equal(error.statusCode, 409);
            assert.match(error.message, legacy ? /index migration/ : /already exists/);
            return true;
        });
    });
}
