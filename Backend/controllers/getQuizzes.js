const mongoose = require("mongoose");
const categoryModel = require("../models/category.js");

async function getQuizzes(req, res)
{
    try
    {
        const {category_id} = req.params;

        if(!mongoose.Types.ObjectId.isValid(category_id))
        {
            return res.status(404).json({
                success: false,
                message: "No quizzes found."
            });
        }

        const quizzes = await categoryModel.findOne({_id: category_id}, {quizzes: 1}).
        populate({
           path: "quizzes"
        });

        if(!quizzes || quizzes.quizzes.length === 0)
        {
            return res.status(404).json({
                success: false,
                message: "No quizzes found."
            });
        }

        return res.status(200).json({
            success: true,
            quizzes: quizzes.quizzes,
            message: "Quizzes have been returned."
        });
    }
    catch(error)
    {
        res.status(500).json({
            success: true,
            message: error.message
        });
    }
}

module.exports = getQuizzes;