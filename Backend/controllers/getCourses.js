const mongoose = require("mongoose");
const courseModel = require("../models/course.js");

async function getCourses(req, res)
{
    try
    {
        const {category_id} = req.params;

        if(!mongoose.Types.ObjectId.isValid(category_id))
        {
            return res.status(404).json({
                success: false,
                message: "No courses found."
            });
        }

        const courses = await courseModel.find({category: category_id}, {transactions: 0}).
        populate({
            path: "author", select: "name"
        });

        if(!courses || courses.length === 0)
        {
            return res.status(404).json({
                success: false,
                message: "No courses found."
            });
        }

        res.status(200).json({
            success: true,
            courses: courses,
            message: "Courses have been returned."
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

module.exports = getCourses;