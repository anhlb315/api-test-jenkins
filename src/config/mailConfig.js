const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: "anh.lb194470@gmail.com",
    pass: "ozgc cyuq mjrf cyrt",
  },
});

module.exports = { transporter };
