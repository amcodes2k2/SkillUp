require("dotenv").config();
const pg_sdk_node = require("pg-sdk-node");

const userModel = require("../models/user.js");
const courseModel = require("../models/course.js");
const transactionModel = require("../models/transaction.js");

async function checkPaymentStatusAndUpdate(req, res)
{
    try
    {
        const user_id = req.params.user_id;
        const course_id = req.params.course_id;
        const merchantOrderId = req.params.merchantOrderId;

        if(!merchantOrderId)
            return res.redirect(`${process.env.FRONTEND_BASE_URL}/course/${course_id}`);

        const userDocument = await userModel.findOne({_id: user_id});

        if(!userDocument)
            return res.redirect(`${process.env.FRONTEND_BASE_URL}/course/${course_id}`);

        const courseDocument = await courseModel.findOne({_id: course_id})
        .populate({
            path: "sections",
            populate: {
                path: "lectures",
                select: "_id"
            }
        }).
        populate({
            path: "sections",
            populate: {
                path: "quiz",
                select: "_id"
            }
        });

        if(!courseDocument)
            return res.redirect(`${process.env.FRONTEND_BASE_URL}/course/${course_id}`);

        const clientId = process.env.CLIENT_ID;
        const clientSecret = process.env.CLIENT_SECRET;
        const clientVersion = process.env.CLIENT_VERSION;    
        const env = pg_sdk_node.Env.SANDBOX;

        const client = pg_sdk_node.StandardCheckoutClient.getInstance(clientId, clientSecret, clientVersion, env);

        const response = await client.getOrderStatus(merchantOrderId);
        const transactions = response.paymentDetails.map(function(transaction){
            return {
                pgTransactionId: transaction.transactionId,
                amount: transaction.amount / 100,
                paymentMode: transaction.paymentMode,
                customer: user_id,
                course: course_id,
                date: Date(transaction.timestamp),
                status: transaction.state
            };
        });
        let transactionDocuments = await transactionModel.create(transactions);

        if(response.state !== "COMPLETED")
            return res.redirect(`${process.env.FRONTEND_BASE_URL}/course/${course_id}`);
        
        if(!Array.isArray(transactionDocuments))
            transactionDocuments = [transactionDocuments];
        
        const successfulTransaction = transactionDocuments.filter(function(transaction){
            return transaction.status === "COMPLETED"
        });

        const quizzes = courseDocument.sections.filter(function(section){
            return section?.quiz;
        })
        .map(function(section){
            return section.quiz._id
        });

        const lectures = courseDocument.sections.map(function(section){
            return section.lectures;
        }).flat();

        await courseModel.findOneAndUpdate({_id: course_id}, {$addToSet: {customers: user_id}});
        await courseModel.findOneAndUpdate({_id: course_id}, {$addToSet: {transactions: successfulTransaction[0]._id}});
        
        await userModel.findOneAndUpdate({_id: user_id}, {$addToSet: {courses: course_id}});
        await userModel.findOneAndUpdate({_id: user_id}, {$addToSet: {quizzes: {$each: quizzes}}});
        await userModel.findOneAndUpdate({_id: user_id}, {$addToSet: {lectures: {$each: lectures}}});
        await userModel.findOneAndUpdate({_id: user_id}, {$addToSet: {transactions: successfulTransaction[0]._id}});
        
        return res.redirect(`${process.env.FRONTEND_BASE_URL}/course/${course_id}`);
    }
    catch(error)
    {
        console.log(error);
        return res.redirect(`${process.env.FRONTEND_BASE_URL}/course/${req.params.course_id}`);
    }
}

module.exports = checkPaymentStatusAndUpdate;