const test = require("node:test");
const assert = require("node:assert/strict");
const Office = require("../../dist/infrastructure/database/models/officeModel").default;
const Type = require("../../dist/infrastructure/database/models/officeTypeModel").default;
const repo = require("../../dist/infrastructure/database/repositories/officeRepoImpl").default;
const id = "507f1f77bcf86cd799439011";

test("office search covers all four fields and retains pagination", async context => {
  let filter;
  let skip;
  const query = {
    find(value) { filter = value; return this; }, sort() { return this; }, select() { return this; }, populate() { return this; },
    getOptions() { return { sort: {} }; }, clone() { return this; },
    countDocuments() { return { exec: async () => 25 }; },
    skip(value) { skip = value; return this; }, limit() { return this; }, lean() { return this; }, exec: async () => [],
  };
  context.mock.method(Office, "find", () => query);
  const result = await repo.getOffices({ name: "Cairo", page: 2, limit: 10 });
  assert.deepEqual(filter.$or.map(item => Object.keys(item)[0]), ["name", "governorate", "courtName", "courtType"]);
  assert.equal(skip, 10);
  assert.equal(result.pagination.totalDocuments, 25);
});

test("court name filter does not become a court ID filter", async context => {
  let filter;
  const query = {
    find(value) { filter = value; return this; }, sort() { return this; }, select() { return this; }, populate() { return this; },
    getOptions() { return { sort: {} }; }, clone() { return this; },
    countDocuments() { return { exec: async () => 0 }; },
    skip() { return this; }, limit() { return this; }, lean() { return this; }, exec: async () => [],
  };
  context.mock.method(Office, "find", () => query);
  await repo.getOffices({ courtName: "Court", governorate: "Cairo" });
  assert.ok(filter.courtName.$regex);
  assert.ok(filter.governorate.$regex);
  assert.equal(filter.court, undefined);
});

test("office type update refreshes stored office name", async context => {
  context.mock.method(Office, "findById", async () => ({ floor: id }));
  context.mock.method(Type, "findById", async () => ({ name: "Registry" }));
  context.mock.method(Office, "findByIdAndUpdate", (value, update) => {
    assert.equal(update.$set.name, "Registry");
    return { lean: async () => update.$set };
  });
  await repo.updateOfficeById(id, { officeType: id });
});

test("office update allows a blank or duplicate room number", async context => {
  context.mock.method(Office, "findById", async () => ({ floor: id }));
  context.mock.method(Office, "findByIdAndUpdate", (value, update) => {
    assert.equal(update.$set.roomNumber, "");
    return { lean: async () => update.$set };
  });
  await repo.updateOfficeById(id, { roomNumber: "   " });
});
