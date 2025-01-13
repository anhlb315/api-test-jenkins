const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const industryService = require("../services/industryService");

class IndustryController {
  constructor() {
    this.industryService = industryService;

    this.getAllIndustries = catchAsync(this.getAllIndustries.bind(this));
  }

  async getAllIndustries(req, res, next) {
    const industries = await this.industryService.getAllIndustries();

    if (!industries.length)
      return next(new AppError("No industries found", 404));

    return res.status(200).json({
      status: "success",
      data: {
        industries,
      },
    });
  }
}

module.exports = new IndustryController();
