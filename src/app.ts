import express from "express";
import createHttpError from "http-errors";
import globleErrorHandler from "./middlewares/globleErrorHandler";
import userRouter from "./user/userRoute";
import bookRouter from "./books/bookRoute";
import cors from "cors";
import { config } from "./config/config";
const app = express();
app.use(
  cors({
    origin: config.frontendUrl,
  })
);
app.use(express.json());

app.get("/", (req, res, next) => {
  const error = createHttpError(404, "testing for globle error");

  throw error;
  res.json({ message: "welcome to ebook apis" });
});

app.use("/api/users", userRouter);
app.use("/api/books", bookRouter);
app.use(globleErrorHandler);

export default app;
