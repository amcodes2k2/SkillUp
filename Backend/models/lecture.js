const mongoose = require("mongoose");

const lectureSchema = new mongoose.Schema({
    title: {
        type: String,
        trim: true,
        required: true
    },
    videoFile: {
        type: String,
        required: true
    },
    duration: {
        type: String,
        required: true
    },
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "comment"
    }]
});

module.exports = mongoose.model("lecture", lectureSchema);