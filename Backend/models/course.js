const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
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
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        reuired: true
    },
    price: {
        type: Number,
        required: true
    },
    thumbnail: {
        type: String,
        required: true
    },
    language: {
        type: String,
        trim: true,
        required: true
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "category",
        required: true
    },
    publishedOn: {
        type: Date,
        required: true,
        default: Date.now()
    },
    level: {
        type: String,
        enum: ["beginner", "intermediate", "advanced"],
        required: true
    },
    objectives: [{
        type: String,
        trim: true,
        required: true
    }],
    sections: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "section",
        required: true
    }],
    reviews: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "review"
    }],
    transactions: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "transaction"
    }]
});

module.exports = mongoose.model("course", courseSchema);