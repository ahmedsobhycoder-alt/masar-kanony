const test = require('node:test');
const assert = require('node:assert/strict');
const Activity = require('../../dist/infrastructure/database/models/courtActivityModel').default;
const { auditCourtAction } = require('../../dist/shared/utils/courtActivity');
const admin = { _id: '507f1f77bcf86cd799439011', name: 'Admin', email: 'admin@example.com' };
const court = { _id: '507f1f77bcf86cd799439012', name: 'Court' };
for (const action of ['created', 'updated', 'deleted']) {
  test(`court ${action} retains admin identity and court snapshot`, async context => {
    const order = [];
    context.mock.method(Activity, 'create', async data => {
      assert.equal(data.admin, admin._id);
      assert.equal(data.adminName, admin.name);
      assert.equal(data.action, action);
      order.push('reserved');
      return { _id: 'entry' };
    });
    context.mock.method(Activity, 'updateOne', async (filter, update) => {
      assert.equal(update.$set.status, 'completed');
      assert.equal(update.$set.courtName, court.name);
      assert.equal(update.$set.court, court._id);
      order.push('recorded');
    });
    assert.equal(await auditCourtAction(admin, action, court._id, async () => { order.push('mutation'); return court; }), court);
    assert.deepEqual(order, ['reserved', 'mutation', 'recorded']);
  });
}
test('failed court mutation is not recorded as successful activity', async context => {
  context.mock.method(Activity, 'create', async () => ({ _id: 'entry' }));
  context.mock.method(Activity, 'updateOne', async (filter, update) => assert.equal(update.$set.status, 'failed'));
  await assert.rejects(auditCourtAction(admin, 'deleted', court._id, async () => { throw Error('Failed'); }), /Failed/);
});
test('court is not mutated when reserving audit history fails', async context => {
  context.mock.method(Activity, 'create', async () => { throw Error('Unavailable'); });
  await assert.rejects(auditCourtAction(admin, 'deleted', court._id, async () => assert.fail('must retain court')), /Unavailable/);
});
