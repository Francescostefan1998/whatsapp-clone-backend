import express from "express";
import createHttpError from "http-errors";
import passport from "passport";
import ChatModel from "./model.js";
import UsersModel from "../users/model.js";

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
    try {
      const updateUser = await UsersModel.findByIdAndUpdate(
        req.params.userId,
        { $push: { chats: _id } },
        { new: true, runValidators: true }
      );
      if (updateUser) {
        res.send(updateUser);
      } else {
        next(
          createHttpError(404, `user with id ${req.params.userId} not found`)
        );
      }
    } catch (error) {
      next(error);
    }
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
