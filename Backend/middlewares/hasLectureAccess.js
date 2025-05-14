const mongoose = require("mongoose");
const lectureModel = require("../models/lecture.js");

async function hasLectureAccess(req, res, next)
{
    try
    {
        const user = req.user;
        const lecture_id = req.params.lecture_id;

        if(!mongoose.Types.ObjectId.isValid(lecture_id))
        {
            return res.status(404).json({
                success: false,
                message: "Lecture not found."
            });
        }

        const lecture = await lectureModel.findOne({_id: lecture_id}).
        populate({
            path: "comments",
            populate: {
                path: "user",
                select: "name"
            }
        }).
        populate({
            path: "comments",
            populate: {
                path: "replies",
                populate: {
                    path: "user",
                    select: "name"
                }
            }
        });

        if(!lecture)
        {
            return res.status(404).json({
                success: false,
                message: "Lecture not found."
            });
        }

        if(!user.lectures.includes(lecture_id))
        {
            return res.status(401).json({
                success: false,
                message: "User does not have access to the course."
            });
        }

        req.lecture = lecture;

        next();
    }
    catch(error)
    {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

module.exports = hasLectureAccess;