const express = require("express");
const router = express.Router();

const usercontroller = require("../controller/user-controller");

const { authuser } = require("../authentication/auth");

router.post("/register", usercontroller.register); //register
router.post("/login", usercontroller.login); //login
router.post("/verifyOTP", usercontroller.verifyOTP); // VerifyOTP
router.post("/resendOTP", usercontroller.resendOTP); // .resendOTP
router.get("/getUser", usercontroller.getUser); // getUser

module.exports = router;
