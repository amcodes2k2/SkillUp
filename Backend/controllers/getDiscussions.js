const discussionModel = require("../models/discussion.js");
const { populate } = require("../models/user.js");

async function getDiscussions(req, res)
{
    try
    {
        const discussions = await discussionModel.find({}).
        populate({
            path: "user",
            select: "name"
        }).
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

        if(!discussions || discussions.length === 0)
        {
            return res.status(404).json({
                success: false,
                message: "No discussion found."
            });
        }

        res.status(200).json({
            success: true,
            discussions: discussions,
            message: "Discussions have been returned."
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

module.exports = getDiscussions;