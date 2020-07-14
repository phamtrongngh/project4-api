const express = require("express");
const router = express.Router();
const messageController = require("../controllers/message.controller");
router.get("/", messageController.getMessages);
router.post("/", messageController.sendMessage);
router.get("/getListFriends", messageController.getListFriends);
module.exports = router;