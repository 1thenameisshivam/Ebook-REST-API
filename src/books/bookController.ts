import { NextFunction, Response, Request } from "express";
import cloudinary from "../config/cloudinary";
import path from "node:path";
import createHttpError from "http-errors";
const createBook = async (req: Request, res: Response, next: NextFunction) => {
  console.log(req.files);
  const files = req.files as { [fieldname: string]: Express.Multer.File[] };
  const coverImageMimeType = files.coverImage[0].mimetype.split("/")[1];
  const fileName = files.coverImage[0].filename;
  const filePath = path.resolve("__dirname/../public/data/uploads/" + fileName);
  const pdfName = files.file[0].filename;
  const pdfPath = path.resolve("__dirname/../public/data/uploads/" + pdfName);

  try {
    const uploadResult = await cloudinary.uploader.upload(filePath, {
      filename_override: fileName,
      folder: "book-covers",
      format: coverImageMimeType,
    });

    console.log(uploadResult);

    const uploadfileResult = await cloudinary.uploader.upload(pdfPath, {
      getResource: "raw",
      filename_override: pdfName,
      folder: "book-pdf",
      format: "pdf",
    });

    console.log(uploadfileResult);
  } catch (err) {
    console.log(err);
    return next(createHttpError(500, "error while uploading files."));
  }

  res.json({ message: "book created successfully" });
};

export { createBook };
