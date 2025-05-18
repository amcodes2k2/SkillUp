const mongoose = require("mongoose");
const courseModel = require("../models/course.js");

async function getCourse(req, res)
{
    try
    {
        const {course_id} = req.params;
        
        if(!mongoose.Types.ObjectId.isValid(course_id))
        {
            return res.status(404).json({
                success: false,
                message: "Course not found."
            });
        }

        const course = await courseModel.findOne({_id: course_id}, {transactions: 0}).
        populate({
            path: "author",
            select: "_id name"
        }).
        populate({
            path: "sections",
            populate: {
                path: "lectures",
                select: "title duration"
            }
        }).
        populate({
            path: "sections",
            populate: {
                path: "quiz",
                select: "title"
            }
        }).
        populate({
            path: "reviews",
            populate: {
                path: "user",
                select: "name"
            }
        });

        if(!course)
        {
            return res.status(404).json({
                success: false,
                message: "Course not found."
            });
        }

        res.status(200).json({
            success: true,
            course: course,
            message: "Course has been returned."
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

module.exports = getCourse;