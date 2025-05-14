const userModel = require("../models/user.js");

async function getEarnings(req, res)
{
    try
    {
        const user = req.user;

        if(user.role !== "instructor")
        {
            return res.status(400).json({
                success: false,
                message: "User does not have the instructor role."
            });
        }

        const userDocument = await userModel.findOne({_id: user._id}).
        populate({
            path: "courses",
            populate: {
                path: "author",
                select: "name"
            }
        }).populate({
            path: "courses",
            populate: {
                path: "transactions",
                select: "-_id date"
            }
        });

        let monthlyEarnings = 0;
        let lifetimeEarnings = 0;

        const courses = userDocument.courses.filter(function(course){
            return course.author._id.equals(user._id);
        }).map(function(course){
            course = course.toJSON();

            course.lifetimeSales = course.transactions.length;
            course.monthlySales = course.transactions.filter(function(transaction){
                return(
                    transaction.date.getMonth() === new Date().getMonth() &&
                    transaction.date.getFullYear() === new Date().getFullYear()
                );
            }).length;

            monthlyEarnings = monthlyEarnings + Math.round(0.8 * course.monthlySales * course.price);
            lifetimeEarnings = lifetimeEarnings + Math.round(0.8 * course.lifetimeSales * course.price);

            return course;
        });

        return res.status(200).json({
            success: true,
            courses: courses,
            monthlyEarnings: monthlyEarnings,
            lifetimeEarnings: lifetimeEarnings,
            message: "Earnings have been returned."
        });
    }
    catch(error)
    {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

module.exports = getEarnings;