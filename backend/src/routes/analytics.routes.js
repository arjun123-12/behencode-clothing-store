const express = require('express');
const analyticsController = require('../controllers/analytics/analyticsController');
const { protect } = require('../middleware/auth');
const admin = require('../middleware/admin');

const router = express.Router();

router.get('/overview', protect, admin, analyticsController.getOverview);

module.exports = router;
