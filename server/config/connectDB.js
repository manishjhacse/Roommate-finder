const mongoose = require("mongoose");
require("dotenv").config();
exports.connectDB = () => {
  mongoose
    .connect(process.env.MongoDBURL)
    .then(() => {
      console.log("Database connected Successfully");
    })
    .catch((err) => {
      console.log("Something went wrong while connecting DB");
      console.log(err);
      process.exit(1);
    });
};
