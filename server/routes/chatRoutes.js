const express = require("express");
const router = express.Router();
const {
    createNewChat,isChatExist,getChatList,getChatId,getChats
} = require("../controller/chatController");
const { auth } = require("../auth/userAuth");
router.post("/createnewchat",auth,createNewChat)
router.post("/getchatlist",auth,getChatList)
router.get("/ischatexist",auth,isChatExist)
router.get("/getchats",auth,getChats)
router.get("/getchatid",auth,getChatId)
module.exports = router;
