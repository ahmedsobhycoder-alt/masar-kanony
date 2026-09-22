import server from './app';
import { connectToDatabase } from './config/database';
connectToDatabase();
server.listen(process.env.PORT,async ()  => {
  console.log(`Server is running on port ${process.env.PORT}`);
  console.log(`Server is running on http://localhost:${process.env.PORT}`)

});

