const mongoose = require("mongoose");

const userModel = require("../models/user.js");
const replyModel = require("../models/reply.js");
const commentModel = require("../models/comment.js");

async function postReply(req, res)
{
    try
    {
        const user = req.user;
        let {content, comment_id} = req.body;

        if(!comment_id || !mongoose.Types.ObjectId.isValid(comment_id))
        {
            return res.status(404).json({
                success: false,
                message: "Comment not found."
            });
        }

        const commentDocument = await commentModel.findOne({_id: comment_id});

        if(!commentDocument)
        {
            return res.status(404).json({
                success: false,
                message: "Comment not found."
            });
        }

        content = content.trim();
        if(content === "")
        {
            return res.status(400).json({
                success: false,
                message: "Reply cannot be empty."
            });
        }

        const replyDocument = await replyModel.create({
            content: content,
            user: user._id
        });

        await userModel.findOneAndUpdate({_id: user._id}, {$push: {replies: replyDocument._id}});
        await commentModel.findOneAndUpdate({_id: comment_id}, {$push: {replies: replyDocument._id}});

        res.status(201).json({
            success: true,
            message: "Reply created successfully."
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

module.exports = postReply;
