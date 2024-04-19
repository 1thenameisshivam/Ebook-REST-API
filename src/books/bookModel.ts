import mongoose from "mongoose";
import { Book } from "./bookTypes";

const bookModel = new mongoose.Schema<Book>(
  {
    title: {
      type: String,
      required: true,
    },
    auther: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    genera: {
      type: String,
      required: true,
    },
    coverImage: {
      type: String,
      required: true,
    },
    file: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model<Book>("book", bookModel);