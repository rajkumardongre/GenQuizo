const express = require('express');
const router = express.Router();

const teacherController = require('../../controllers/teacher');


router.get("/", teacherController.getMyQuiz);
router.get('/logout', teacherController.logout);
router.post("/add-quiz", teacherController.addQuiz);
router.get("/:quizId/attempt", teacherController.getStudentAttemptedQuiz);


// router.post("/add/quiz", teacherController.renderDashboard)
// router.get("/dashboard", teacherController.renderDashboard)

module.exports = router;
