const express = require("express");
const router = express.Router();
const messageController = require("../controllers/message.controller");
router.get("/getConversation/:id", messageController.getConversation);
router.post("/sendMessage", messageController.sendMessage);
router.get("/getAllChatter", messageController.getAllChatter);
module.exports = router;