const mongoose = require("mongoose");
const quizModel = require("../models/quiz.js");

async function getQuiz(req, res)
{
    try
    {
        const {quiz_id} = req.params;

        if(!mongoose.Types.ObjectId.isValid(quiz_id))
        {
            return res.status(404).json({
                success: false,
                message: "Quiz not found."
            });
        }

        if(req?.questions)
        {
            return res.status(200).json({
                success: true,
                questions: req.questions.questions,
                message: "Questions have been returned."
            });
        }

        const questions = await quizModel.findOne({_id: quiz_id}, {questions: 1}).
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

        res.status(200).json({
            success: true,
            questions: questions.questions,
            message: "Questions have been returned."
        });
    }
    catch(error)
    {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

module.exports = getQuiz;