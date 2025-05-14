const fs = require('fs-extra');
const path = require("node:path");
const mongoose = require("mongoose");

const categoryModel = require("../models/category.js");

async function verifyCourseDetails(req, res, next)
{
    try
    {
        const user = req.user;
        let {title, description, category, level, language, price, objectives, section_titles} = req.body;

        if(user.role !== "instructor")
        {
            return res.status(400).json({
                success: false,
                message: "You must be an instructor to create a course."
            });
        }

        title = title.trim();
        level = level.trim();
        category = category.trim();
        language = language.trim();
        price = Number(price.trim());
        description = description.trim();
        objectives = objectives.map(function(objective){
            return objective.trim();
        });
        section_titles = section_titles.map(function(title){
            return title.trim();
        });

        if(title === "" || 
            price < 100 ||
            price > 5000 ||
            description === "" ||
            objectives.length < 1 ||
            objectives.length > 4 ||
            section_titles.length < 1 ||
            section_titles.length > 6 ||
            !req.files.thumbnail ||
            req.files.thumbnail.size > 2097152 ||
            ["English", "Hindi"].includes(language) === false ||
            objectives.filter((obj) => {return (obj === "")}).length > 0 ||
            ["Beginner", "Intermediate", "Advanced"].includes(level) ===  false ||
            ["Python", "C++", "Java", "JavaScript"].includes(category) === false ||
            section_titles.filter((title) => {return (title === "")}).length > 0
        )
        {
            return res.status(400).json({
                success: false,
                message: "Invalid or incomplete course details."
            });
        }

        const thumbnailPath = path.join(__dirname, "..\\tempFileUploads/") + Date.now() + "." + req.files.thumbnail.name.split(".").at(-1);
        await req.files.thumbnail.mv(thumbnailPath);

        const sections = [];
        for(let i = 0; i < section_titles.length; i++)
        {
            if(section_titles[i].trim() === "" || 
                req.body[`sections[${i}].lecture_titles`].length < 1 ||
                req.body[`sections[${i}].lecture_titles`].length > 2
            )
            {
                fs.emptyDirSync(path.join(__dirname, "..\\tempFileUploads/"));

                return res.status(400).json({
                    success: false,
                    message: "Invalid or incomplete course details."
                });
            }

            const lectures = [];
            for(let j = 0; j < req.body[`sections[${i}].lecture_titles`].length; j++)
            {
                const title = req.body[`sections[${i}].lecture_titles`][j].trim();
                const videoFile = req.files[`sections[${i}].lecture_videoFiles`][j];

                if(title === "" || !videoFile || videoFile.size > 2097152)
                {
                    fs.emptyDirSync(path.join(__dirname, "..\\tempFileUploads/"));

                    return res.status(400).json({
                        success: false,
                        message: "Invalid or incomplete course details."
                    });
                }

                const videoPath = path.join(__dirname, "..\\tempFileUploads/") + Date.now() + "." + videoFile.name.split(".").at(-1);
                await videoFile.mv(videoPath);

                lectures.push({
                    title: title,
                    videoFile: videoPath
                });
            }

            const quiz_title = req.body[`section_quiz_titles[${i}]`];

            const questions = [];
            for(let j = 0; j < req.body[`sections[${i}].quiz_questions`].length; j++)
            {
                if(quiz_title.trim() === "")
                    break;

                const question = req.body[`sections[${i}].quiz_questions`][j].trim();
                const correctAnswer = req.body[`sections[${i}].quiz_questions_correct_answers`][j].trim();
                const options = req.body[`sections[${i}].quiz_question[${j}].options`].map(function(option){
                    return option.trim();
                });

                if(question === "" ||
                    options.length != 4 ||
                    options.filter((opt) => {return (opt === "")}).length > 0 ||
                    options.filter((opt) => {return (opt === correctAnswer)}).length != 1
                )
                {
                    fs.emptyDirSync(path.join(__dirname, "..\\tempFileUploads/"));

                    return res.status(400).json({
                        success: false,
                        message: "Invalid or incomplete course details."
                    });
                }

                questions.push({
                    question: question,
                    options: options,
                    correctAnswer: correctAnswer
                });
            }

            if(quiz_title.trim() === "")
            {
                sections.push({
                    title: section_titles[i].trim(),
                    lectures: lectures
                });
            }
            else
            {
                sections.push({
                    title: section_titles[i].trim(),
                    lectures: lectures,
                    quiz: {
                        title: quiz_title,
                        questions: questions
                    }
                });
            }
        }

        const categoryID = await categoryModel.findOne({title: category}, {_id: 1});
        
        const course = {
            title: title,
            description: description,
            author: user._id,
            price: price,
            thumbnail: thumbnailPath,
            language: language,
            category: new mongoose.Types.ObjectId(categoryID._id),
            level: level.toLowerCase(),
            objectives: objectives,
            sections: sections
        };

        req.course = course;
        next();
    }
    catch(error)
    {
        fs.emptyDirSync(path.join(__dirname, "..\\tempFileUploads/"));
        console.log(error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

module.exports = verifyCourseDetails;