import express from "express";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import UserModel from "../users/model.js";
import createHttpError from "http-errors";
import { trusted } from "mongoose";

const fileUserRouter = express.Router();

const cloudinaryUploader = multer({
  storage: new CloudinaryStorage({
    cloudinary,
    params: {
      folder: "whatssApp-user",
    },
  }),
}).single("image");

fileUserRouter.post("/:userId", cloudinaryUploader, async (req, res, next) => {
  try {
    const user = await UserModel.findById(req.params.userId);
    if (user) {
      const updateTheUserImage = await UserModel.findByIdAndUpdate(
        req.params.userId,
        { image: req.file.path },
        { new: true, runValidators: true }
      );
    } else {
      console.log("User not found");
    }
  } catch (error) {
    next(error);
  }
});

export default fileUserRouter;
