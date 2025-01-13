// companyService.js

const {
  Company,
  Reaction,
  User,
  Apply,
  Job,
  Tag,
  Province,
  Industry,
  Resume,
  Op,
} = require("../models/databaseIndex");
const { GetObjectCommand, getSignedUrl, s3 } = require("../services/s3Bucket");
const resolveS3Urls = require("../utils/s3AWS");

class CompanyService {
  async getAllCompanies() {
    return await Company.findAll({
      order: [["average_rating", "DESC"]],
    });
  }

  async createCompany(companyData) {
    const {
      name,
      location,
      country,
      introduction,
      employees,
      website,
      contact_mail,
      province_id,
      logoUrl,
      coverImageUrl,
      agent_id,
    } = companyData;

    const newCompany = await Company.create({
      name,
      location,
      country,
      introduction,
      employees,
      website,
      contact_mail,
      province_id,
      logo: logoUrl,
      cover_image: coverImageUrl,
    });

    await resolveS3Urls(newCompany, ["logo", "cover_image"]);

    const agent = await User.findByPk(agent_id);
    if (agent) {
      agent.company_id = newCompany.id;
      await agent.save();
    }

    return newCompany;
  }

  async getCompanyById(companyId) {
    return await Company.findByPk(companyId, {
      include: [{ model: Reaction }],
    });
  }

  async getCompanyComments(companyId) {
    return await Reaction.findAll({
      where: { company_id: companyId },
      order: [["updatedAt", "DESC"]],
      include: [{ model: User, attributes: ["id", "name", "gmail", "avatar"] }],
    });
  }

  async createCompanyComment(commentData) {
    const {
      company_id,
      user_id,
      comment,
      salary_rating,
      working_space_rating,
      colleague_relationship_rating,
    } = commentData;

    const company = await Company.findByPk(company_id);
    if (!company) return null;

    const reactionData = {
      user_id,
      company_id,
      comment,
      salary_rating,
      working_space_rating,
      colleague_relationship_rating,
    };

    return await Reaction.create(reactionData);
  }

  async getCompanyApplies(companyId) {
    const company = await Company.findByPk(companyId);
    if (!company) return null;

    const jobsOfCompany = await company.getJobs({
      attributes: ["id"],
      raw: true,
    });

    const jobIds = jobsOfCompany.map((job) => job.id);

    const applies = await Apply.findAll({
      where: { job_id: { [Op.in]: jobIds } },
      include: [
        { model: User, attributes: ["id", "name", "gmail", "avatar"] },
        {
          model: Job,
          attributes: ["id", "title"],
          include: [{ model: Company, attributes: ["id", "name"] }],
        },
        { model: Resume },
      ],
      order: [["updatedAt", "DESC"]],
    });

    const parsedApplies = await Promise.all(
      applies.map(async (apply) => {
        if (
          apply.Resume &&
          apply.Resume.is_uploaded &&
          apply.Resume.resume_url
        ) {
          const command = new GetObjectCommand({
            Bucket: process.env.BUCKET_NAME,
            Key: apply.Resume.resume_url,
          });

          const handledUrl = await getSignedUrl(s3, command, {
            expiresIn: 3600 * 24,
          });

          apply.Resume.resume_url = handledUrl;
        }

        return apply;
      })
    );

    return parsedApplies;
  }

  async getCompanyJobs(companyId) {
    const company = await Company.findByPk(companyId);
    if (!company) return null;

    return await company.getJobs({
      include: [
        { model: Company },
        { model: Tag },
        { model: Province },
        { model: Industry },
      ],
      order: [["updatedAt", "DESC"]],
    });
  }

  async getCompanyStatisticsByIndustry(companyId) {
    const company = await Company.findByPk(companyId, {
      include: [{ model: Job, include: [Apply, Industry] }],
    });

    if (!company) return null;

    const companyIndustriesId = Array.from(
      new Set(
        company.Jobs.flatMap((job) =>
          job.Industries.map((industry) => industry.id)
        )
      )
    );

    const industries = await Industry.findAll();

    const statistics = companyIndustriesId.map((industryId) => {
      const jobsInIndustry = company.Jobs.filter((job) =>
        job.Industries.some((industry) => industry.id === industryId)
      );

      const totalJobs = jobsInIndustry.length;
      const totalAppliedUsers = jobsInIndustry.reduce((acc, job) => {
        return acc + (job.Applies ? job.Applies.length : 0);
      }, 0);

      const industryName = industries.find(
        (industry) => industry.id === industryId
      ).industry;

      return {
        industry: industryName,
        totalJobs,
        totalAppliedUsers,
      };
    });

    return statistics;
  }

  async getApplyStatisticsByApply(companyId) {
    const company = await Company.findByPk(companyId, {
      include: [{ model: Job, include: Apply }],
    });

    if (!company) return null;

    const applyCountsByType = {
      pending: 0,
      "accepted-cv-round": 0,
      "accepted-interview-round": 0,
      rejected: 0,
    };

    company.Jobs.forEach((job) => {
      job.Applies.forEach((apply) => {
        applyCountsByType[apply.status]++;
      });
    });

    const statisticsArray = Object.entries(applyCountsByType).map(
      ([status, value]) => ({
        status,
        value,
      })
    );

    return statisticsArray;
  }
}

module.exports = new CompanyService();
