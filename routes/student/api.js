const express = require('express');
const router = express.Router();

const studentController = require('../../controllers/student');

router.post('/register', studentController.register_post);
router.post('/login', studentController.login_post);

module.exports = router;
