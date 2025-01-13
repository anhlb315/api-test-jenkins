const { Industry, Job, Apply } = require("../models/databaseIndex");

class StatisticService {
  async getTotalJobsAndAppliedJobsByIndustry() {
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

    return result;
  }
}

module.exports = new StatisticService();
