const mongoose = require("mongoose");

const quizSchema = new mongoose.Schema({
    title: {
        type: String,
        trim: true,
        required: true
    },
    description: {
        type: String,
        trim: true,
        required: true
    },
    questions: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "question",
        required: true
    }],
    quizType: {
        type: String,
        enum: ["general", "sectional"],
        required: true
    }
});

module.exports = mongoose.model("quiz", quizSchema);