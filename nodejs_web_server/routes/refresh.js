const express = require('express');
const router = express.Router();
const refreshController = require('../controllers/refreshTokenController');
// ensure http method for refresh is get 
router.get('/', refreshController.handleRefreshToken);

module.exports = router;