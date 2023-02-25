import express from "express";
import createHttpError from "http-errors";
import passport from "passport";
import ChatModel from "./model.js";

const chatRouter = express.Router();
chatRouter.get("/", async (req, res, next) => {
  try {
    const chats = await ChatModel.find();
    res.send(chats);
  } catch (error) {
    next(error);
  }
});

chatRouter.post("/:userId/chats", async (req, res, next) => {
  try {
    console.log("POST");
    const newChat = new ChatModel({
      ...req.body,
      users: [req.params.userId, req.body.userId],
    });
    const { _id } = await newChat.save();
    res.status(201).send({ _id });
  } catch (error) {
    next(error);
  }
});
chatRouter.get("/:chatId", async (req, res, next) => {
  try {
    const chat = await ChatModel.findById(req.params.chatId);
    if (chat) {
      res.send(chat);
    } else {
      next(createHttpError(404, `chat with id ${req.params.chatId} not found`));
    }
  } catch (error) {
    next(error);
  }
});

chatRouter.put("/:chatId", async (req, res, next) => {
  try {
    const updateChat = await ChatModel.findByIdAndUpdate(
      req.params.chatId,
      req.body,
      { new: true, runValidators: true }
    );
    if (updateChat) {
      res.send(updateChat);
    } else {
      next(createHttpError(404, `chat with id ${req.params.chatId} not found`));
    }
  } catch (error) {
    next(error);
  }
});

chatRouter.delete(
  "/:chatId",

  async (req, res, next) => {
    try {
      const deleteChat = await ChatModel.findByIdAndDelete(req.params.chatId);
      if (deleteChat) {
        res.status(204).send("deleted");
      } else {
        next(
          createHttpError(404, `chat with id ${req.params.chatId} not found`)
        );
      }
    } catch (error) {
      next(error);
    }
  }
);

export default chatRouter;
