const express = require('express');
const router = express.Router();

const teacherController = require('../../controllers/teacher');

router.post('/register', teacherController.register_post);
router.post('/login', teacherController.login_post);

module.exports = router;
