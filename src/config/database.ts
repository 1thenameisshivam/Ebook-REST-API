import mongoose from "mongoose";
import { config } from "./config";

const conctDB = async () => {
  try {
    mongoose.connection.on("connected", () => {
      console.log("connected to the database");
    });
    mongoose.connection.on("error", (err) => {
      console.log("error in connecting to the database", err);
    });
    await mongoose.connect(config.dburl);
  } catch (err) {
    console.error("failed to connect to the database", err);
    process.exit(1);
  }
};

export default conctDB;
