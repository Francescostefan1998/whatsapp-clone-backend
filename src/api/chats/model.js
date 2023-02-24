import mongoose from "mongoose";
const { Schema, model } = mongoose;

const chatSchema = new Schema(
  {
    messages: [{ type: Schema.Types.ObjectId, ref: "Message" }],
    users: [{ type: Schema.Types.ObjectId, ref: "User" }],
  },
  {
    timestamps: true,
  }
);

export default model("Chat", chatSchema);
