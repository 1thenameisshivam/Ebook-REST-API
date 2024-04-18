import { NextFunction, Response, Request } from "express";
import { HttpError } from "http-errors";
import { config } from "../config/config";
const globleErrorHandler = (
  err: HttpError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const status = err.statusCode || 500;

  return res.status(status).json({
    message: err.message,
    errorStack: config.env === "development" ? err.stack : "",
  });
};

export default globleErrorHandler;
