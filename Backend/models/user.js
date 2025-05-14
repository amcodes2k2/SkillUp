const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true
    },
    email: {
        type: String,
        trim: true,
        required: true
    },
    password: {
        type: String,
        trim: true,
        required: true
    },
    role: {
        type: String,
        enum: ["student", "instructor"],
        required: true
    },
    refreshToken: {
        type: String
    },
    courses: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "course"
    }],
    lectures: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "lecture"
    }],
    quizzes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "quiz"
    }],
    discussions: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "discussion"
    }],
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "comment"
    }],
    replies: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "reply"
    }],
    transactions: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "transaction"
    }],
    OTP: {
        type: String
    },
    OTPExpiry: {
        type: Date
    },
    isVerified: {
        type: Boolean,
        default: false,
        required: true
    },
    resetPasswordToken: {
        type: String
    },
    resetPasswordTokenExpiry: {
        type: Date
    }
});

module.exports = mongoose.model("user", userSchema);