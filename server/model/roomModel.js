const mongoose = require("mongoose");
const { User } = require("./userModel");

const roomSchema = new mongoose.Schema({
  user: { userID:{type: mongoose.Schema.Types.ObjectId, ref: "User"},userName:{type:String} },
  isAvailable: { type: Boolean, default: true },
  images: { type: String },
  description: { type: String },
  location: {
    country: { type: String, required: true },
    state: { type: String, required: true },
    district: { type: String, required: true },
    landmark: { type: String },
  },
  roommatePreferences: {
    gender: { type: String, enum: ["Male", "Female", "Any"] },
    smoker: { type: String, enum: ["Allowed", "Not allowed"]},
  },
  price: { type: Number, required: true },
  postedDate: { type: Date, default: Date.now },
});

const Room = mongoose.model("Room", roomSchema);
module.exports = { Room };
