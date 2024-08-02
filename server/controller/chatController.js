const { Room } = require("../model/roomModel");
const { Chat } = require("../model/chatModel");
exports.createNewChat = async (req, res) => {
  try {
    const { roomId, ownerId, ownerName } = req.body;
    const userId = req.user._id;
    const interestedName = req.user.name;
    const chat = await Chat.create({
      room: roomId,
      ownerId,
      ownerName,
      interestedName,
      interestedId: userId,
    });
    return res.status(201).json({
      success: true,
      message: "chat created successfully",
      chat,
    });
  } catch (err) {
    return res.status(503).json({
      success: false,
      message: "Unable to create chat, try again",
      error: err,
    });
  }
};

exports.isChatExist = async (req, res) => {
  try {
    const { roomId, ownerId } = req.query;
    const userId = req.user._id;
    const chat = await Chat.findOne({
      room: roomId,
      ownerId,
      interestedId: userId,
    });
    if (chat) {
      return res.status(200).json({
        success: true,
        chatExist: true,
        chatId: chat._id,
      });
    } else {
      return res.status(200).json({
        success: true,
        chatExist: false,
      });
    }
  } catch (err) {
    return res.status(503).json({
      success: false,
      message: "Unable to check chat existence, try again",
      error: err.message,
    });
  }
};

exports.getChatId = async (req, res) => {
  try {
    const { roomId, ownerId, interestedId } = req.query;
    const chat = await Chat.findOne({
      room: roomId,
      ownerId,
      interestedId,
    });
    if (chat) {
      return res.status(200).json({
        success: true,
        chatExist: true,
        chatId: chat._id,
      });
    } else {
      return res.status(200).json({
        success: true,
        chatExist: false,
      });
    }
  } catch (err) {
    return res.status(503).json({
      success: false,
      message: "Unable to check chat existence, try again",
      error: err.message,
    });
  }
};

exports.getChatList = async (req, res) => {
  try {
    const { roomId, ownerId } = req.body;
    if (!roomId || !ownerId) {
      return res.status(400).json({
        success: false,
        message: "Room ID and Owner ID are required.",
      });
    }
    if (String(req.user._id) !== String(ownerId)) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized access.",
      });
    }

    const chat = await Chat.find({ room: roomId, ownerId });

    return res.status(200).json({
      success: true,
      chatList: chat,
    });
  } catch (err) {
    return res.status(503).json({
      success: false,
      message: "Unable to retrieve chat list. Please try again.",
      error: err.message,
    });
  }
};

exports.getChats = async (req, res) => {
  try {
    const { chatId } = req.query;
    console.log(chatId);
    const chat = await Chat.findById(chatId);
    if (chat) {
      return res.status(200).json({
        success: true,
        chatExist: true,
        chat,
      });
    } else {
      return res.status(200).json({
        success: true,
        chatExist: false,
      });
    }
  } catch (err) {
    return res.status(503).json({
      success: false,
      message: "Unable to get previous messages",
    });
  }
};
