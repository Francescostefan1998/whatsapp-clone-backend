import express from "express";
import listEndpoints from "express-list-endpoints";
import cors from "cors";
import mongoose from "mongoose";
import passport from "passport";
import userRouter from "./api/users/index.js";
import messageRouter from "./api/messages/index.js";
import chatRouter from "./api/chats/index.js";
import { Server } from "socket.io";
import createAudioRouter from "./api/audio/index.js";
import { createServer } from "http";
import fileUserRouter from "./api/file/index.js";
import { newConnectionHandler } from "./socket/index.js";

const expressServer = express();
//
const port = process.env.PORT || 3001;
const httpServer = createServer(expressServer);
const io = new Server(httpServer);
io.on("connection", newConnectionHandler);
expressServer.use(cors());
expressServer.use(express.json());
expressServer.use("/users", userRouter);
expressServer.use("/images", fileUserRouter);
expressServer.use("/chats", chatRouter);
expressServer.use("/messages", messageRouter);

(async () => {
  try {
    const audioRouter = await createAudioRouter();
    expressServer.use("/audio", audioRouter);

    mongoose.connect(process.env.MONGO_URL);
    mongoose.connection.on("connected", () => {
      console.log("Connected to mongo db");
      httpServer.listen(port, () => {
        console.table(listEndpoints(expressServer));
        console.log(`Server is running on port ${port}`);
      });
    });
  } catch (error) {
    console.error("Failed to create audio router", error);
  }
})();
