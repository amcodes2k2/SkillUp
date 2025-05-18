const mongoose = require("mongoose");

const replySchema = new mongoose.Schema({
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
    }
});

module.exports = mongoose.model("reply", replySchema);