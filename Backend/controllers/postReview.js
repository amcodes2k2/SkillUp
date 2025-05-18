const courseModel = require("../models/course.js");
const reviewModel = require("../models/review.js");

async function postReview(req, res)
{
    try
    {
        const user = req.user;
        let {content} = req.body;
        const course = req.course;

        content = content.trim();
        if(content === "")
        {
            return res.status(400).json({
                success: false,
                message: "Review cannot be empty."
            });
        }

        const courseReviews = await reviewModel.find({course: course._id}, {_id: 0, user: 1});
        
        const hasReviewed = courseReviews.filter(function(review){
            if(review.user.equals(user._id) === true)
                return review;
        });

        if(hasReviewed.length === 1)
        {
            return res.status(400).json({
                success: false,
                message: "You have already reviewed the course."
            });
        }

        const reviewDocument = await reviewModel.create({
            course: course._id,
            user: user._id,
            description: content
        });

        await courseModel.findOneAndUpdate({_id: course._id}, {$push: {reviews: reviewDocument._id}});

        return res.status(201).json({
            success: true,
            message: "Review posted successfully."
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

module.exports = postReview;