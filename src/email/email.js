const nodemailer = require("nodemailer");
const fs = require("file-system");
const handlebars = require("handlebars");
const path = require("path");

const otpEmail = async (data) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 443,
      secure: true,
      service: "gmail",
      auth: {
        user: "kenilmangroliya18@gmail.com",
        pass: "vyyxrbisvczzgyvb",
      },
    });

    const mailOptions = {
      from: "<kenilmangroliya18@gmail.com>",
      to: data.email,
      subject: "Welcome!",
      template: "email", // the name of the template file i.e email.handlebars
      html: `<b>${data.otp}</b>`,
    };

    // trigger the sending of the E-mail
    transporter.sendMail(mailOptions, (error) => {
      if (error) {
        return error.message;
      }
      console.log("Mail send success");
    });
  } catch (error) {
    console.log("🚀 ~ otpEmail ~ error:", error);
  }
};

// send otp email template
const sendEmailOTP = async (data) => {
  try {
    return new Promise(async (resolve) => {
      const file_template = data.file_template;
      const subject = data.subject;

      const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 443,
        secure: true,
        service: "gmail",
        auth: {
          user: "kenilmangroliya18@gmail.com",
          pass: "vyyxrbisvczzgyvb",
        },
      });

      const templateStr = fs
        .readFileSync(path.resolve(__dirname, file_template))
        .toString("utf8");
      const template = handlebars.compile(templateStr);
      const htmlToSend = template(data);
      const mailOptions = {
        from: "<kenilmangroliya18@gmail.com>",
        to: data.to,
        subject: subject,
        html: htmlToSend,
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          return { status: false, data: [], message: "Could not send mail!" };
        }
        return { status: true, data: [], message: "mail sent!." };
      });

      // fs.readFile(file_template, { encoding: "utf-8" }, (err, html) => {
      //   const template = handlebars.compile(html);
      //   const htmlToSend = template(data);

      //   const mailOptions = {
      //     from: "<kenilmangroliya18@gmail.com>",
      //     to: data.to,
      //     subject: subject,
      //     html: htmlToSend,
      //   };

      //   transporter.sendMail(mailOptions, (error, info) => {
      //     if (error) {
      //       return { status: false, data: [], message: "Could not send mail!" };
      //     }
      //     return { status: true, data: [], message: "mail sent!." };
      //   });
      // });
    });
  } catch (error) {
    return res.status(HTTP.SUCCESS).send({
      status: false,
      code: HTTP.INTERNAL_SERVER_ERROR,
      message: "Unable to send email!",
      data: error,
    });
  }
};

module.exports = { otpEmail, sendEmailOTP };
