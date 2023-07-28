var nodemailer = require("nodemailer");

var sendEmail = async (options) => {
  // create a transporter (MailTrap for testing Email send)
  // let transporter = nodemailer.createTransport({
  //   host: process.env.EMAIL_HOST,
  //   port: process.env.EMAIL_PORT,
  //   auth: {
  //     user: process.env.EMAIL_USERNAME,
  //     pass: process.env.EMAIL_PASSWORD,
  //   },
  // });

  // create a transporter (Send Real Email) // nodemailer reg email & pass
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    auth: {
      user: "joey.dev.biz@gmail.com",
      pass: "frgskkdniiowzuuc",
    },
  });

  // Define the email options
  let mailOptions = {
    from: "joey.dev.biz@gmail.com",
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  // Actually send the email
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
