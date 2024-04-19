import { Request, Response, NextFunction } from "express";
import { config } from "../config/config";
import { verify } from "jsonwebtoken";
import createHttpError from "http-errors";

export interface AuthRequest extends Request {
  userId: string;
}
const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const token = req.header("Authorization");

  if (!token) {
    return next(createHttpError(401, "please provide a valid token"));
  }
  {
    try {
      const tokenValue = token.split(" ")[1];
      const decode = verify(tokenValue, config.jwtSecret);
      const _req = req as AuthRequest;
      _req.userId = decode.sub as string;
      next();
    } catch (err) {
      return next(
        createHttpError(401, "please provide a valid token or token expired")
      );
    }
  }
};

export default authenticate;
