import mongoose from "mongoose";
const { Schema, model } = mongoose;

const messageSchema = new Schema(
  {
    text: { type: String, required: true },
    image: { type: String, required: false },
    chat: { type: Schema.Types.ObjectId, ref: "Chat" },
    user: { type: Schema.Types.ObjectId, ref: "User" },
    sender: { type: Schema.Types.ObjectId, ref: "User" },
  },
  {
    timestamps: true,
  }
);

export default model("Message", messageSchema);
