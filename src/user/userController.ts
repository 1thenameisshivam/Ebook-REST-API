import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import userModel from "./userModel";
const registerUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // validation code will be here
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    const error = createHttpError(400, "please provide all the fields");
    return next(error);
  }

  // check beafore save user already exist or not

  const userExist = await userModel.findOne({ email: email });
  if (userExist) {
    const error = createHttpError(400, "user already exist with this email");
    return next(error);
  }

  // register the user
};

export { registerUser };
