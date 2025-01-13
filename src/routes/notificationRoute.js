const express = require("express");
const notificationController = require("../controllers/notificationController");
const router = express.Router();

router.get("/:id", notificationController.getAllNotificationsByUserId);
router.delete("/:id", notificationController.deleteAllNotificationByUserId);
router.post("/", notificationController.createNotification);

module.exports = router;
