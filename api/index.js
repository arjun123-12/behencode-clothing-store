const app = require('../backend/src/app');
const connectDB = require('../backend/src/config/db');
const seedData = require('../backend/src/config/seed');

let cachedInit = global.appInitialization;

if (!cachedInit) {
  cachedInit = global.appInitialization = { promise: null };
}

const initializeApp = async () => {
  if (!cachedInit.promise) {
    cachedInit.promise = (async () => {
      try {
        await connectDB();
        await seedData();
        console.log('[OK]: Database connected and seeded');
      } catch (error) {
        console.error('[ERROR]: Initialization failed:', error.message);
        cachedInit.promise = null; // Reset promise on failure
        throw error;
      }
    })();
  }
  return cachedInit.promise;
};

// Vercel serverless handler
module.exports = async (req, res) => {
  try {
    await initializeApp();
  } catch (error) {
    res.status(500).json({ error: 'Database initialization failed: ' + error.message });
    return;
  }
  app(req, res);
};
