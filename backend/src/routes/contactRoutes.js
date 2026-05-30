const express = require('express');
const router = express.Router();
const { sendMessage, getMessages, deleteMessage } = require('../controllers/messages/messageController');
const { protect } = require('../middleware/auth');
const admin = require('../middleware/admin');

// Public contact submission
router.post('/', sendMessage);

// Protected inbox admin routes
router.get('/', protect, admin, getMessages);
router.delete('/:id', protect, admin, deleteMessage);

module.exports = router;
