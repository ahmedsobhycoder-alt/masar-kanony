
import mongoose from 'mongoose';
// import dns from 'node:dns';
// dns.setServers(['8.8.8.8', '8.8.4.4']); // Overrides your ISP DNS with Google DNS
async function connectToDatabase(){
  const dbUri = process.env.DB_URI  || '';
  console.log(dbUri);
  try {
    await mongoose.connect(dbUri);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  }

}
export { connectToDatabase }; 
