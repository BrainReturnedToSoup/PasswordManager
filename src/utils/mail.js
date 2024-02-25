const nodemailer = require("nodemailer");
const promisify = require("util").promisify;

const transporter = nodemailer.createTransport({
  host: "smtp-mail.outlook.com",
  secureConnection: false,
  port: 587,
  tls: {
    ciphers: "SSLv3",
  },
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

const sendMail = promisify(transporter.sendMail).bind(transporter);

module.exports = sendMail;
