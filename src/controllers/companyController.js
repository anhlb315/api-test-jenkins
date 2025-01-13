// companyController.js

const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const CompanyService = require("../services/companyService");

class CompanyController {
  constructor() {
    this.companyService = CompanyService;

    this.getAllCompanies = catchAsync(this.getAllCompanies.bind(this));
    this.createCompany = catchAsync(this.createCompany.bind(this));
    this.getCompanyById = catchAsync(this.getCompanyById.bind(this));
    this.getCompanyComments = catchAsync(this.getCompanyComments.bind(this));
    this.createCompanyComment = catchAsync(
      this.createCompanyComment.bind(this)
    );
    this.importCompaniesToDB = catchAsync(this.importCompaniesToDB.bind(this));
    this.getCompanyApplies = catchAsync(this.getCompanyApplies.bind(this));
    this.getCompanyJobs = catchAsync(this.getCompanyJobs.bind(this));
    this.getCompanyStatisticsByIndustry = catchAsync(
      this.getCompanyStatisticsByIndustry.bind(this)
    );
    this.getApplyStatisticsByApply = catchAsync(
      this.getApplyStatisticsByApply.bind(this)
    );
  }

  async getAllCompanies(req, res, next) {
    const companies = await this.companyService.getAllCompanies();
    if (!companies.length) return next(new AppError("No companies found", 404));

    return res.status(200).json({
      status: "success",
      data: { companies },
    });
  }

  async createCompany(req, res, next) {
    const companyData = req.body;
    const newCompany = await this.companyService.createCompany(companyData);

    res.status(201).json({
      status: "success",
      data: { company: newCompany },
    });
  }

  async getCompanyById(req, res, next) {
    const { id } = req.params;
    const company = await this.companyService.getCompanyById(id);
    if (!company) return next(new AppError("Company not found", 404));

    return res.status(200).json({
      status: "success",
      data: { company },
    });
  }

  async getCompanyComments(req, res, next) {
    const { id } = req.params;
    const comments = await this.companyService.getCompanyComments(id);
    if (!comments.length) return next(new AppError("No comments found", 404));

    return res.status(200).json({
      status: "success",
      data: { comments },
    });
  }

  async createCompanyComment(req, res, next) {
    const commentData = req.body;
    const newReaction = await this.companyService.createCompanyComment(
      commentData
    );

    res.status(201).json({
      status: "success",
      data: { reaction: newReaction },
    });
  }

  async importCompaniesToDB(req, res, next) {
    // Implement import logic if needed
    res.status(501).json({
      status: "error",
      message: "Import companies endpoint not implemented",
    });
  }

  async getCompanyApplies(req, res, next) {
    const { id } = req.params;
    const applies = await this.companyService.getCompanyApplies(id);

    // if (!applies) return next(new AppError("No applies found", 404));
    return res.status(200).json({
      status: "success",
      data: { applies },
    });
  }

  async getCompanyJobs(req, res, next) {
    const { id } = req.params;
    const jobs = await this.companyService.getCompanyJobs(id);
    if (!jobs) return next(new AppError("No jobs found", 404));
    return res.status(200).json({
      status: "success",
      data: { jobs },
    });
  }

  async getCompanyStatisticsByIndustry(req, res, next) {
    const { id } = req.params;
    const statistics = await this.companyService.getCompanyStatisticsByIndustry(
      id
    );
    if (!statistics) return next(new AppError("Statistics not found", 404));

    return res.status(200).json({
      status: "success",
      data: { statisticsByIndustries: statistics },
    });
  }

  async getApplyStatisticsByApply(req, res, next) {
    const { id } = req.params;
    const statistics = await this.companyService.getApplyStatisticsByApply(id);
    if (!statistics) return next(new AppError("Statistics not found", 404));
    return res.status(200).json({
      status: "success",
      data: { statisticsByApply: statistics },
    });
  }
}

module.exports = new CompanyController();
