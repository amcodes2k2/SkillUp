const userModel = require("../models/user.js");
const lectureModel = require("../models/lecture.js");
const discussionModel = require("../models/discussion.js");

async function postDiscussion(req, res)
{
    try
    {
        const user = req.user;
        let {title, description} = req.body;

        title = title.trim();
        description = description.trim();

        if(title === "" || description === "")
        {
            return res.status(400).json({
                success: false,
                message: "All fields must be filled."
            });
        }

        const discussionDocument = await discussionModel.create({
            title: title,
            description: description,
            user: user._id
        });

        await userModel.findOneAndUpdate({_id: user._id}, {$push: {discussions: discussionDocument._id}});

        res.status(201).json({
            success: true,
            message: "Discussion has been posted."
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

module.exports = postDiscussion;