const mongoose = require("mongoose");
const { Room } = require("./roomModel");

const userSchema = new mongoose.Schema({
  name: { type: String,  trim: true },
  email: { type: String,  trim: true },
  mobile: { type: Number },
  otp: {
    code: { type: String },
    validTime: { type: Date },
  },
  password: { type: String, },
  profile_pic: { type: String },
  bio: { type: String },
  rooms: [
    {
      roomId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Room",
      },
    },
  ],
  favourites: [
    {
      roomId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Room",
      },
    },
  ],
});

const User = mongoose.model("User", userSchema);
module.exports = { User };
