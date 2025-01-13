const catchAsync = require("../utils/catchAsync");
const TagService = require("../services/tagService");

class TagController {
  constructor() {
    this.tagService = TagService;

    this.getAllTags = catchAsync(this.getAllTags.bind(this));
  }

  async getAllTags(req, res, next) {
    const tags = await this.tagService.getAllTags();

    res.status(200).json({
      status: "success",
      data: {
        tags,
      },
    });
  }
}

module.exports = new TagController();
