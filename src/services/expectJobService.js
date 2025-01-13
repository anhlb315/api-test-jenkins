const { ExpectJob, Job, Op, Sequelize } = require("../models/databaseIndex");

class ExpectJobService {
  async createNewExpectJob(data) {
    return await ExpectJob.create(data);
  }

  async searchJobsBySkills(skills) {
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
        replacements: {
          skills: skills.map((skill) => `*${skill}*`).join(", "),
        }, // Use wildcards for boolean mode
      });
      return results;
    } catch (error) {
      console.error("Error searching jobs by skills:", error);
      throw error;
    }
  }

  async getAllExpectJobs(skills) {
    return await this.searchJobsBySkills(skills);
  }
}

module.exports = new ExpectJobService();
