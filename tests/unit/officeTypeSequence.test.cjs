const test = require('node:test');
const assert = require('node:assert/strict');
const Type = require('../../dist/infrastructure/database/models/officeTypeModel').default;
const Sequence = require('../../dist/infrastructure/database/models/sequenceModel').default;
const { nextOfficeTypeId } = require('../../dist/infrastructure/database/repositories/officeTypeSequence');
const repo = require('../../dist/infrastructure/database/repositories/officeTypeRepoImpl').default;

test('office type IDs continue after existing IDs, stay unique concurrently, and are not reused', async context => {
  let highest = 14;
  let counter = 0;
  context.mock.method(Type, 'findOne', () => ({ sort() { return this; }, select() { return this; }, lean: async () => ({ id: highest }) }));
  context.mock.method(Sequence, 'updateOne', async (filter, update) => { counter = Math.max(counter, update.$max.value); });
  context.mock.method(Sequence, 'findOneAndUpdate', async (filter, update) => ({ value: counter += update.$inc.value }));
  assert.deepEqual(await Promise.all([nextOfficeTypeId(), nextOfficeTypeId(), nextOfficeTypeId()]), [15, 16, 17]);
  highest = 0;
  assert.equal(await nextOfficeTypeId(), 18);
  context.mock.method(Type, 'create', async data => { assert.equal(data.id, 19); return data; });
  await repo.createOfficeType({ name: 'Registry', id: 999 });
});

test('empty office type collection starts at one and handles concurrent counter initialization', async context => {
  context.mock.method(Type, 'findOne', () => ({ sort() { return this; }, select() { return this; }, lean: async () => null }));
  let calls = 0;
  context.mock.method(Sequence, 'updateOne', async (filter, update, options) => {
    calls++;
    if (calls === 1) { assert.equal(options.upsert, true); throw Object.assign(Error('duplicate'), { code: 11000 }); }
    assert.equal(options, undefined);
  });
  context.mock.method(Sequence, 'findOneAndUpdate', async () => ({ value: 1 }));
  assert.equal(await nextOfficeTypeId(), 1);
  assert.equal(calls, 2);
});

test('sequence failure prevents office type creation', async context => {
  context.mock.method(Type, 'findOne', () => ({ sort() { return this; }, select() { return this; }, lean: async () => null }));
  context.mock.method(Sequence, 'updateOne', async () => { throw Error('Database unavailable'); });
  context.mock.method(Type, 'create', () => assert.fail('must not create without allocated ID'));
  await assert.rejects(repo.createOfficeType({ name: 'Registry' }), /Database unavailable/);
});
