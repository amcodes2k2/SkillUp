const express = require("express");
const router = express.Router();

const replyModel = require("../models/reply.js");
const commentModel = require("../models/comment.js");
const discussionModel = require("../models/discussion.js");

const verifyJWT = require("../middlewares/verifyJWT.js");

const postDiscussion = require("../controllers/postDiscussion.js");
router.post("/discussion", verifyJWT, postDiscussion);

const getDiscussions = require("../controllers/getDiscussions.js");
router.get("/discussions", getDiscussions);

const postComment = require("../controllers/postComment.js");
router.post("/discussion-comment", verifyJWT, postComment);

const postReply = require("../controllers/postReply.js");
router.post("/discussion-comment-reply", verifyJWT, postReply);

module.exports = router;
