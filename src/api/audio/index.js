import express from "express";
import multer from "multer";
import { MongoClient } from "mongodb";
import { GridFSBucket } from "mongodb";
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

  // Handle file uploads
  audioRouter.post("/api/audio", upload.single("audio"), async (req, res) => {
    try {
      const file = req.file;
      const stream = fs.createReadStream(file.path);
      const uploadStream = bucket.openUploadStream(file.originalname);
      stream.pipe(uploadStream);

      uploadStream.on("finish", () => {
        fs.unlinkSync(file.path);
        res.status(200).send("File uploaded successfully");
      });
    } catch (err) {
      console.log(err);
      res.status(500).send("Error uploading file");
    }
    // ...
  });

  // Handle file downloads
  audioRouter.get("/api/audio/:filename", async (req, res) => {
    // ...
    try {
      const filename = req.params.filename;
      const downloadStream = bucket.openDownloadStreamByName(filename);
      downloadStream.pipe(res);
    } catch (err) {
      console.log(err);
      res.status(500).send("Error downloading file");
    }
  });

  return audioRouter;
}

export default createAudioRouter;
