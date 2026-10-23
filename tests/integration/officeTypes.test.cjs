const test = require('node:test');
const assert = require('node:assert/strict');
const { once } = require('node:events');
const jwt = require('jsonwebtoken');
const app = require('../../dist/app').default;
const User = require('../../dist/infrastructure/database/models/userModel').default;
const Revoked = require('../../dist/infrastructure/database/models/revokedTokenModel').default;
const Type = require('../../dist/infrastructure/database/models/officeTypeModel').default;
const Sequence = require('../../dist/infrastructure/database/models/sequenceModel').default;
const Office = require('../../dist/infrastructure/database/models/officeModel').default;

test('office type mutations enforce admin access, validate data, sync names and protect referenced types', async context => {
  const original = process.env.JWT_SECRET;
  process.env.JWT_SECRET = 'office-types-test';
  context.after(() => { if (original === undefined) delete process.env.JWT_SECRET; else process.env.JWT_SECRET = original; });
  let role = 'admin';
  let referenced = true;
  const id = '507f1f77bcf86cd799439011';
  const data = { _id: id, id: 7, name: 'Registry', description: 'Services' };
  context.mock.method(User, 'findById', async () => ({ _id: id, role, active: true, name: 'Admin' }));
  context.mock.method(Revoked, 'exists', async () => false);
  context.mock.method(Type, 'findOne', () => ({ sort() { return this; }, select() { return this; }, lean: async () => ({ id: 6 }) }));
  context.mock.method(Sequence, 'updateOne', async () => ({}));
  context.mock.method(Sequence, 'findOneAndUpdate', async () => ({ value: 7 }));
  context.mock.method(Type, 'create', async payload => { assert.equal(payload.id, 7); assert.equal(payload.name, 'Registry'); return data; });
  context.mock.method(Type, 'findByIdAndUpdate', async (value, update) => { assert.equal(update.$set.id, undefined); return { ...data, name: update.$set.name, toJSON() { return { ...data, name: this.name }; } }; });
  context.mock.method(Office, 'updateMany', async (filter, update) => { assert.equal(filter.officeType, id); assert.equal(update.$set.name, 'Updated registry'); });
  context.mock.method(Office, 'exists', async () => referenced);
  context.mock.method(Type, 'findByIdAndDelete', async () => ({ toJSON: () => data }));
  const server = app.listen(0, '127.0.0.1');
  await once(server, 'listening');
  context.after(() => { server.closeAllConnections(); return new Promise(resolve => server.close(resolve)); });
  const base = `http://127.0.0.1:${server.address().port}/api/v1`;
  const headers = { 'Content-Type': 'application/json', Authorization: `Bearer ${jwt.sign({ id }, process.env.JWT_SECRET)}` };
  const request = (path, method, body, auth = true) => fetch(base + path, { method, headers: auth ? headers : { 'Content-Type': 'application/json' }, ...(body ? { body: JSON.stringify(body) } : {}) });
  assert.equal((await request('/officeTypes', 'POST', data, false)).status, 401);
  role = 'user';
  assert.equal((await request('/officeTypes', 'POST', data)).status, 403);
  assert.equal((await request('/courts/activity', 'GET')).status, 403);
  role = 'admin';
  assert.equal((await request('/officeTypes', 'POST', { name: '   ' })).status, 400);
  assert.equal((await request('/officeTypes', 'POST', { name: 'Registry', description: 'Services' })).status, 201);
  assert.equal((await request(`/officeTypes/${id}`, 'PUT', { name: 'Updated registry', id: 999 })).status, 400);
  assert.equal((await request(`/officeTypes/${id}`, 'PUT', { name: 'Updated registry' })).status, 200);
  assert.equal((await request(`/officeTypes/${id}`, 'DELETE')).status, 409);
  referenced = false;
  assert.equal((await request(`/officeTypes/${id}`, 'DELETE')).status, 200);
  assert.equal((await request('/courts/activity?court=invalid', 'GET')).status, 400);
});

test('court HTTP mutations record the signed-in admin and history is admin-only', async context => {
  const Activity = require('../../dist/infrastructure/database/models/courtActivityModel').default;
  const { CourtUseCases } = require('../../dist/domain/usecases/courtUseCases');
  const CourtType = require('../../dist/infrastructure/database/models/courtTypeModel').default;
  const Governorate = require('../../dist/infrastructure/database/models/governorateModel').default;
  const original = process.env.JWT_SECRET;
  process.env.JWT_SECRET = 'court-activity-test';
  context.after(() => { if (original === undefined) delete process.env.JWT_SECRET; else process.env.JWT_SECRET = original; });
  const id = '507f1f77bcf86cd799439011';
  const court = { _id: '507f1f77bcf86cd799439012', name: 'Test court' };
  const recorded = [];
  let entry;
  context.mock.method(User, 'findById', async () => ({ _id: id, name: 'Signed-in admin', email: 'admin@example.com', role: 'admin', active: true }));
  context.mock.method(Revoked, 'exists', async () => false);
  context.mock.method(CourtType, 'findById', async () => ({ name: 'Civil' }));
  context.mock.method(Governorate, 'findById', async () => ({ name: 'Cairo' }));
  for (const method of ['createCourt', 'updateCourtById', 'deleteCourtById']) context.mock.method(CourtUseCases.prototype, method, async () => court);
  context.mock.method(Activity, 'create', async data => { entry = data; return { _id: id }; });
  context.mock.method(Activity, 'updateOne', async (filter, update) => { recorded.push({ ...entry, ...update.$set }); });
  const query = {
    find(filter) { assert.equal(filter.status.$eq, 'completed'); return this; },
    sort() { return this; }, getOptions() { return { sort: {} }; }, clone() { return this; },
    countDocuments() { return { exec: async () => recorded.length }; },
    skip() { return this; }, limit() { return this; }, lean() { return this; }, exec: async () => recorded,
  };
  context.mock.method(Activity, 'find', () => query);
  const server = app.listen(0, '127.0.0.1');
  await once(server, 'listening');
  context.after(() => { server.closeAllConnections(); return new Promise(resolve => server.close(resolve)); });
  const base = `http://127.0.0.1:${server.address().port}/api/v1/courts`;
  const headers = { 'Content-Type': 'application/json', Authorization: `Bearer ${jwt.sign({ id }, process.env.JWT_SECRET)}` };
  assert.equal((await fetch(base, { method: 'POST', headers, body: JSON.stringify({ name: court.name, address: 'Street', governorate: id, courtType: id, admin: 'forged' }) })).status, 201);
  assert.equal((await fetch(`${base}/${court._id}`, { method: 'PUT', headers, body: JSON.stringify({ name: court.name, admin: 'forged' }) })).status, 200);
  assert.equal((await fetch(`${base}/${court._id}`, { method: 'DELETE', headers })).status, 200);
  assert.deepEqual(recorded.map(item => item.action), ['created', 'updated', 'deleted']);
  for (const item of recorded) {
    assert.equal(item.admin, id);
    assert.equal(item.adminName, 'Signed-in admin');
    assert.equal(item.courtName, court.name);
    assert.equal(item.status, 'completed');
  }
  const response = await fetch(`${base}/activity`, { headers });
  assert.equal(response.status, 200);
  assert.equal((await response.json()).data.list.length, 3);
  assert.equal((await fetch(`${base}/activity`)).status, 401);
});
