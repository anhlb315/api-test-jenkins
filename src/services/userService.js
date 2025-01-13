// userService.js
const {
  User,
  Bookmark,
  Apply,
  ExpectJob,
  Op,
  Sequelize,
  Job,
  Company,
  Resume,
  Industry,
  Province,
  Tag,
  JobImage,
} = require("../models/databaseIndex");
const {
  s3,
  GetObjectCommand,
  DeleteObjectCommand,
  getSignedUrl,
} = require("../services/s3Bucket");

class UserService {
  async getAllUsers() {
    return await User.findAll();
  }

  async updateUser(id, data, avatarName) {
    const user = await User.findByPk(id);
    if (!user) return null;

    if (user.avatar) {
      const deleteCommand = new DeleteObjectCommand({
        Bucket: process.env.BUCKET_NAME,
        Key: user.avatar,
      });
      await s3.send(deleteCommand);
    }

    user.avatar = avatarName;
    user.date_of_birth = new Date(data.date_of_birth);
    user.name = data.name;

    await user.save();
    return user;
  }

  async getAllUsersByIds(userIds) {
    return await User.findAll({
      where: {
        id: {
          [Op.in]: userIds,
        },
      },
    });
  }

  async getUserById(id) {
    return await User.findByPk(id);
  }

  async getUserBookmarks(id) {
    return await User.findByPk(id, {
      include: {
        model: Bookmark,
        include: {
          model: Job,
          include: [
            { model: Company },
            { model: Tag },
            { model: Industry },
            { model: Province },
          ],
        },
      },
    });
  }

  async createUserBookmark(id, bookmarkObject) {
    const user = await User.findByPk(id);
    if (!user) return null;

    await user.createBookmark({ job_id: bookmarkObject.job_id });
    return user;
  }

  async getUserApplies(id) {
    const user = await User.findByPk(id, {
      include: [
        {
          model: Apply,
          include: [
            { model: User, attributes: ["id", "name", "gmail", "avatar"] },
            {
              model: Job,
              attributes: ["id", "title"],
              include: { model: Company, attributes: ["id", "name"] },
            },
            { model: Resume },
          ],
        },
      ],
    });

    if (!user) return null;

    const appliesPromises = user.Applies.map(async (apply) => {
      if (apply.Resume && apply.Resume.is_uploaded && apply.Resume.resume_url) {
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
    });

    return await Promise.all(appliesPromises);
  }

  async createUserApply(id, applyObject) {
    const user = await User.findByPk(id);
    if (!user) return null;

    await user.createApply({
      job_id: applyObject.job_id,
      resume_id: applyObject.resume_id,
    });
    return user;
  }

  async getUserResumes(id) {
    const resumes = await Resume.findAll({ where: { user_id: id } });
    if (!resumes.length) return null;

    const resumesPromises = resumes.map(async (resume) => {
      if (resume.is_uploaded && resume.resume_url) {
        const command = new GetObjectCommand({
          Bucket: process.env.BUCKET_NAME,
          Key: resume.resume_url,
        });
        const handledUrl = await getSignedUrl(s3, command, {
          expiresIn: 3600 * 24,
        });
        return { ...resume.dataValues, resume_url: handledUrl };
      }
      return resume;
    });

    return await Promise.all(resumesPromises);
  }

  async searchExpectationJobs(expectJobs) {
    const {
      min_salary,
      industries,
      working_experience,
      working_method,
      working_type,
      province_id,
      skills,
    } = expectJobs;

    const likeConditions = skills
      ? skills.split(", ").map((skill) => ({
          [Op.or]: [
            { title: { [Op.like]: `%${skill}%` } },
            { description: { [Op.like]: `%${skill}%` } },
            { "$Tags.tag$": { [Op.like]: `%${skill}%` } },
          ],
        }))
      : [];

    let specificConditions = {
      min_salary: { [Op.gte]: min_salary },
      working_experience: { [Op.lte]: working_experience },
      working_method,
      working_type,
      province_id,
      "$Industries.id$": { [Op.in]: industries.split(",").map(Number) },
    };

    if (!working_type) delete specificConditions.working_type;
    if (!working_method) delete specificConditions.working_method;
    if (!province_id) delete specificConditions.province_id;

    if (likeConditions.length > 0) {
      specificConditions = {
        [Op.and]: [specificConditions, { [Op.or]: likeConditions }],
      };
    }

    return await Job.findAll({
      where: specificConditions,
      include: [
        { model: Company },
        { model: JobImage },
        { model: Tag },
        { model: Industry },
        { model: Province },
      ],
    });
  }

  async getAllUsersExpectJobs(userId) {
    const expectJobs = await ExpectJob.findOne({ where: { user_id: userId } });
    if (!expectJobs) return null;

    const results = await this.searchExpectationJobs(expectJobs);
    return { results, requirement: expectJobs };
  }

  async updateExpectJobs(userId, data) {
    const expectJobs = await ExpectJob.findOne({ where: { user_id: userId } });
    if (!expectJobs) return null;

    Object.assign(expectJobs, data);
    await expectJobs.save();
    return expectJobs;
  }

  async getUserStatistics(id) {
    const user = await User.findByPk(id);
    if (!user) return null;

    const appliedJobsCount = await Apply.count({ where: { user_id: id } });
    const bookmarkedJobsCount = await Bookmark.count({
      where: { user_id: id },
    });

    const appliedJobs = await Apply.findAll({
      where: { user_id: id },
      include: [{ model: Job, include: { model: Industry } }],
    });

    const resumesCount = await Resume.count({ where: { user_id: id } });

    const industriesIdsArray = appliedJobs.reduce((acc, apply) => {
      const industryIds = apply.Job.Industries.map((industry) => industry.id);
      return [...acc, ...industryIds];
    }, []);

    const uniqueIndustriesIdsArray = [...new Set(industriesIdsArray)];
    const industries = await Industry.findAll({
      where: { id: { [Op.in]: uniqueIndustriesIdsArray } },
    });

    const industryCount = industries.map((industry) => {
      const count = appliedJobs.filter((apply) =>
        apply.Job.Industries.some(
          (jobIndustry) => jobIndustry.id === industry.id
        )
      ).length;
      return { name: industry.industry, count };
    });

    const applyCountsByType = {
      pending: 0,
      "accepted-cv-round": 0,
      "accepted-interview-round": 0,
      rejected: 0,
    };
    appliedJobs.forEach((apply) => {
      applyCountsByType[apply.status] += 1;
    });

    const statisticsArray = Object.entries(applyCountsByType).map(
      ([status, value]) => ({ status, value })
    );

    return {
      appliedJobsCount,
      bookmarkedJobsCount,
      resumesCount,
      appliedByIndustries: industryCount,
      applyCountsByType: statisticsArray,
    };
  }
}

module.exports = new UserService();
