const mongoose = require("mongoose");
const userModel = require("../models/user.js");
const quizModel = require("../models/quiz.js");

async function hasQuizAccess(req, res, next)
{
    try
    {
        const user = req.user;
        const {quiz_id} = req.params;

        if(!mongoose.Types.ObjectId.isValid(quiz_id))
        {
            return res.status(404).json({
                success: false,
                message: "Quiz not found."
            });
        }

        const questions = await quizModel.findOne({_id: quiz_id, quizType: "sectional"}, {questions: 1}).
        populate({
            path: "questions"
        });

        if(!questions)
        {
            return res.status(404).json({
                success: false,
                message: "Quiz not found."
            });
        }

        if(!user.quizzes.includes(quiz_id))
        {
            return res.status(401).json({
                success: false,
                message: "User does not have access to the quiz."
            });
        }

        req.questions = questions;

        next();
    }
    catch(error)
    {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

module.exports = hasQuizAccess;