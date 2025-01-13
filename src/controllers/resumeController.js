const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const resumeService = require("../services/resumeService");

class ResumeController {
  constructor() {
    this.resumeService = resumeService;

    this.getAllResumes = catchAsync(this.getAllResumes.bind(this));
    this.getResumeById = catchAsync(this.getResumeById.bind(this));
    this.createResume = catchAsync(this.createResume.bind(this));
    this.uploadResume = catchAsync(this.uploadResume.bind(this));
  }

  async getAllResumes(req, res, next) {
    const resumes = await this.resumeService.getAllResumes();
    if (!resumes.length) return next(new AppError("No resumes found", 404));

    return res.status(200).json({
      status: "success",
      data: {
        resumes,
      },
    });
  }

  async getResumeById(req, res, next) {
    const resume = await this.resumeService.getResumeById(req.params.id);
    if (!resume) return next(new AppError("No resume found", 404));

    return res.status(200).json({
      status: "success",
      data: {
        resume,
      },
    });
  }

  async createResume(req, res, next) {
    const data = req.body;
    const newResume = await this.resumeService.createResume(data);

    return res.status(201).json({
      status: "success",
      data: {
        resume: newResume,
      },
    });
  }

  async uploadResume(req, res, next) {
    const data = req.body;
    const resumeName = req.resumeName;
    const newResume = await this.resumeService.uploadResume(data, resumeName);

    return res.status(200).json({
      status: "success",
      data: {
        resume: newResume,
      },
    });
  }
}

module.exports = new ResumeController();
