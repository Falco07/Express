const express = require('express');
const router = express.Router();
const logoutController = require('../controllers/logoutController');
// ensure http method for refresh is get 
router.get('/', logoutController.handleLogout);

module.exports = router;