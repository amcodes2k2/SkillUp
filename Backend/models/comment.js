const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
    content: {
        type: String,
        trim: true,
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    },
    publishedOn: {
        type: Date,
        required: true,
        default: Date.now()
    },
    replies: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "reply"
    }]
});

module.exports = mongoose.model("comment", commentSchema);