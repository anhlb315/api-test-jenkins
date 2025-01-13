// ChatService.js

const { Chat, User, Op } = require("../models/databaseIndex");
const { s3, GetObjectCommand, getSignedUrl } = require("../services/s3Bucket");

class ChatService {
  async createChat(data) {
    try {
      const chat = await Chat.create(data);
      return chat;
    } catch (error) {
      throw error;
    }
  }

  async getAllChatsByUserId(userId) {
    try {
      const chats = await Chat.findAll({
        where: {
          [Op.or]: [{ sender_id: userId }, { receiver_id: userId }],
        },
      });
      return chats;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new ChatService();
