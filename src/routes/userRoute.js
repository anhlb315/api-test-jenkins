const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const userController = require("../controllers/userController");
const {
  passAvatarImage,
  handleUploadAvatar,
} = require("../middlewares/upload/avatarUpload");

router.post("/signup", authController.signup);
router.post("/login", authController.login);

router.get("/", userController.getAllUsers);
router.patch(
  "/:id",
  passAvatarImage,
  handleUploadAvatar,
  userController.updateUser
);
router.post("/ids", userController.getAllUsersByIds);
router.get("/:id", userController.getUserById);

router.get("/:id/bookmarks", userController.getUserBookmarks);
router.post("/:id/bookmarks", userController.createUserBookmark);

router.get("/:id/applies", userController.getUserApplies);
router.post("/:id/applies", userController.createUserApply);

router.get("/:id/resumes", userController.getUserResumes);

router.get("/:id/expectations", userController.getAllUsersExpectJobs);
router.patch("/:id/expectations", userController.updateExpectJobs);

router.get("/:id/statistics/", userController.getUserStatistics);

module.exports = router;
