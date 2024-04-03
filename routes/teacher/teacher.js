const express = require('express');
const router = express.Router();

router.get('/register', (req, res) => res.render("teacher/register"));
router.get('/login', (req, res) => res.render("teacher/login"));


module.exports = router;
