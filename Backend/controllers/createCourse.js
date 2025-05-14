const fs = require('fs-extra');
const path = require("node:path");
const mongoose = require("mongoose");
const cloudinary = require("cloudinary");

const userModel = require("../models/user.js");
const quizModel = require("../models/quiz.js");
const courseModel = require("../models/course.js");
const sectionModel = require("../models/section.js");
const lectureModel = require("../models/lecture.js");
const questionModel = require("../models/question.js");
const categoryModel = require("../models/category.js");

async function createCourse(req, res)
{
    try
    {   
        const user = req.user;
        const course = req.course;

        for(let i = 0; i < course.sections.length; i++)
        {
            for(let j = 0; j < course.sections[i].lectures.length; j++)
            {
                const response = await cloudinary.v2.uploader.upload(course.sections[i].lectures[j].videoFile, {resource_type: "auto"});
                
                let hr, min, sec;
                let duration = response.duration;
                
                hr = duration / 3600;
                duration = duration % 3600;

                min = duration / 60;
                duration = duration % 60;

                sec = duration;

                duration = (hr > 0) ? Math.round(hr) + "h " : "";
                duration = (min > 0) ? Math.round(min) + "m " : "";
                duration = (sec > 0) ? Math.round(sec) + "s " : "";

                const lectureDocument = await lectureModel.create({
                    title: course.sections[i].lectures[j].title,
                    videoFile: response.url,
                    duration: duration
                });

                course.sections[i].lectures[j] = lectureDocument._id;
                await userModel.findOneAndUpdate({_id: user._id}, {$push: {lectures: lectureDocument._id}});
            }

            if(course.sections[i]?.quiz)
            {
                const questions = [];

                for(let j = 0; j < course.sections[i].quiz.questions.length; j++)
                {
                    const questionDocument = await questionModel.create({
                        question: course.sections[i].quiz.questions[j].question,
                        correctAnswer: course.sections[i].quiz.questions[j].correctAnswer,
                        options: course.sections[i].quiz.questions[j].options
                    });

                    questions.push(questionDocument._id);
                }

                const quizDocument = await quizModel.create({
                    title: course.sections[i].quiz.title,
                    description: course.sections[i].quiz.title,
                    questions: questions,
                    quizType: "sectional"
                });

                course.sections[i].quiz = quizDocument._id;
                await userModel.findOneAndUpdate({_id: user._id}, {$push: {quizzes: quizDocument._id}});
            }

            const sectionDocument = await sectionModel.create(course.sections[i]);
            course.sections[i] = sectionDocument._id;
        }
        
        const response = await cloudinary.v2.uploader.upload(course.thumbnail, {width: 1024, height: 1024, resource_type: "auto"});
        course.thumbnail = response.url;

        const courseDocument = await courseModel.create(course);
        await userModel.findOneAndUpdate({_id: user._id}, {$push: {courses: courseDocument._id}});
        await categoryModel.findOneAndUpdate({_id: course.category}, {$push: {courses: courseDocument._id}});

        fs.emptyDirSync(path.join(__dirname, "..\\tempFileUploads/"));

        res.status(201).json({
            success: true,
            message: "Course created successfully."
        });
    }
    catch(error)
    {
        fs.emptyDirSync(path.join(__dirname, "..\\tempFileUploads/"));
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

module.exports = createCourse;