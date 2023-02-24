import express from "express";
import createHttpError from "http-errors";
import passport from "passport";
import MessageModel from "./model.js";

const messageRouter = express.Router();
messageRouter.get("/", async (req, res, next) => {
  try {
    const messages = await MessageModel.find();
    res.send(messages);
  } catch (error) {
    next(error);
  }
});

messageRouter.post("/", async (req, res, next) => {
  try {
    console.log("POST");
    const newMessage = new MessageModel(req.body);
    const { _id } = await newMessage.save();
    res.status(201).send({ _id });
  } catch (error) {
    next(error);
  }
});
messageRouter.get("/:messageId", async (req, res, next) => {
  try {
    const message = await MessageModel.findById(req.params.messageId);
    if (message) {
      res.send(message);
    } else {
      next(
        createHttpError(
          404,
          `message with id ${req.params.messageId} not found`
        )
      );
    }
  } catch (error) {
    next(error);
  }
});

messageRouter.put("/:messageId", async (req, res, next) => {
  try {
    const updatedMessage = await MessageModel.findByIdAndUpdate(
      req.params.messageId,
      req.body,
      { new: true, runValidators: true }
    );
    if (updatedMessage) {
      res.send(updatedMessage);
    } else {
      next(
        createHttpError(
          404,
          `message with id ${req.params.messageId} not found`
        )
      );
    }
  } catch (error) {
    next(error);
  }
});

messageRouter.delete(
  "/:messageId",

  async (req, res, next) => {
    try {
      const deleteMessage = await MessageModel.findByIdAndDelete(
        req.params.messageId
      );
      if (deleteMessage) {
        res.status(204).send("deleted");
      } else {
        next(
          createHttpError(
            404,
            `message with id ${req.params.messageId} not found`
          )
        );
      }
    } catch (error) {
      next(error);
    }
  }
);

export default messageRouter;
