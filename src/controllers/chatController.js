// ChatController.js

const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const ChatService = require("../services/chatService");

class ChatController {
  constructor() {
    this.chatService = ChatService;

    // Bind methods to the instance to ensure proper 'this' context
    this.createChat = catchAsync(this.createChat.bind(this));
    this.getAllChatsByUserId = catchAsync(this.getAllChatsByUserId.bind(this));
  }

  async createChat(req, res, next) {
    try {
      const data = { ...req.body };
      const chat = await this.chatService.createChat(data);

      res.status(201).json({
        status: "success",
        data: { chat },
      });
    } catch (error) {
      next(error);
    }
  }

  async getAllChatsByUserId(req, res, next) {
    try {
      const { id } = req.params;
      const chats = await this.chatService.getAllChatsByUserId(id);

      res.status(200).json({
        status: "success",
        data: { chats },
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new ChatController();
