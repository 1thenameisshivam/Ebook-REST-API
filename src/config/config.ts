import { config as conf } from "dotenv";

conf();

const _config = {
  port: process.env.PORT,
  dburl: String(process.env.MONGO_CONNECTION_STRING),
  env: process.env.NODE_ENV,
  jwtSecret: String(process.env.JWT_SECRET),
  cloudinaryCloudName: String(process.env.CLOUDINARY_CLOUD_NAME),
  cloudinaryApiKey: String(process.env.CLOUDINARY_API_KEY),
  cloudinaryApiSecret: String(process.env.CLOUDINARY_API_SECRET),
  frontendUrl: String(process.env.FRONTEND_URL),
};

export const config = Object.freeze(_config);
