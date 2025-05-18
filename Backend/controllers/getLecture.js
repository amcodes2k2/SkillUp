const lectureModel = require("../models/lecture.js");

async function getLecture(req, res)
{
    try
    {
        const lecture = req.lecture;

        res.status(200).json({
            success: true,
            lecture: lecture,
            message: "Lecture has been returned."
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

module.exports = getLecture;