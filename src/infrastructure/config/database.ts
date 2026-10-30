
import mongoose from 'mongoose';
// import dns from 'node:dns';
// dns.setServers(['8.8.8.8', '8.8.4.4']); // Overrides your ISP DNS with Google DNS
export const removeLegacyOfficeRoomIndex = async () => {
  const collection = mongoose.connection.collection('offices');
  let indexes;
  try {
    indexes = await collection.indexes();
  } catch (error: any) {
    // A fresh database does not have an offices collection or indexes yet.
    if (error?.code === 26) return;
    throw error;
  }
  const legacyIndexes = indexes.filter((index) =>
    index.unique === true &&
    index.key?.floor === 1 &&
    index.key?.roomNumber === 1 &&
    Object.keys(index.key).length === 2,
  );

  for (const index of legacyIndexes) {
    if (!index.name) continue;
    await collection.dropIndex(index.name);
    console.log(`Removed legacy office room-number index: ${index.name}`);
  }
};

async function connectToDatabase(){
  const dbUri = process.env.DB_URI  || '';
  console.log(dbUri);
  try {
    await mongoose.connect(dbUri);
    // Room numbers are optional and duplicates are allowed. MongoDB retains
    // old indexes after a schema change, so remove this exact legacy index.
    await removeLegacyOfficeRoomIndex();
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  }

}
export { connectToDatabase }; 
