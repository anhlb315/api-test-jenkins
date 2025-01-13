const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const NotificationService = require("../services/notificationService");

class NotificationController {
  constructor() {
    this.notificationService = NotificationService;

    this.createNotification = catchAsync(this.createNotification.bind(this));
    this.getAllNotificationsByUserId = catchAsync(
      this.getAllNotificationsByUserId.bind(this)
    );
    this.deleteAllNotificationByUserId = catchAsync(
      this.deleteAllNotificationByUserId.bind(this)
    );
  }

  async createNotification(req, res, next) {
    const data = { ...req.body };

    const notification = await this.notificationService.createNotification(
      data
    );

    return res.status(201).json({
      status: "success",
      data: {
        notification,
      },
    });
  }

  async getAllNotificationsByUserId(req, res, next) {
    const userId = req.params.id;

    const notifications =
      await this.notificationService.getAllNotificationsByUserId(userId);

    return res.status(200).json({
      status: "success",
      data: {
        notifications,
      },
    });
  }

  async deleteAllNotificationByUserId(req, res, next) {
    const userId = req.params.id;

    await this.notificationService.deleteAllNotificationByUserId(userId);

    return res.status(204).json({
      status: "success",
      data: null,
    });
  }
}

module.exports = new NotificationController();
