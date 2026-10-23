const test = require('node:test');
const assert = require('node:assert/strict');
const { fromStringToList } = require('../../dist/shared/utils/helpers');
const { CourtController } = require('../../dist/presentation/controllers/courtController');
const Court = require('../../dist/infrastructure/database/models/courtModel').default;
const { courtRepoImpl } = require('../../dist/infrastructure/database/repositories/courtRepoImpl');

test('filter parsing supports query strings and validated arrays', () => {
  assert.deepEqual(fromStringToList(' Cairo, Giza '), ['Cairo', 'Giza']);
  assert.deepEqual(fromStringToList([' Cairo ', 'Giza']), ['Cairo', 'Giza']);
  assert.deepEqual(fromStringToList(undefined), []);
});

for (const filters of [
  { governorate: ['Cairo'] },
  { courtType: ['Civil'] },
  { governorate: ['Cairo'], courtType: ['Civil'] },
]) {
  test(`validated court filters reach database: ${Object.keys(filters).join(' + ')}`, async context => {
    const controller = new CourtController({});
    const queries = controller.getCourtQueries({
      query: { page: '2', limit: '5' }, ...filters,
    });
    for (const [field, values] of Object.entries(filters)) assert.deepEqual(queries[field], values);
    assert.equal(queries.page, '2');
    assert.equal(queries.limit, '5');
    let databaseFilter;
    let offset;
    const query = {
      find(filter) { databaseFilter = filter; return this; },
      sort() { return this; }, select() { return this; }, populate() { return this; },
      getOptions() { return { sort: {} }; }, clone() { return this; },
      countDocuments() { return { exec: async () => 12 }; },
      skip(value) { offset = value; return this; }, limit() { return this; },
      lean() { return this; }, exec: async () => [],
    };
    context.mock.method(Court, 'find', () => query);
    const result = await courtRepoImpl.getCourts(queries);
    for (const [field, values] of Object.entries(filters)) {
      assert.ok(databaseFilter[field].$in[0] instanceof RegExp);
      assert.ok(databaseFilter[field].$in[0].test(values[0]));
    }
    assert.equal(offset, 5);
    assert.equal(result.pagination.totalDocuments, 12);
  });
}
