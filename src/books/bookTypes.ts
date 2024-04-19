import { User } from "../user/userTypes";

export interface Book {
  _id: string;
  title: string;
  auther: User;
  genera: string;
  coverImage: string;
  file: string;
  createdAt: Date;
  updatedAt: Date;
}
