const reviewModel = require("../models/review.js");

async function getReviews(req, res)
{
    try
    {
        const reviews = await reviewModel.find({}).limit(3).
        populate({
            path: "user",
            select: "name"
        }).
        populate({
            path: "course",
            select: "title"
        });

        res.status(200).json({
            success: true,
            reviews: reviews,
            message: "Reviews have been returned."
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

module.exports = getReviews;