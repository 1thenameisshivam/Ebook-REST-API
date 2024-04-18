import express from "express";
import createHttpError from "http-errors";
import globleErrorHandler from "./middlewares/globleErrorHandler";

const app = express();

app.get("/", (req, res, next) => {
  const error = createHttpError(404, "testing for globle error");

  throw error;
  res.json({ message: "welcome to ebook apis" });
});

app.use(globleErrorHandler);

export default app;
