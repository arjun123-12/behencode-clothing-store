const Message = require('../../models/Message');
const ApiResponse = require('../../utils/ApiResponse');
const ApiError = require('../../utils/ApiError');

// @desc    Send contact inquiry
exports.sendMessage = async (req, res, next) => {
  try {
    const { name, email, subject, message } = req.body;
    if (!name || !email || !subject || !message) {
      throw new ApiError(400, 'Please provide all message attributes');
    }

    const newMessage = await Message.create({ name, email, subject, message });
    res.status(201).json(new ApiResponse(201, newMessage, 'Message sent successfully'));
  } catch (error) {
    next(error);
  }
};

// @desc    Get all messages (Admin)
exports.getMessages = async (req, res, next) => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 });
    res.status(200).json(new ApiResponse(200, { count: messages.length, messages }, 'Support messages retrieved'));
  } catch (error) {
    next(error);
  }
};

// @desc    Delete message (Admin)
exports.deleteMessage = async (req, res, next) => {
  try {
    const message = await Message.findById(req.params.id);
    if (!message) {
      throw new ApiError(404, 'Message not found');
    }
    await Message.findByIdAndDelete(req.params.id);
    res.status(200).json(new ApiResponse(200, null, 'Message removed successfully'));
  } catch (error) {
    next(error);
  }
};
