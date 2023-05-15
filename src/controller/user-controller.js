// const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const HTTP = require("../constant/response.constant");

const usermodel = require("../model/userModel");
const { sendEmailOTP } = require("../email/email");
const { encodeData, decodeData } = require("../public/partials/cryptoJS");

const random = Math.random().toString().substr(2, 4);

// Register New User
const register = async (req, res) => {
  try {
    const { name, email, password, contact, verify_otp, cash_bonus } = req.body;

    if (!email || !password || !name || !contact || !req.body) {
      return res.status(HTTP.SUCCESS).send({
        status: false,
        code: HTTP.NOT_FOUND,
        message: "All fields are required!",
        data: {},
      });
    }

    const userEmail = await usermodel.findOne({ email });

    if (userEmail) {
      return res.status(HTTP.SUCCESS).send({
        status: true,
        code: HTTP.SUCCESS,
        message: "Email Is Already Taken",
      });
    }

    if (!userEmail) {
      const passwordHash = await bcrypt.hash(password, 10);
      const user = {
        name,
        email,
        password: passwordHash,
        contact,
        otp: random,
        cash_bonus,
        verify_otp,
      };
      const sendMailData = {
        file_template: "../public/template/resendOtp.html",
        subject: "Cricket Live",
        to: `${user.email}`,
        username: `${user.name}`,
        otp: `${user.otp}`,
      };

      sendEmailOTP(sendMailData)
        .then((val) => {
          return res.status(HTTP.SUCCESS).send({
            status: true,
            code: HTTP.SUCCESS,
            message: "Please check your email.",
            data: val,
          });
        })
        .catch((err) => {
          console.log(err);
          return res.status(HTTP.SUCCESS).send({
            status: false,
            code: HTTP.BAD_REQUEST,
            message: "Unable to send email!",
            data: {},
          });
        });
      await usermodel(user).save();
      return res.status(HTTP.SUCCESS).send({
        status: true,
        code: HTTP.SUCCESS,
        message: "Register successfully",
        data: user,
      });
    }
  } catch (error) {
    if (error) {
      return res.status(HTTP.BAD_REQUEST).send({
        status: true,
        code: HTTP.BAD_REQUEST,
        message: error,
      });
    }
  }
};

// Resend OTP
const resendOTP = async (req, res) => {
  try {
    const { email } = req.body;

    const checkEmail = await usermodel.findOne({ email });

    if (!checkEmail) {
      return res.status(HTTP.SUCCESS).send({
        status: true,
        code: HTTP.BAD_REQUEST,
        message: "Invalid email address",
        data: {},
      });
    }

    if (checkEmail) {
      const resendOTP = {
        email,
        otp: random,
      };

      const update = await usermodel.findOneAndUpdate(
        { email },
        {
          otp: resendOTP.otp,
        },
        { new: true }
      );

      const sendMailData = {
        file_template: "../public/template/resendOtp.html",
        subject: "Verify OTP for email change",
        to: email,
        username: `${checkEmail.name}`,
        otp: `${resendOTP.otp}`,
      };

      sendEmailOTP(sendMailData)
        .then((val) => {
          return res.status(HTTP.SUCCESS).send({
            status: true,
            code: HTTP.SUCCESS,
            message: "Please check your email.",
            data: val,
          });
        })
        .catch((err) => {
          console.log(err);
          return res.status(HTTP.SUCCESS).send({
            status: false,
            code: HTTP.BAD_REQUEST,
            message: "Unable to send email!",
            data: {},
          });
        });

      return res.status(HTTP.SUCCESS).send({
        status: true,
        code: HTTP.SUCCESS,
        message: "OTP sent successfully",
        data: update,
      });
    } else {
      return res.status(HTTP.SUCCESS).send({
        status: true,
        code: HTTP.SUCCESS,
        message: "Invalid details",
      });
    }
  } catch (error) {
    if (error) {
      return res.status(HTTP.BAD_REQUEST).send({
        status: true,
        code: HTTP.BAD_REQUEST,
        message: error,
      });
    }
  }
};

