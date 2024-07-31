const express = require("express");
const router = express.Router();
const {
  addRoom,
  getAllRooms,
  deleteRoom,
  getUserRooms,
} = require("../controller/roomController");
const { auth } = require("../auth/userAuth");
router.post("/addRoom", auth, addRoom);
router.delete("/deleteroom",auth,deleteRoom);
router.get("/getAllRooms", getAllRooms);
router.get("/getUserRooms", auth, getUserRooms);
module.exports = router;
