const express = require("express");
const chatController = require("../controllers/chatController");
const router = express.Router();

router.get("/:id", chatController.getAllChatsByUserId);
router.post("/", chatController.createChat);

module.exports = router;
