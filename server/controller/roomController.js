const { Room } = require("../model/roomModel");
const { User } = require("../model/userModel");
const cloudinary = require("cloudinary").v2;
function isFileTypeSupported(fileType, supportedFiles) {
  return supportedFiles.includes(fileType);
}
async function uploadFileToCloudinary(file, folder, quality) {
  const options = { folder };
  options.resource_type = "auto";
  if (quality) {
    options.quality = quality;
  }
  return await cloudinary.uploader.upload(file.tempFilePath, options);
}
exports.addRoom = async (req, res) => {
  try {
    const { description, location, roommatePreferences, price } = req.body;
    const locationObj = JSON.parse(location);
    const roommatePreferencesObj = JSON.parse(roommatePreferences);
    const file = req.files?.image;
    const supportedFiles = ["jpg", "jpeg", "png"];
    let imageurl="https://res.cloudinary.com/dfrcswf0n/image/upload/v1722092104/RoomImages/vgwtyhexx9ysttmcrrxe.png"
    if (file) {
      const fileType = file.name.split(".").pop().toLowerCase();
      if (!isFileTypeSupported(fileType, supportedFiles)) {
        return res.status(400).json({
          success: false,
          message: "file format not supported",
        });
      }
      const response = await uploadFileToCloudinary(file, "RoomImages");
      imageurl=response?.secure_url
    }
    user = { userID: req.user._id, userName: req.user.name };
    const room = await Room.create({
      user,
      images: imageurl,
      description,
      location: locationObj,
      roommatePreferences: roommatePreferencesObj,
      price,
    });

    try {
      const updatedUser = await User.findByIdAndUpdate(
        user.userID,
        {
          $push: {
            rooms: { roomId: room._id },
          },
        },
        { new: true }
      );
    } catch (err) {
      const deleteRoom = await Room.findByIdAndDelete(room._id);
      return res.status(500).json({
        success: false,
        message: "Room not added, try again",
        error: err.message,
      });
    }

    return res.status(201).json({
      success: true,
      message: "Room created successfully",
      room,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Room not added, try again",
      error: err.message,
    });
  }
};

exports.deleteRoom = async (req, res) => {
  try {
    const  room  = req.body;
    const userId = req.user._id;
    if (String(room.user.userID) != String(userId)) {
      return res.status(401).json({
        success: false,
        message: "User does not have access to this diary",
      });
    }
    const deletedRoom = await Room.findByIdAndDelete(room._id);
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        $pull: {
          room: { roomId: deletedRoom._id },
        },
      },
      { new: true }
    );
    return res.status(201).json({
      success: true,
      message: "Room created successfully",
      room,
    });
  } catch (err) {
    return res.status(503).json({
      success: false,
      message: "Unable Delete Room, try again",
      error: err,
    });
  }
};

exports.getAllRooms = async (req, res) => {
  try {
    const rooms = await Room.find();
    if (!rooms || rooms === undefined) {
      return res.status(404).json({
        success: false,
        message: "No rooms found",
      });
    } else {
      return res.status(200).json({
        success: true,
        message: "Rooms found",
        rooms: rooms,
      });
    }
  } catch (err) {
    return res.status(503).json({
      success: false,
      message: "Unable to fetches rooms, try again",
      error: err,
    });
  }
};

exports.getUserRooms = async (req, res) => {
  try {
    const userId = req.user._id;
    const rooms = await Room.find({ user: userId });
    if (!rooms || rooms === undefined) {
      return res.status(404).json({
        success: false,
        message: "No rooms found",
      });
    } else {
      return res.status(200).json({
        success: true,
        message: "Rooms found",
        rooms: rooms,
      });
    }
  } catch (err) {
    return res.status(503).json({
      success: false,
      message: "Unable to fetches rooms, try again",
      error: err,
    });
  }
};
