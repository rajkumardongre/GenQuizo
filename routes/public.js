const express = require('express');
const router = express.Router();


router.get('/', (req, res) => res.render("home"));
router.get('/auth', (req, res) => res.render("auth"));

module.exports = router;
