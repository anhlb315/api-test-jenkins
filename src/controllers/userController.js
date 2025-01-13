const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const UserService = require("../services/userService");

class UserController {
  constructor() {
    this.userService = UserService;

    this.getAllUsers = catchAsync(this.getAllUsers.bind(this));
    this.updateUser = catchAsync(this.updateUser.bind(this));
    this.getAllUsersByIds = catchAsync(this.getAllUsersByIds.bind(this));
    this.getUserById = catchAsync(this.getUserById.bind(this));
    this.getUserBookmarks = catchAsync(this.getUserBookmarks.bind(this));
    this.createUserBookmark = catchAsync(this.createUserBookmark.bind(this));
    this.getUserApplies = catchAsync(this.getUserApplies.bind(this));
    this.createUserApply = catchAsync(this.createUserApply.bind(this));
    this.getUserResumes = catchAsync(this.getUserResumes.bind(this));
    this.getAllUsersExpectJobs = catchAsync(
      this.getAllUsersExpectJobs.bind(this)
    );
    this.updateExpectJobs = catchAsync(this.updateExpectJobs.bind(this));
    this.getUserStatistics = catchAsync(this.getUserStatistics.bind(this));
  }

  async getAllUsers(req, res, next) {
    const users = await this.userService.getAllUsers();
    return res.status(200).json({
      status: "success",
      data: { users },
    });
  }

  async updateUser(req, res, next) {
    const { id } = req.params;
    const { file, body: data } = req;
    const avatarName = file ? file.originalname : null;
    const user = await this.userService.updateUser(id, data, avatarName);
    if (!user) return next(new AppError("User not found", 404));
    return res.status(200).json({
      status: "success",
      data: { user },
    });
  }

  async getAllUsersByIds(req, res, next) {
    const { userIds } = req.body;
    const users = await this.userService.getAllUsersByIds(userIds);
    return res.status(200).json({
      status: "success",
      data: { users },
    });
  }

  async getUserById(req, res, next) {
    const { id } = req.params;
    const user = await this.userService.getUserById(id);
    if (!user) return next(new AppError("User not found", 404));
    return res.status(200).json({
      status: "success",
      data: { user },
    });
  }

  async getUserBookmarks(req, res, next) {
    const { id } = req.params;
    const user = await this.userService.getUserBookmarks(id);
    if (!user) return next(new AppError("User not found", 404));
    return res.status(200).json({
      status: "success",
      data: {
        bookmarks: user.Bookmarks,
      },
    });
  }

  async createUserBookmark(req, res, next) {
    const { id } = req.params;
    const bookmarkObject = req.body;
    const user = await this.userService.createUserBookmark(id, bookmarkObject);
    if (!user) return next(new AppError("User not found", 404));
    return res.status(200).json({
      status: "success",
      data: { user },
    });
  }

  async getUserApplies(req, res, next) {
    const { id } = req.params;
    const applies = await this.userService.getUserApplies(id);
    if (!applies) return next(new AppError("User not found", 404));

    return res.status(200).json({
      status: "success",
      data: { applies },
    });
  }

  async createUserApply(req, res, next) {
    const { id } = req.params;
    const applyObject = req.body;
    const user = await this.userService.createUserApply(id, applyObject);
    if (!user) return next(new AppError("User not found", 404));
    return res.status(200).json({
      status: "success",
      data: { user },
    });
  }

  async getUserResumes(req, res, next) {
    const { id } = req.params;
    const resumes = await this.userService.getUserResumes(id);
    if (!resumes) return next(new AppError("No resumes found", 404));
    return res.status(200).json({
      status: "success",
      data: { resumes },
    });
  }

  async getAllUsersExpectJobs(req, res, next) {
    const userId = req.params.id;
    const { results, requirement } =
      await this.userService.getAllUsersExpectJobs(userId);
    if (!results) return next(new AppError("No expect jobs found", 404));
    return res.status(200).json({
      status: "success",
      data: {
        count: results.length,
        expectJobs: results,
        requirement,
      },
    });
  }

  async updateExpectJobs(req, res, next) {
    const userId = req.params.id;
    const data = req.body;
    const expectJobs = await this.userService.updateExpectJobs(userId, data);
    if (!expectJobs) return next(new AppError("No expect jobs found", 404));
    return res.status(200).json({
      status: "success",
      data: { expectJobs },
    });
  }

  async getUserStatistics(req, res, next) {
    const { id } = req.params;
    const statistics = await this.userService.getUserStatistics(id);
    if (!statistics) return next(new AppError("User not found", 404));
    return res.status(200).json({
      status: "success",
      data: { statistics },
    });
  }
}

module.exports = new UserController();
