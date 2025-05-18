const express = require("express");
const router = express.Router();

const replyModel = require("../models/reply.js");
const courseModel = require("../models/course.js");
const reviewModel = require("../models/review.js");
const commentModel = require("../models/comment.js");
const lectureModel = require("../models/lecture.js");
const sectionModel = require("../models/section.js");

const getCourses = require("../controllers/getCourses.js");
router.get("/courses/:category_id", getCourses);

const getCourse = require("../controllers/getCourse.js");
router.get("/course/:course_id", getCourse);

const getReviews = require("../controllers/getReviews.js");
router.get("/reviews", getReviews);

const verifyJWT = require("../middlewares/verifyJWT.js");
const hasCourseAccess = require("../middlewares/hasCourseAccess.js");
const hasLectureAccess = require("../middlewares/hasLectureAccess.js");

const getLecture = require("../controllers/getLecture.js");
router.get("/lecture/:lecture_id", verifyJWT, hasLectureAccess, getLecture);

const postComment = require("../controllers/postComment.js");
router.post("/lecture-comment/:lecture_id", verifyJWT, hasLectureAccess, postComment);

const postReply = require("../controllers/postReply.js");
router.post("/lecture-comment-reply/:lecture_id/:comment_id", verifyJWT, hasLectureAccess, postReply);

const postReview = require("../controllers/postReview.js");
router.post("/post-review/:course_id", verifyJWT, hasCourseAccess, postReview);

const createCourse = require("../controllers/createCourse.js");
const verifyCourseDetails = require("../middlewares/verifyCourseDetails.js");

router.post("/create-course", verifyJWT, verifyCourseDetails, createCourse);

module.exports = router;