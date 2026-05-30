require('dotenv').config();

const env = {
  PORT: process.env.PORT || 5000,
  MONGO_URI: process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/behencode_db',
  JWT_SECRET: process.env.JWT_SECRET || 'behencode_developer_jwt_secret_key_12345!',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME || '',
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY || '',
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET || '',
};

// Validate critical values
if (!process.env.JWT_SECRET) {
  console.warn('[WARN]: JWT_SECRET environment variable is missing. Operating with development security keys.');
}

module.exports = env;
