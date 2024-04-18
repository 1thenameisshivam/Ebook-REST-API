import app from "./src/app";
import { config } from "./src/config/config";
import conctDB from "./src/config/database";
const startServer = async () => {
  await conctDB();

  const port = config.port || 3000;

  app.listen(port, () => {
    console.log(`server is running on port ${port}`);
  });
};

startServer();
