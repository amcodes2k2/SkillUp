const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
    pgTransactionId: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    paymentMode: {
        type: String,
        required: true
    },
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    },
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "course",
        required: true
    },
    date: {
        type: Date,
        required: true,
        default: Date.now()
    },
    status: {
        type: String,
        enum: ["PENDING", "FAILED", "COMPLETED"],
        required: true
    }
});

module.exports = mongoose.model("transaction", transactionSchema);