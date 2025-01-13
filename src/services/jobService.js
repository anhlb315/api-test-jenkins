const {
  Job,
  Company,
  JobImage,
  User,
  Tag,
  Industry,
  Province,
  Apply,
} = require("../models/databaseIndex");
const jobsData = require("../constant/jobsData");
const { addMonths } = require("date-fns");
const {
  s3,
  GetObjectCommand,
  DeleteObjectCommand,
  getSignedUrl,
} = require("../services/s3Bucket");

class JobService {
  async getAllJobs(query) {
    return await Job.findAll({
      where: query,
      include: [
        { model: Company },
        { model: Tag },
        { model: Industry },
        { model: Province },
      ],
      order: [["updatedAt", "DESC"]],
    });
  }

  async getJobById(id) {
    const job = await Job.findByPk(id, {
      include: [
        { model: Company, include: [{ model: User }] },
        { model: JobImage },
        { model: Tag },
        { model: Industry },
        { model: Province },
        { model: Apply },
      ],
    });

    if (!job) return null;

    const ownerCompany = await User.findOne({
      where: { company_id: job.Company.dataValues.id },
    });

    const ownerId = ownerCompany ? ownerCompany.id : null;

    const jobImages = job.JobImages.map(async (image) => {
      if (image.image.includes("http"))
        return { id: image.id, image: image.image };

      const command = new GetObjectCommand({
        Bucket: process.env.BUCKET_NAME,
        Key: image.image,
      });

      const handledUrl = await getSignedUrl(s3, command, {
        expiresIn: 3600 * 24 * 7,
      });
      return { id: image.id, image: handledUrl };
    });

    const handledImages = await Promise.all(jobImages);
    const jobData = job.toJSON();
    jobData.handledImages = handledImages;
    jobData.ownerId = ownerId;

    return jobData;
  }

  async createJob(data, s3Images) {
    const tags = data.tags ? data.tags.split(",").map((tag) => tag.trim()) : [];
    const industries = data.industries
      ? data.industries.split(",").map((industry) => industry.trim())
      : [];

    const job = await Job.create({
      ...data,
      gender: data.gender === "null" ? null : data.gender,
    });

    if (tags.length > 0) {
      const tagInstances = await Promise.all(
        tags.map((tag) => Tag.findOrCreate({ where: { tag } }))
      );
      await job.addTags(
        tagInstances.map(([tagInstance]) => tagInstance),
        { through: "job_tags" }
      );
    }

    if (industries.length > 0) {
      const industryInstances = await Promise.all(
        industries.map((industry) =>
          Industry.findOrCreate({ where: { industry } })
        )
      );
      await job.addIndustries(
        industryInstances.map(([industryInstance]) => industryInstance),
        { through: "job_industries" }
      );
    }

    const jobImagesObj = s3Images.map((image) => ({ job_id: job.id, image }));

    if (jobImagesObj.length > 0) {
      await JobImage.bulkCreate(jobImagesObj);
    }

    return job;
  }

  async updateJob(id, data, s3Images) {
    const tags = data.tags ? data.tags.split(",").map((tag) => tag.trim()) : [];
    const industries = data.industries
      ? data.industries.split(",").map((industry) => industry.trim())
      : [];

    const job = await Job.findByPk(id, { include: [JobImage, Tag, Industry] });
    if (!job) return null;

    await job.removeTags(job.Tags);
    await job.removeIndustries(job.Industries);

    if (tags.length > 0) {
      const tagInstances = await Promise.all(
        tags.map((tag) => Tag.findOrCreate({ where: { tag } }))
      );
      await job.addTags(
        tagInstances.map(([tag]) => tag),
        { through: "job_tags" }
      );
    }

    if (industries.length > 0) {
      const industryInstances = await Promise.all(
        industries.map((industry) =>
          Industry.findOrCreate({ where: { industry } })
        )
      );
      await job.addIndustries(
        industryInstances.map(([industry]) => industry),
        { through: "job_industries" }
      );
    }

    const jobImagesS3Delete = job.JobImages.map(async (image) => {
      if (!image.image.includes("http")) {
        const params = { Bucket: process.env.BUCKET_NAME, Key: image.image };
        const command = new DeleteObjectCommand(params);
        await s3.send(command);
      }
    });

    await Promise.all(jobImagesS3Delete);
    await JobImage.destroy({ where: { job_id: id } });

    const jobImagesObj = s3Images.map((image) => ({ job_id: id, image }));
    await JobImage.bulkCreate(jobImagesObj);

    await job.update({
      ...data,
      gender: data.gender === "null" ? null : data.gender,
    });

    return job;
  }

  async deleteJob(id) {
    const job = await Job.findByPk(id, { include: [JobImage, Tag, Industry] });
    if (!job) return null;

    await job.removeTags(job.Tags);
    await job.removeIndustries(job.Industries);

    const jobImagesS3Delete = job.JobImages.map(async (image) => {
      if (!image.image.includes("http")) {
        const params = { Bucket: process.env.BUCKET_NAME, Key: image.image };
        const command = new DeleteObjectCommand(params);
        await s3.send(command);
      }
    });

    await Promise.all(jobImagesS3Delete);
    await job.destroy();

    return job;
  }

  async importJobsToDB() {
    const newJobs = jobsData.map((job) => ({
      ...job,
      min_salary: parseInt(job.min_salary),
      max_salary: parseInt(job.min_salary) + parseInt(job.min_salary) * 0.5,
      expired_date: addMonths(new Date(), 1),
    }));

    return await Job.bulkCreate(newJobs);
  }
}

module.exports = new JobService();
