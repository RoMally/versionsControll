const express = require('express');
const router = express.Router();
const authController = require('../controllers/authConroller');

router.post('/', authController.handleLogin);

module.exports = router;