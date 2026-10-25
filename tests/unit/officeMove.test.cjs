const test = require('node:test');
const assert = require('node:assert/strict');
const Office = require('../../dist/infrastructure/database/models/officeModel').default;
const Floor = require('../../dist/infrastructure/database/models/floorModel').default;
const Court = require('../../dist/infrastructure/database/models/courtModel').default;
const repo = require('../../dist/infrastructure/database/repositories/officeRepoImpl').default;
const ids = ['507f1f77bcf86cd799439011','507f1f77bcf86cd799439012','507f1f77bcf86cd799439013','507f1f77bcf86cd799439014','507f1f77bcf86cd799439015'];
const office = { _id: ids[0], floor: ids[1], court: ids[2], roomNumber: '101' };
const floor = { _id: ids[3], court: ids[4], floorName: 'First floor' };
const court = { _id: ids[4], name: 'Destination', governorate: 'Cairo', courtType: 'Civil' };

test('moving office updates metadata, floor membership and counts on both sides', async context => {
  context.mock.method(Office, 'findById', async () => office);
  context.mock.method(Floor, 'findById', async () => floor);
  context.mock.method(Court, 'findById', async () => court);
  context.mock.method(Office, 'exists', async query => { assert.equal(query.floor, floor._id); assert.equal(query.roomNumber, '101'); return null; });
  context.mock.method(Office, 'findByIdAndUpdate', (id, update) => {
    assert.equal(update.$set.floorName, floor.floorName);
    assert.equal(update.$set.courtName, court.name);
    assert.equal(update.$set.governorate, court.governorate);
    assert.equal(update.$set.courtType, court.courtType);
    return { lean: async () => ({ ...office, ...update.$set }) };
  });
  const links = [];
  const floors = [];
  const courts = [];
  context.mock.method(Floor, 'updateOne', async (query, update) => links.push([query, update]));
  context.mock.method(Office, 'calculateNumberOfFOfficesPerFloor', async id => floors.push(String(id)));
  context.mock.method(Office, 'calculateNumberOfFOfficesPerCourt', async id => courts.push(String(id)));
  await repo.updateOfficeById(office._id, { floor: floor._id, court: court._id });
  assert.deepEqual(links, [[{ _id: office.floor }, { $pull: { offices: office._id } }], [{ _id: floor._id }, { $addToSet: { offices: office._id } }]]);
  assert.deepEqual(floors, [office.floor, floor._id]);
  assert.deepEqual(courts, [office.court, court._id]);
});

test('move rejects a floor from another court', async context => {
  context.mock.method(Office, 'findById', async () => office);
  context.mock.method(Floor, 'findById', async () => floor);
  context.mock.method(Office, 'findByIdAndUpdate', () => assert.fail('must not write'));
  await assert.rejects(repo.updateOfficeById(office._id, { floor: floor._id, court: office.court }), /does not belong/);
});

test('move checks unchanged room number against destination floor', async context => {
  context.mock.method(Office, 'findById', async () => office);
  context.mock.method(Floor, 'findById', async () => floor);
  context.mock.method(Court, 'findById', async () => court);
  context.mock.method(Office, 'exists', async () => ({ _id: ids[2] }));
  context.mock.method(Office, 'findByIdAndUpdate', () => assert.fail('must not write'));
  await assert.rejects(repo.updateOfficeById(office._id, { floor: floor._id }), /already exists/);
});

test('move rejects missing destination floor', async context => {
  context.mock.method(Office, 'findById', async () => office);
  context.mock.method(Floor, 'findById', async () => null);
  await assert.rejects(repo.updateOfficeById(office._id, { floor: floor._id }), /does not exist/);
});
