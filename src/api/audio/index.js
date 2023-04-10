/*import express from "express";
import multer from "multer";
import { MongoClient } from "mongodb";
import { GridFSBucket } from "mongodb";
import MessageModel from "../messages/model.js";
import ChatModel from "../chats/model.js";
import mongoose from "mongoose";
import cloudinary from "cloudinary";
import { v2 as cloudinaryV2 } from "cloudinary";
import fs from "fs";

const upload = multer({ dest: "uploads/" });

async function createAudioRouter() {
  const uri =
    "mongodb+srv://Frank1998:ocsecnarf@cluster0.cv1nwwr.mongodb.net/whatsappClone?retryWrites=true&w=majority";
  const client = await MongoClient.connect(uri, { useUnifiedTopology: true });

  const db = client.db();
  console.log("Connected to MongoDB");

  const bucket = new GridFSBucket(db, { bucketName: "audio" });

  const audioRouter = express.Router();

  cloudinaryV2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

  audioRouter.post(
    "/api/audio/:chatId/:userId/:senderId",
    upload.single("audio"),
    async (req, res) => {
      try {
        const file = req.file;

        // Upload the file to Cloudinary
        cloudinaryV2.uploader.upload(
          file.path,
          {
            resource_type: "video", // For audio files, use 'video' as the resource type
            public_id: `${req.params.chatId}/${file.originalname}`,
          },
          async (error, result) => {
            if (error) {
              console.log(error);
              res.status(500).send("Error uploading file");
            } else {
              // Delete the local file
              fs.unlinkSync(file.path);

              // Create a new message with the audio link from Cloudinary
              const newMessage = new MessageModel({
                audio: result.url,
                chat: mongoose.Types.ObjectId(req.params.chatId),
                user: mongoose.Types.ObjectId(req.body.userId), // Replace with the actual user ID, you might need to pass it in the request
                sender: mongoose.Types.ObjectId(req.body.senderId), // Replace with the actual sender ID, you might need to pass it in the request
              });
              const { _id } = await newMessage.save();
              const updateChat = await ChatModel.findByIdAndUpdate(
                req.params.chatId,
                { $push: { messages: _id } },
                { new: true, runValidators: true }
              );
              // Save the new message to the database

              res
                .status(200)
                .send("File uploaded successfully and message created");
            }
          }
        );
      } catch (err) {
        console.log(err);
        res.status(500).send("Error uploading file");
      }
    }
  );
  // Handle file downloads

  return audioRouter;
}

export default createAudioRouter;*/

import express from "express";
import multer from "multer";
import { MongoClient } from "mongodb";
import { GridFSBucket } from "mongodb";
import mongoose from "mongoose";
import cloudinary from "cloudinary";
import { v2 as cloudinaryV2 } from "cloudinary";
import fs from "fs";

const upload = multer({ dest: "uploads/" });

async function createAudioRouter() {
  const uri =
    "mongodb+srv://Frank1998:ocsecnarf@cluster0.cv1nwwr.mongodb.net/whatsappClone?retryWrites=true&w=majority";
  const client = await MongoClient.connect(uri, { useUnifiedTopology: true });

  const db = client.db();
  console.log("Connected to MongoDB");

  const bucket = new GridFSBucket(db, { bucketName: "audio" });

  const audioRouter = express.Router();

  cloudinaryV2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

  audioRouter.post("/api/audio", upload.single("audio"), async (req, res) => {
    try {
      const file = req.file;
      console.log("tring to create");
      // Upload the file to Cloudinary
      cloudinaryV2.uploader.upload(
        file.path,
        {
          resource_type: "video", // For audio files, use 'video' as the resource type
          public_id: `${req.params.chatId}/${file.originalname}`,
        },
        async (error, result) => {
          if (error) {
            console.log(error);
            res.status(500).send("Error uploading file");
          } else {
            // Delete the local file
            fs.unlinkSync(file.path);
            res.send(result.url);

            // Create a new message with the audio link from Cloudinary
          }
        }
      );
    } catch (err) {
      console.log(err);
      res.status(500).send("Error uploading file");
    }
  });
  // Handle file downloads

  return audioRouter;
}

export default createAudioRouter;
