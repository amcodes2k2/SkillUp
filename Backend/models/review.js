const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "course",
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    },
    description: {
        type: String,
        trim: true,
        required: true
    },
    reviewedOn: {
        type: Date,
        required: true,
        default: Date.now()
    }
});

module.exports = mongoose.model("review", reviewSchema);