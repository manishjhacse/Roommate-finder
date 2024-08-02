const { Chat } = require("./model/chatModel");

const socketHandler = (io) => {
  io.on("connection", (socket) => {
    console.log("New client connected");

    // Handle joining a chat room
    socket.on("startChat", ({ chatId }) => {
      socket.join(chatId);
    });

    // Handle sending a message
    socket.on("send_message", async ({ chatId, senderId, senderName, message, time }) => {
      try {
        const chat = await Chat.findById(chatId);
        if (chat) {
          const newMessage = { senderId, senderName, message, time };
          chat.messages.push(newMessage);
          await chat.save();

          // Emit the message to all clients in the room
          socket.to(chatId).emit("receive_message", newMessage);
        }
      } catch (err) {
        console.error("Error handling chat message:", err);
      }
    });

    // Handle client disconnect
    socket.on("disconnect", () => {
      console.log("Client disconnected");
    });
  });
};

module.exports = socketHandler;
