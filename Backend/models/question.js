const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
    question: {
        type: String,
        trim: true,
        required: true
    },
    correctAnswer: {
        type: String,
        trim: true,
        required: true
    },
    options:  [{
        type: String,
        trim: true,
        required: true
    }]
});

module.exports = mongoose.model("question", questionSchema);