import { NextFunction, Response, Request } from "express";
import cloudinary from "../config/cloudinary";
import path from "node:path";
import createHttpError from "http-errors";
import bookModel from "./bookModel";
import fs from "node:fs";
import { AuthRequest } from "../middlewares/authenticate";
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

    const _req = req as AuthRequest;
    const newBook = await bookModel.create({
      title,
      genera,
      auther: _req.userId,
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

const updateBook = async (req: Request, res: Response, next: NextFunction) => {
  const { title, genera } = req.body;
  const bookId = req.params.bookId;

  const book = await bookModel.findById({ _id: bookId });

  if (!book) {
    return next(createHttpError(404, "book not found"));
  }

  const _req = req as AuthRequest;

  // check access
  if (book.auther.toString() !== _req.userId) {
    return next(
      createHttpError(403, "you are not authorized to update this book")
    );
  }

  // upload the image to cloudinary

  let newCoverImage;
  const files = req.files as { [fieldname: string]: Express.Multer.File[] };
  if (files.coverImage) {
    const fileName = files.coverImage[0].filename;
    const filePath = path.resolve(
      "__dirname/../public/data/uploads/" + fileName
    );
    const uploadResult = await cloudinary.uploader.upload(filePath, {
      filename_override: fileName,
      folder: "book-covers",
      format: files.coverImage[0].mimetype.split("/")[1],
    });

    newCoverImage = uploadResult.secure_url;
    await fs.promises.unlink(filePath);
  }

  // upload the file to cloudinary

  let newFileName = "";
  if (files.file) {
    const fileName = files.file[0].filename;
    const bookFilePath = path.resolve(
      "__dirname/../public/data/uploads/" + fileName
    );
    const uploadResultPdf = await cloudinary.uploader.upload(bookFilePath, {
      resource_type: "raw",
      filename_override: fileName,
      folder: "book-pdf",
      format: "pdf",
    });

    newFileName = uploadResultPdf.secure_url;
    await fs.promises.unlink(bookFilePath);
  }

  // update the book
  const updatedBook = await bookModel.findOneAndUpdate(
    {
      _id: bookId,
    },
    {
      title: title,
      genera: genera,
      coverImage: newCoverImage ? newCoverImage : book.coverImage,
      file: newFileName ? newFileName : book.file,
    },
    { new: true }
  );

  res.status(200).json(updatedBook);
};

const listBooks = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // todo: add pagination.
    const book = await bookModel.find();
    res.json(book);
  } catch (err) {
    return next(createHttpError(500, "Error while getting a book"));
  }
};

const getSingleBook = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const bookId = req.params.bookId;

  try {
    const book = await bookModel.findOne({ _id: bookId });
    if (!book) {
      return next(createHttpError(404, "Book not found."));
    }

    return res.json(book);
  } catch (err) {
    return next(createHttpError(500, "Error while getting a book"));
  }
};

const deleteBook = async (req: Request, res: Response, next: NextFunction) => {
  const bookId = req.params.bookId;

  const book = await bookModel.findOne({ _id: bookId });
  if (!book) {
    return next(createHttpError(404, "Book not found"));
  }

  // Check Access
  const _req = req as AuthRequest;
  if (book.auther.toString() !== _req.userId) {
    return next(createHttpError(403, "You can not update others book."));
  }
  // book-covers/dkzujeho0txi0yrfqjsm
  // https://res.cloudinary.com/degzfrkse/image/upload/v1712590372/book-covers/u4bt9x7sv0r0cg5cuynm.png

  const coverFileSplits = book.coverImage.split("/");
  const coverImagePublicId =
    coverFileSplits.at(-2) + "/" + coverFileSplits.at(-1)?.split(".").at(-2);
  const bookFileSplits = book.file.split("/");
  const bookFilePublicId = bookFileSplits.at(-2) + "/" + bookFileSplits.at(-1);
  console.log("bookFilePublicId", bookFilePublicId);
  // todo: add try error block
  await cloudinary.uploader.destroy(coverImagePublicId);
  await cloudinary.uploader.destroy(bookFilePublicId, {
    resource_type: "raw",
  });

  await bookModel.deleteOne({ _id: bookId });

  return res.sendStatus(204);
};
export { createBook, updateBook, listBooks, getSingleBook, deleteBook };
