const nodemailer = require("nodemailer");
const promisify = require("util").promisify;

const transporter = nodemailer.createTransport({
  service: PROCESS.ENV.MAIL_SERVICE,
  auth: {
    user: PROCESS.ENV.MAIL_USER,
    pass: PROCESS.ENV.MAIL_PASS,
  },
});

const sendMail = promisify(transporter.sendMail).bind(transporter);

module.exports = sendMail;
