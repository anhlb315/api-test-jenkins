// BookmarkService.js
const { Bookmark } = require("../models/databaseIndex");
const AppError = require("../utils/appError");

class BookmarkService {
  async deleteBookmark(id) {
    const bookmark = await Bookmark.findByPk(id);
    if (!bookmark) {
      throw new AppError("Bookmark not found", 404);
    }

    await bookmark.destroy();
  }
}

module.exports = new BookmarkService();
