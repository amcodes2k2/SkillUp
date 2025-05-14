const mongoose = require("mongoose");

const sectionSchema = new mongoose.Schema({
    title: {
        type: String,
        trim: true,
        required: true
    },
    lectures: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "lecture",
        required: true
    }],
    quiz: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "quiz"
    }
});

module.exports = mongoose.model("section", sectionSchema);