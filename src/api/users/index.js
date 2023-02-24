import express from "express";
import createHttpError from "http-errors";
import passport from "passport";
import UsersModel from "./model.js";
import { createAccessToken } from "../../lib/auth/tools.js";

const userRouter = express.Router();

userRouter.get("/", async (req, res, next) => {
  try {
    const users = await UsersModel.find();
    res.send(users);
  } catch (error) {
    next(error);
  }
});

userRouter.post("/", async (req, res, next) => {
  try {
    console.log("POST");
    const newUser = new UsersModel(req.body);
    const { _id } = await newUser.save();
    res.status(201).send({ _id });
  } catch (error) {
    next(error);
  }
});
userRouter.get("/:userId", async (req, res, next) => {
  try {
    const user = await UsersModel.findById(req.params.userId);
    if (user) {
      res.send(user);
    } else {
      next(createHttpError(404, `user with id ${req.params.userId} not found`));
    }
  } catch (error) {
    next(error);
  }
});

userRouter.put("/:userId", async (req, res, next) => {
  try {
    const updateUser = await UsersModel.findByIdAndUpdate(
      req.params.userId,
      req.body,
      { new: true, runValidators: true }
    );
    if (updateUser) {
      res.send(updateUser);
    } else {
      next(createHttpError(404, `user with id ${req.params.userId} not found`));
    }
  } catch (error) {
    next(error);
  }
});

userRouter.delete(
  "/:userId",

  async (req, res, next) => {
    try {
      const deleteUser = await UsersModel.findByIdAndDelete(req.params.userId);
      if (deleteUser) {
        res.status(204).send("deleted");
      } else {
        next(
          createHttpError(404, `user with id ${req.params.userId} not found`)
        );
      }
    } catch (error) {
      next(error);
    }
  }
);
userRouter.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await UsersModel.checkCredentials(email, password);

    if (user) {
      const payload = { _id: user._id, role: user.role };

      const accessToken = await createAccessToken(payload);
      res.send({ accessToken });
    } else {
      next(createHttpError(401, "Credentials are not ok!"));
    }
  } catch (error) {
    next(error);
  }
});

export default userRouter;
