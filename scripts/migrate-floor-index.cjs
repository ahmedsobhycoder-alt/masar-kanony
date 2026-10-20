require('dotenv').config();
const mongoose = require('mongoose');
const Floor = require('../dist/infrastructure/database/models/floorModel').default;
(async () => {
  const uri = process.env.DB_URI || process.env.MONGODB_URI || process.env.MONGO_URI;
  if (!uri) throw new Error('Set DB_URI to the database connection URI');
  await mongoose.connect(uri);
  // Build the replacement first; duplicates abort before removing the old index.
  await Floor.collection.createIndex({ court: 1, floorName: 1 }, { unique: true });
  const indexes = await Floor.collection.indexes();
  for (const index of indexes) {
    if (index.unique && Object.keys(index.key).length === 1 && index.key.floorName === 1) {
      await Floor.collection.dropIndex(index.name);
    }
  }
})().then(() => mongoose.disconnect()).catch(async (error) => { console.error(error.message); await mongoose.disconnect(); process.exitCode = 1; });
