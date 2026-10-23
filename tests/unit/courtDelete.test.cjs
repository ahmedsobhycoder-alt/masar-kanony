const test = require('node:test');
const assert = require('node:assert/strict');
const Court = require('../../dist/infrastructure/database/models/courtModel').default;
const Floor = require('../../dist/infrastructure/database/models/floorModel').default;
const Office = require('../../dist/infrastructure/database/models/officeModel').default;
const { courtRepoImpl } = require('../../dist/infrastructure/database/repositories/courtRepoImpl');
const id = '507f1f77bcf86cd799439011';

for (const floors of [[], [{ _id: '507f1f77bcf86cd799439012' }]]) {
    test(`court deletion cascades with ${floors.length} floors`, async (context) => {
        const calls = [];
        const court = { _id: id };
        context.mock.method(Court, 'findById', async () => court);
        context.mock.method(Floor, 'find', (filter) => {
            assert.deepEqual(filter, { court: id });
            return { select: () => ({ lean: async () => floors }) };
        });
        context.mock.method(Office, 'deleteMany', async (filter) => {
            assert.deepEqual(filter, { $or: [{ court: id }, { floor: { $in: floors.map(f => f._id) } }] });
            calls.push('offices');
        });
        context.mock.method(Floor, 'deleteMany', async (filter) => {
            assert.deepEqual(filter, { court: id });
            calls.push('floors');
        });
        context.mock.method(Court, 'findByIdAndDelete', async (value) => {
            assert.equal(value, id);
            calls.push('court');
            return court;
        });
        assert.equal(await courtRepoImpl.deleteCourtById(id), court);
        assert.deepEqual(calls, ['offices', 'floors', 'court']);
    });
}

test('missing court does not delete children', async (context) => {
    context.mock.method(Court, 'findById', async () => null);
    context.mock.method(Office, 'deleteMany', () => assert.fail('must not delete offices'));
    context.mock.method(Floor, 'deleteMany', () => assert.fail('must not delete floors'));
    assert.equal(await courtRepoImpl.deleteCourtById(id), null);
});

test('child deletion failure keeps the court for retry', async (context) => {
    context.mock.method(Court, 'findById', async () => ({ _id: id }));
    context.mock.method(Floor, 'find', () => ({ select: () => ({ lean: async () => [] }) }));
    const failure = new Error('Delete failed');
    context.mock.method(Office, 'deleteMany', async () => { throw failure; });
    context.mock.method(Floor, 'deleteMany', () => assert.fail('must stop on failure'));
    context.mock.method(Court, 'findByIdAndDelete', () => assert.fail('must retain court'));
    await assert.rejects(courtRepoImpl.deleteCourtById(id), error => error === failure);
});
