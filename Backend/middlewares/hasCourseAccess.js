const mongoose = require("mongoose");
const courseModel = require("../models/course.js");

async function hasCourseAccess(req, res, next)
{
    try
    {
        const user = req.user;
        const course_id = req.params.course_id;

        if(!mongoose.Types.ObjectId.isValid(course_id))
        {
            return res.status(404).json({
                success: false,
                message: "Course not found."
            });
        }

        const courseDocument = await courseModel.findOne({_id: course_id});

        if(!courseDocument)
        {
            return res.status(404).json({
                success: false,
                message: "Course not found."
            });
        }

        if(!user.courses.includes(course_id))
        {
            return res.status(401).json({
                success: false,
                message: "You do not have access to the course."
            });
        }

        req.course = courseDocument;

        next();
    }
    catch(error)
    {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

module.exports = hasCourseAccess;