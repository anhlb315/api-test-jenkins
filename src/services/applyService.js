// ApplyService.js
const { Apply, User, Job } = require("../models/databaseIndex");
const { transporter } = require("../config/mailConfig");
const AppError = require("../utils/appError");

class ApplyService {
  async updateApply(id, data) {
    const apply = await Apply.findByPk(id);
    if (!apply) {
      throw new AppError("Apply not found", 404);
    }

    const updatedApply = {
      status: data.status,
      response: data.response,
    };

    await apply.update(updatedApply);

    if (data.status === "accepted-interview-round") {
      const job_id = data.job_id;
      const job = await Job.findByPk(job_id);
      if (!job) {
        throw new AppError("Job not found", 404);
      }
      await job.update({ recruitment_number: job.recruitment_number - 1 });
    }

    const { sender_id, receiver_id, message, response } = data;

    const senderUser = await User.findByPk(sender_id);
    const receiverUser = await User.findByPk(receiver_id);

    const mailOptions = {
      from: senderUser.gmail,
      to: receiverUser.gmail,
      subject: message,
      html: response,
    };

    await transporter.sendMail(mailOptions);

    return apply;
  }

  async deleteApply(id) {
    const apply = await Apply.findByPk(id);
    if (!apply) {
      throw new AppError("Apply not found", 404);
    }

    await apply.destroy();
  }
}

module.exports = new ApplyService();
