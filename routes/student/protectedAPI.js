const express = require('express');
const router = express.Router();

const studentController = require('../../controllers/student');


router.get("/", studentController.getMyDashboard);
router.get('/logout', studentController.logout);
router.get("/attempt-quiz", studentController.attemptQuiz);
router.post("/submit-quiz", studentController.submitQuiz);
router.get("/:quizId", studentController.getQuizData);

module.exports = router;
