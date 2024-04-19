import { NextFunction, Response, Request } from "express";
import cloudinary from "../config/cloudinary";
import path from "node:path";
import createHttpError from "http-errors";
import bookModel from "./bookModel";
import fs from "node:fs";
const createBook = async (req: Request, res: Response, next: NextFunction) => {
  const { title, genera } = req.body;

  const files = req.files as { [fieldname: string]: Express.Multer.File[] };
  const coverImageMimeType = files.coverImage[0].mimetype.split("/")[1];
  const fileName = files.coverImage[0].filename;
  const filePath = path.resolve("__dirname/../public/data/uploads/" + fileName);
  const pdfName = files.file[0].filename;
  const pdfPath = path.resolve("__dirname/../public/data/uploads/" + pdfName);

  try {
    // upload the files to cloudinary
    const uploadResult = await cloudinary.uploader.upload(filePath, {
      filename_override: fileName,
      folder: "book-covers",
      format: coverImageMimeType,
    });

    // console.log(uploadResult);

    const uploadfileResult = await cloudinary.uploader.upload(pdfPath, {
      getResource: "raw",
      filename_override: pdfName,
      folder: "book-pdf",
      format: "pdf",
    });

    // console.log(uploadfileResult);

    // save the book
    const newBook = await bookModel.create({
      title,
      genera,
      auther: "66221cc09e51842361a82fcf",
      coverImage: uploadResult.secure_url,
      file: uploadfileResult.secure_url,
    });

    // delete the files from local storage
    try {
      await fs.promises.unlink(filePath);
      await fs.promises.unlink(pdfPath);
    } catch (err) {
      return next(createHttpError(500, "error while deleting files."));
    }

    res
      .status(201)
      .json({ message: "book created successfully", bookid: newBook._id });
  } catch (err) {
    console.log(err);
    return next(createHttpError(500, "error while uploading files."));
  }
};

export { createBook };
