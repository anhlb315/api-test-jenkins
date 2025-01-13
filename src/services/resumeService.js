const { Resume } = require("../models/databaseIndex");
const { s3, GetObjectCommand, getSignedUrl } = require("../services/s3Bucket");

class ResumeService {
  async getAllResumes() {
    const resumes = await Resume.findAll();
    if (!resumes.length) return [];

    const resumesPromises = resumes.map(async (resume) => {
      if (resume.is_uploaded && resume.resume_url) {
        const command = new GetObjectCommand({
          Bucket: process.env.BUCKET_NAME,
          Key: resume.resume_url,
        });

        const handledUrl = await getSignedUrl(s3, command, {
          expiresIn: 3600 * 24,
        });

        return {
          ...resume.dataValues,
          resume_url: handledUrl,
        };
      }

      return resume;
    });

    return await Promise.all(resumesPromises);
  }

  async getResumeById(id) {
    return await Resume.findByPk(id);
  }

  async createResume(data) {
    const newResume = await Resume.create({
      user_id: data.user_id,
      data: JSON.stringify(data.resume),
      name: data.resume_name,
    });

    return newResume;
  }

  async uploadResume(data, resumeName) {
    const newResume = await Resume.create({
      user_id: data.userId,
      name: data.name,
      resume_url: resumeName,
      is_uploaded: true,
    });

    return newResume;
  }
}

module.exports = new ResumeService();
