const app = require('../backend/src/app');
const connectDB = require('../backend/src/config/db');
const seedData = require('../backend/src/config/seed');

let isInitialized = false;

const initializeApp = async () => {
  if (!isInitialized) {
    try {
      await connectDB();
      await seedData();
      isInitialized = true;
      console.log('[OK]: Database connected and seeded');
    } catch (error) {
      console.error('[ERROR]: Initialization failed:', error.message);
    }
  }
};

// Vercel serverless handler
module.exports = async (req, res) => {
  await initializeApp();
  app(req, res);
};
