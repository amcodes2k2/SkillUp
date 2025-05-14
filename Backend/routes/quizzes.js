const express = require("express");
const router = express.Router();

const quizModel = require("../models/quiz.js");
const questionModel = require("../models/question.js");

const verifyJWT = require("../middlewares/verifyJWT.js");

const getQuizzes = require("../controllers/getQuizzes.js");
router.get("/quizzes/:category_id", getQuizzes);

const getQuiz = require("../controllers/getQuiz.js");
const hasQuizAccess = require("../middlewares/hasQuizAccess.js");

router.get("/general-quiz/:quiz_id", verifyJWT, getQuiz);
router.get("/section-quiz/:quiz_id", verifyJWT, hasQuizAccess, getQuiz);

module.exports = router;