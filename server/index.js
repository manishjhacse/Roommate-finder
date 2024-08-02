// const express = require("express");
// require("dotenv").config();
// const app = express();
// const cors = require("cors");
// const cookieParser = require("cookie-parser");
// const corsOptions = {
//   origin: true,
//   credentials: true,
// };
// app.use(cors(corsOptions));
// app.use(cookieParser());
// const fileUpload = require("express-fileupload");
// app.use(express.json());
// app.use(
//   fileUpload({
//     useTempFiles: true,
//     tempFileDir: "/tmp/",
//   })
// );
// require("./config/cloudinary").cloudinaryConnect();
// require("./config/connectDB").connectDB();
// const userRouter = require("./routes/userRouter");
// const roomRouter = require("./routes/roomRouter");
// app.use("/api/v1", userRouter);
// app.use("/api/v1", roomRouter);
// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => {
//   console.log(`server is running on port ${PORT}`);
// });


// const express = require("express");
// require("dotenv").config();
// const http = require("http");
// const socketIo = require("socket.io");
// const cors = require("cors");
// const cookieParser = require("cookie-parser");
// const fileUpload = require("express-fileupload");
// const { Server } = require("socket.io");
// // Create Express app
// const app = express();

// // Create HTTP server
// const server = http.createServer(app);

// // Initialize Socket.IO
// const io = new Server(server, {
//   cors: {
//     origin: "*",
//     methods: ["POST", "GET"],
//     credentials: true,
//   },
// });

// // Import and use Socket.IO handler
// const socketHandler = require("./socketHandler");
// socketHandler(io);

// // Middleware
// app.use(cors({ origin: true, credentials: true }));
// app.use(cookieParser());
// app.use(express.json());
// app.use(
//   fileUpload({
//     useTempFiles: true,
//     tempFileDir: "/tmp/",
//   })
// );

// // Cloudinary and Database Connection
// require("./config/cloudinary").cloudinaryConnect();
// require("./config/connectDB").connectDB();

// // Routes
// const userRouter = require("./routes/userRouter");
// const roomRouter = require("./routes/roomRouter");
// const chatRouter = require("./routes/chatRoutes");

// app.use("/api/v1", userRouter);
// app.use("/api/v1", roomRouter);
// app.use("/api/v1", chatRouter);

// // Start the server
// const PORT = process.env.PORT || 3000;
// server.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });


// Import required modules
const express = require("express");
require("dotenv").config();
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");

// Import custom modules
const socketHandler = require("./socketHandler");

// Create Express app
const app = express();

// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.IO with CORS configuration
const io = new Server(server, {
  cors: {
    origin: "*", // Allow all origins (consider restricting in production)
    methods: ["POST", "GET"], // Allowed methods
    credentials: true, // Allow credentials (cookies, etc.)
  },
});

// Attach Socket.IO handler
socketHandler(io);

// Middleware setup
app.use(cors({ origin: true, credentials: true }));
app.use(cookieParser());
app.use(express.json());
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);

// Cloudinary and Database Connection
require("./config/cloudinary").cloudinaryConnect();
require("./config/connectDB").connectDB();

// Import and use routes
const userRouter = require("./routes/userRouter");
const roomRouter = require("./routes/roomRouter");
const chatRouter = require("./routes/chatRoutes");

app.use("/api/v1", userRouter);
app.use("/api/v1", roomRouter);
app.use("/api/v1", chatRouter);

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
