const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const { Industry, Job, Apply } = require("../models/databaseIndex");

exports.getTotalJobsAndAppliedJobsByIndustry = catchAsync(
  async (req, res, next) => {
    const industries = await Industry.findAll({
      include: [
        {
          model: Job,
          include: Apply,
        },
      ],
    });

    const result = industries.map((industry) => ({
      industry: industry.industry,
      totalJobs: industry.Jobs ? industry.Jobs.length : 0,
      totalAppliedJobs: industry.Jobs
        ? industry.Jobs.reduce(
            (acc, job) => acc + (job.Applies ? job.Applies.length : 0),
            0
          )
        : 0,
    }));

    res.status(200).json({
      status: "success",
      data: {
        statistics: result,
      },
    });
  }
);
