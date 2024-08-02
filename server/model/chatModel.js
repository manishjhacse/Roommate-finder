const mongoose = require("mongoose");
const { User } = require("./userModel");
const { Room } = require("./roomModel");

const chatSchema = new mongoose.Schema({
  room: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Room",
    required: true,
  },
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  ownerName: {
    type: String,
    required: true,
  },

  interestedId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  interestedName: {
    type: String,
    required: true,
  },
  messages: [
    {
      senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      senderName: { type: String, required: true },
      message: { type: String, required: true },
      time: { type: String },
    },
  ],
});
const Chat = mongoose.model("Chat", chatSchema);
module.exports = { Chat };
