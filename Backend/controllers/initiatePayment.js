require("dotenv").config();
const crypto = require("crypto");
const pg_sdk_node = require("pg-sdk-node");

const courseModel = require("../models/course.js");

async function initiatePayment(req, res)
{
    try
    {
        const user = req.user;
        const {course_id} = req.body;

        const courseDocument = await courseModel.findOne({_id: course_id}, {_id: 1, price: 1});

        if(!courseDocument)
        {
            return res.status(404).json({
                success: false,
                message: "Course not found."
            });
        }

        if(user.courses.includes(course_id) === true)
        {
            return res.status(400).json({
                success: false,
                message: "User has already bought the course."
            });
        }

        const clientId = process.env.CLIENT_ID;
        const clientSecret = process.env.CLIENT_SECRET;
        const clientVersion = process.env.CLIENT_VERSION;    
        const env = pg_sdk_node.Env.SANDBOX;

        const client = pg_sdk_node.StandardCheckoutClient.getInstance(clientId, clientSecret, clientVersion, env);

        const merchantOrderId = crypto.randomUUID();
        const amount = courseDocument.price * 100;
        const redirectUrl = `http://localhost:4000/api/v1/check-payment-status-and-update/${merchantOrderId}/${user._id}/${course_id}`;
        const metaInfo = pg_sdk_node.MetaInfo.builder()
        .udf1("udf1")
        .udf2("udf2")
        .build();

        const request = pg_sdk_node.StandardCheckoutPayRequest.builder()
        .merchantOrderId(merchantOrderId)
        .amount(amount)
        .redirectUrl(redirectUrl)
        .metaInfo(metaInfo)
        .build();

        const response = await client.pay(request);

        if(!response || response.state !== "PENDING" || !response.orderId)
        {
            return res.status(502).json({
                success: false,
                message: "Failed to initate the payment."
            });
        }

        return res.status(201).json({
            success: true,
            checkoutPageUrl: response.redirectUrl,
            message: "Payment was initiated successfully."
        });
    }
    catch(error)
    {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

module.exports = initiatePayment;