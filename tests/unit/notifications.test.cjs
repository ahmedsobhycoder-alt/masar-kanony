const test = require('node:test');
const assert = require('node:assert/strict');
const { NotificationController } = require('../../dist/presentation/controllers/notificationController');
const User = require('../../dist/infrastructure/database/models/userModel').default;
const Notification = require('../../dist/infrastructure/database/models/notificationModel').default;
const firebase = require('../../dist/infrastructure/services/firebaseService');

function invoke(handler, req) {
  return new Promise((resolve, reject) => {
    handler(req, { status() { return this; }, json: resolve }, reject);
  });
}
test('broadcast saves every recipient and reports partial device failure, removing expired tokens', async (ctx) => {
  const saved = []; const updates = []; const batches = [];
  ctx.mock.method(firebase, 'getFcm', () => ({ sendEachForMulticast: async (payload) => {
    batches.push(payload);
    return { successCount: 1, failureCount: 1, responses: [{ success: true }, { error: { code: 'messaging/registration-token-not-registered' } }] };
  } }));
  ctx.mock.method(User, 'find', (filter) => {
    assert.deepEqual(filter, { active: true });
    return { select() { return this; }, async *cursor() {
      yield { _id: 'one', fcmTokens: ['valid', 'expired', 'valid'] };
      yield { _id: 'two', fcmTokens: [] };
    } };
  });
  ctx.mock.method(Notification, 'create', async (data) => { saved.push(data); });
  ctx.mock.method(User, 'updateOne', async (...args) => { updates.push(args); });
  const result = await invoke(new NotificationController({}).createNotification, { body: { audience: 'all', title: 'Hello', body: 'A message', data: { count: 2 } }, t: (key) => key });
  assert.deepEqual(result.data, { recipients: 2, sent: 1, failed: 1, noDevice: 1 });
  assert.equal(saved.length, 2);
  assert.deepEqual(batches[0].tokens, ['valid', 'expired']);
  assert.equal(batches[0].data.count, '2');
  assert.deepEqual(updates[0][1], { $pull: { fcmTokens: { $in: ['expired'] } } });
});
test('specific user must exist before any send', async (ctx) => {
  ctx.mock.method(User, 'exists', async () => false);
  await assert.rejects(invoke(new NotificationController({}).createNotification, { body: { userId: 'missing', title: 'Hello', body: 'Message' } }), /User not found/);
});
test('device token registration uses the authenticated user and deduplicates', async (ctx) => {
  let update;
  ctx.mock.method(User, 'updateOne', async (...args) => { update = args; });
  await invoke(new NotificationController({}).registerToken, { method: 'POST', user: { _id: 'current' }, body: { token: 'device' } });
  assert.deepEqual(update, [{ _id: 'current' }, { $addToSet: { fcmTokens: 'device' } }]);
});

test('notification access rejects other users and permits owners and admins', async (ctx) => {
  const { getNotificationValidator, deleteNotificationValidator } = require('../../dist/presentation/validators/notificationValidators');
  const { validationResult } = require('express-validator');
  ctx.mock.method(Notification, 'findById', async () => ({ userId: 'owner' }));
  for (const validators of [getNotificationValidator, deleteNotificationValidator]) {
    for (const [user, denied] of [[{ _id: 'stranger', role: 'user' }, true], [{ _id: 'owner', role: 'user' }, false], [{ _id: 'admin', role: 'admin' }, false]]) {
      const req = { params: { id: '507f1f77bcf86cd799439011' }, user };
      await validators[0].run(req);
      assert.equal(!validationResult(req).isEmpty(), denied);
    }
  }
});
