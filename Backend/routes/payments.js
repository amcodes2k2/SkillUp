const express = require("express");
const router = express.Router();

const verifyJWT = require("../middlewares/verifyJWT.js");

const initiatePayment = require("../controllers/initiatePayment.js");
router.post("/initiate-payment", verifyJWT, initiatePayment);

const checkPaymentStatusAndUpdate = require("../controllers/checkPaymentStatusAndUpdate.js");
router.get("/check-payment-status-and-update/:merchantOrderId/:user_id/:course_id", checkPaymentStatusAndUpdate);

module.exports = router;