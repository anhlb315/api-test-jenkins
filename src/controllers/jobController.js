const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const JobService = require("../services/jobService");
const { validationResult } = require("express-validator");

class JobController {
  constructor() {
    this.jobService = JobService;

    this.getAllJobs = catchAsync(this.getAllJobs.bind(this));
    this.getJobById = catchAsync(this.getJobById.bind(this));
    this.createJob = catchAsync(this.createJob.bind(this));
    this.updateJob = catchAsync(this.updateJob.bind(this));
    this.deleteJob = catchAsync(this.deleteJob.bind(this));
    this.importJobsToDB = catchAsync(this.importJobsToDB.bind(this));
  }

  async getAllJobs(req, res, next) {
    const jobs = await this.jobService.getAllJobs(req.query);
    if (!jobs.length) return next(new AppError("No jobs found", 404));
    return res.status(200).json({
      status: "success",
      data: { count: jobs.length, jobs },
    });
  }

  async getJobById(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return next(new AppError(errors.array()[0].msg, 400));

    const job = await this.jobService.getJobById(req.params.id);
    if (!job) return next(new AppError("No job found", 404));

    return res.status(200).json({
      status: "success",
      data: { job },
    });
  }

  async createJob(req, res, next) {
    const data = { ...req.body };
    const s3Images = req.imagesName;
    const job = await this.jobService.createJob(data, s3Images);
    return res.status(201).json({
      status: "success",
      message: "Job created successfully",
      data: { job },
    });
  }

  async updateJob(req, res, next) {
    const jobId = req.params.id;
    const data = { ...req.body };
    const s3Images = req.imagesName;
    const job = await this.jobService.updateJob(jobId, data, s3Images);
    if (!job) return next(new AppError("No job found", 404));
    return res.status(200).json({
      status: "success",
      message: "Job updated successfully",
      data: { job },
    });
  }

  async deleteJob(req, res, next) {
    const jobId = req.params.id;
    const job = await this.jobService.deleteJob(jobId);
    if (!job) return next(new AppError("No job found", 404));
    return res.status(204).json({
      status: "success",
      message: "Job deleted successfully",
      data: null,
    });
  }

  async importJobsToDB(req, res, next) {
    await this.jobService.importJobsToDB();
    res.status(201).json({
      status: "success",
      data: null,
    });
  }
}

module.exports = new JobController();
