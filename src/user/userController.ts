import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import userModel from "./userModel";
import bcrypt from "bcrypt";
import { sign } from "jsonwebtoken";
import { config } from "../config/config";
import { User } from "./userTypes";
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

  try {
    const userExist = await userModel.findOne({ email: email });
    if (userExist) {
      const error = createHttpError(400, "user already exist with this email");
      return next(error);
    }
  } catch (err) {
    return next(createHttpError(500, "error while getting user"));
  }

  //password hashing code will be here

  const hashPassword = await bcrypt.hash(password, 10);
  // register the user
  let newUser: User;
  try {
    newUser = await userModel.create({
      name,
      email,
      password: hashPassword,
    });
  } catch (err) {
    return next(createHttpError(500, "error while registering user"));
  }

  //jwt token will be here
  const token = sign({ sub: newUser._id }, config.jwtSecret, {
    expiresIn: "7d",
    algorithm: "HS256",
  });
  res.json({ message: "user registered successfully", access_token: token });
};

export { registerUser };
