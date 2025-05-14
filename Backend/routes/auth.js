const express = require("express");
const router = express.Router();

const verifyJWT = require("../middlewares/verifyJWT.js");

const signup = require("../controllers/signup.js");
router.post("/signup", signup);

const sendOTP = require("../controllers/sendOTP.js");
router.post("/send-OTP", sendOTP);

const verifyOTP = require("../controllers/verifyOTP.js");
router.post("/verify-OTP", verifyOTP);

const login = require("../controllers/login.js");
router.post("/login", login);

const refreshAccessToken = require("../controllers/refreshAccessToken.js");
router.get("/refresh-access-token", refreshAccessToken);

const logout = require("../controllers/logout.js");
router.get("/logout", verifyJWT, logout);

const resetPassword = require("../controllers/resetPassword.js");
router.post("/reset-password", resetPassword);

const getUserCourses = require("../controllers/getUserCourses.js");
router.get("/get-user-courses", verifyJWT, getUserCourses);

const getEarnings = require("../controllers/getEarnings.js");
router.get("/get-earnings", verifyJWT, getEarnings);

module.exports = router;