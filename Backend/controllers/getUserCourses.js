const transaction = require("../models/transaction.js");
const userModel = require("../models/user.js");

async function getUserCourses(req, res)
{
    try
    {
        const user = req.user;

        const userDocument = await userModel.findOne({_id: user._id}).
        populate({
            path: "courses",
            select: "-transactions",
            populate: {
                path: "author",
                select: "name"
            }
        }).
        populate({
            path: "transactions",
            select: "-_id pgTransactionId paymentMode date course"
        });

        const courses = userDocument.courses.map(function(course){
            course = course.toJSON();
            const transactions = userDocument.transactions.filter(function(transaction){
                return transaction.course.equals(course._id);
            });

            if(transactions.length > 0)
                course.transaction = transactions[0];
            
            return course;
        });

        return res.status(200).json({
            success: true,
            courses: courses,
            message: "Courses with corresponding transaction details have been returned."
        });
    }
    catch(error)
    {
        console.log(error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

module.exports = getUserCourses;