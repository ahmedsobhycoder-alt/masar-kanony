import server from "./app"
import { connectToDatabase } from './infrastructure/config/database';

const startServer = async () => {
  await connectToDatabase();

 // await initializeAdmin();
  server.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
    console.log(`Server is running on http://localhost:${process.env.PORT}`);
  });
};

void startServer();

