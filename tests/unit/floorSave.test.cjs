const test = require('node:test');
const assert = require('node:assert/strict');
const Floor = require('../../dist/infrastructure/database/models/floorModel').default;
const Court = require('../../dist/infrastructure/database/models/courtModel').default;

test('saving a floor completes and updates its court after persisting the image', async (context) => {
    const court = '507f1f77bcf86cd799439011';
    const updates = [];
    context.mock.method(Floor.collection, 'insertOne', async (doc) => ({ acknowledged: true, insertedId: doc._id }));
    context.mock.method(Floor, 'countDocuments', async (filter) => {
        assert.equal(String(filter.court), court);
        return 2;
    });
    context.mock.method(Court, 'findByIdAndUpdate', async (id, update) => {
        assert.equal(String(id), court);
        updates.push(update);
    });
    const floor = new Floor({ court, floorName: 'First floor', image: 'plan.jpeg' });
    await floor.save();
    assert.equal(floor.isNew, false);
    assert.equal(floor.image, 'plan.jpeg');
    assert.deepEqual(updates, [{ nFloors: 2 }, { $addToSet: { floors: floor._id } }]);
});

test('floor save preserves the original court update error', async (context) => {
    context.mock.method(Floor.collection, 'insertOne', async (doc) => ({ acknowledged: true, insertedId: doc._id }));
    context.mock.method(Floor, 'countDocuments', async () => 1);
    const failure = new Error('Court update failed');
    context.mock.method(Court, 'findByIdAndUpdate', async () => { throw failure; });
    const floor = new Floor({ court: '507f1f77bcf86cd799439011', floorName: 'First floor', image: 'plan.jpeg' });
    await assert.rejects(floor.save(), (error) => error === failure);
});
