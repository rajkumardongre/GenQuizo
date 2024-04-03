const express = require('express');
const router = express.Router();

router.get("/", (req, res) => res.render("student/dashboard"));
router.get("/attempt-quiz", (req, res) => res.render("student/attemptQuiz"));
router.get("/:quizId", (req, res) => res.render("student/quiz"));

module.exports = router;
