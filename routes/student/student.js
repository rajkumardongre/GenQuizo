const express = require('express');
const router = express.Router();

router.get('/register', (req, res) => res.render("student/register"));
router.get('/login', (req, res) => res.render("student/login"));

module.exports = router;
