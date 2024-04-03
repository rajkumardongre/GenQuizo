const express = require('express');
const router = express.Router();

router.get("/", (req, res) => res.render("teacher/dashboard"));
router.get("/add-quiz", (req, res) => res.render("teacher/addQuiz"));
router.get("/:quizId/attempt", (req, res) => res.render("teacher/attempt"));


module.exports = router;
