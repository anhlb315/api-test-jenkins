const { Notification } = require("../models/databaseIndex");

class NotificationService {
  async createNotification(data) {
    return await Notification.create(data);
  }

  async getAllNotificationsByUserId(userId) {
    return await Notification.findAll({
      where: { receiver_id: userId },
      order: [["createdAt", "DESC"]],
    });
  }

  async deleteAllNotificationByUserId(userId) {
    await Notification.destroy({
      where: { receiver_id: userId },
    });
  }
}

module.exports = new NotificationService();
