const mongoose = require("mongoose");

const userModel = require("../models/user.js");
const commentModel = require("../models/comment.js");
const lectureModel = require("../models/lecture.js");
const discussionModel = require("../models/discussion.js");

async function postComment(req, res)
{
    try
    {
        const user = req.user;
        const lecture = req?.lecture;
        let {content, discussion_id} = req.body;

        console.log(content);
        console.log(discussion_id);

        content = content.trim();
        if(content === "")
        {
            return res.status(400).json({
                success: false,
                message: "Comment cannot be empty."
            });
        }

        if(!lecture)
        {
            if(!discussion_id || !mongoose.Types.ObjectId.isValid(discussion_id))
            {
                return res.status(404).json({
                    success: false,
                    message: "Discussion not found."
                });
            }

            const discussionDocument = await discussionModel.findOne({_id: discussion_id});

            if(!discussionDocument)
            {
                return res.status(404).json({
                    success: false,
                    message: "Discussion not found."
                });
            }
        }

        const commentDocument = await commentModel.create({
            content: content,
            user: user._id
        });

        await userModel.findOneAndUpdate({_id: user._id}, {$push: {comments: commentDocument._id}});

        if(lecture)
            await lectureModel.findOneAndUpdate({_id: lecture._id}, {$push: {comments: commentDocument._id}});
        else
            await discussionModel.findOneAndUpdate({_id: discussion_id}, {$push: {comments: commentDocument._id}});

        res.status(201).json({
            success: true,
            message: "Comment created successfully."
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

module.exports = postComment;
