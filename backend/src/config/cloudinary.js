const env = require('./env');

// Standard Cloudinary config stub loader (for future expansion)
const cloudinaryConfig = {
  cloudName: env.CLOUDINARY_CLOUD_NAME,
  apiKey: env.CLOUDINARY_API_KEY,
  apiSecret: env.CLOUDINARY_API_SECRET,
  isEnabled: !!(env.CLOUDINARY_CLOUD_NAME && env.CLOUDINARY_API_KEY && env.CLOUDINARY_API_SECRET),
};

module.exports = cloudinaryConfig;
