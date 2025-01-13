const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const { ExpectJob, Job, Op, Sequelize } = require("../models/databaseIndex");

exports.createNewExpectJob = catchAsync(async (req, res, next) => {
  const expectJob = await ExpectJob.create(req.body);

  return res.status(201).json({
    status: "success",
    data: {
      expectJob,
    },
  });
});

async function searchJobsBySkills(skills) {
  try {
    const likeConditions = skills.map((skill) => ({
      [Op.or]: [
        { title: { [Op.like]: `%${skill}%` } },
        { description: { [Op.like]: `%${skill}%` } },
      ],
    }));

    const results = await Job.findAll({
      where: {
        [Op.or]: [
          Sequelize.literal(
            `MATCH (title, description) AGAINST (:skills IN BOOLEAN MODE)`
          ),
          ...likeConditions,
        ],
      },
      replacements: { skills: skills.map((skill) => `*${skill}*`).join(", ") }, // Use wildcards for boolean mode
    });
    return results;
  } catch (error) {
    console.error("Error searching jobs by skills:", error);
    throw error;
  }
}

exports.getAllExpectJob = catchAsync(async (req, res, next) => {
  const skills = ["thong tin"];

  const results = await searchJobsBySkills(skills);

  return res.status(200).json({
    status: "success",
    data: {
      count: results.length,
      results,
    },
  });
});
