// BookmarkController.js
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const BookmarkService = require("../services/bookmarkService");

class BookmarkController {
  constructor() {
    this.bookmarkService = BookmarkService;

    this.deleteBookmark = catchAsync(this.deleteBookmark.bind(this));
  }

  async deleteBookmark(req, res, next) {
    const { id } = req.params;

    try {
      await this.bookmarkService.deleteBookmark(id);
      res.status(204).json({
        status: "success",
        data: null,
      });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new BookmarkController();