// verify OTP
const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const checkEmail = await usermodel.findOne({ email });

    if (!checkEmail) {
      return res.status(HTTP.SUCCESS).send({
        status: true,
        code: HTTP.BAD_REQUEST,
        message: "Invalid email address",
        data: {},
      });
    }

    if (checkEmail && otp.length === 4) {
      if (checkEmail.otp == otp) {
        checkEmail.verify_otp = true;
        checkEmail.save();
        return res.status(HTTP.SUCCESS).send({
          status: true,
          code: HTTP.SUCCESS,
          message: "Otp Verified.",
        });
      }
    } else {
      return res.status(HTTP.SUCCESS).send({
        status: true,
        code: HTTP.SUCCESS,
        message: "Invalid OTP",
      });
    }
  } catch (error) {
    if (error) {
      return res.status(HTTP.BAD_REQUEST).send({
        status: true,
        code: HTTP.BAD_REQUEST,
        message: error,
      });
    }
  }
};

// Registered User Login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const compare = await usermodel.findOne({ email: email });

    if (compare.verify_otp == false) {
      return res.status(HTTP.SUCCESS).send({
        status: true,
        code: HTTP.SUCCESS,
        message: "You are not verify for login because your otp not verify",
      });
    }

    bcrypt.compare(password, compare.password, (err, result) => {
      if (result == true) {
        const token = jwt.sign(
          { id: compare._id, email: compare.email },
          process.env.SECRET_KEY
        );

        const currentUserDetail = {
          id: compare._id,
          name: compare.name,
          email: compare.email,
          contact: compare.contact,
          cash_bonus: compare.cash_bonus,
          token,
        };

        return res.status(HTTP.SUCCESS).send({
          status: true,
          code: HTTP.SUCCESS,
          message: "Login successfully",
          data: currentUserDetail,
        });
      } else {
        return res.status(HTTP.SUCCESS).send({
          status: true,
          code: HTTP.SUCCESS,
          message: "Enter valid password",
        });
      }
    });
  } catch (error) {
    return res.status(HTTP.FORBIDDEN).send({
      status: true,
      code: HTTP.FORBIDDEN,
      message: "Email is not valid",
    });
  }
};

// Get all Users List
const getUser = async (req, res) => {
  try {
    new Promise(async (resolve, reject) => {
      try {
        const userData = await usermodel.find();
        resolve();
        return res.status(HTTP.SUCCESS).send({
          status: true,
          code: HTTP.SUCCESS,
          message: "User data found",
          data: userData,
        });
      } catch (error) {
        reject();
      }
    });
  } catch (error) {
    return res.status(HTTP.FORBIDDEN).send({
      status: true,
      code: HTTP.FORBIDDEN,
      message: "Data not found",
    });
  }
};

/***********************************************/
//-------------- for development only ----------/
/***********************************************/

//Decode data(only for developement)
const encodeReqData = (req, res) => {
  try {
    console.log("🚀 ~ encodeReqData ~ encodeReqData:", req.body.decData);

    if (req.body.decData) {
      return res.status(200).send({
        status: true,
        message: "encoded data",
        data: encodeData(req.body.decData),
      });
    } else {
      return res
        .status(401)
        .send({ status: false, message: "Please provide data", data: {} });
    }
  } catch (e) {
    return res.status(HTTP.SUCCESS).send({
      status: false,
      code: HTTP.INTERNAL_SERVER_ERROR,
      message: "Something went wrong!",
      data: {},
    });
  }
};

//Decode data(only for developement)
const decodeResData = (req, res) => {
  try {
    console.log("🚀 ~ decodeResData ~ req.body.encData:", req.body.encData);
    if (req.body.encData) {
      return res.send(decodeData(req.body.encData));
    } else {
      return res
        .status(401)
        .send({ status: false, message: "Please provide data", data: {} });
    }
  } catch (e) {
    return res.status(HTTP.SUCCESS).send({
      status: false,
      code: HTTP.INTERNAL_SERVER_ERROR,
      message: "Something went wrong!",
      data: {},
    });
  }
};

module.exports = {
  register,
  resendOTP,
  verifyOTP,
  login,
  getUser,
  encodeReqData,
  decodeResData,
};
