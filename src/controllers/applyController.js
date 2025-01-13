const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const ApplyService = require("../services/applyService");

class ApplyController {
  constructor() {
    this.applyService = ApplyService;

    this.updateApply = catchAsync(this.updateApply.bind(this));
    this.deleteApply = catchAsync(this.deleteApply.bind(this));
  }

  async updateApply(req, res, next) {
    const { id } = req.params;
    const data = { ...req.body };

    try {
      const apply = await this.applyService.updateApply(id, data);
      res.status(200).json({
        status: "success",
        data: { apply },
      });
    } catch (err) {
      next(err);
    }
  }

  async deleteApply(req, res, next) {
    const { id } = req.params;

    try {
      await this.applyService.deleteApply(id);
      res.status(204).json({
        status: "success",
        data: null,
      });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new ApplyController();
