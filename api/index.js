const app = require('../backend/src/app');
const connectDB = require('../backend/src/config/db');
const seedData = require('../backend/src/config/seed');

let dbConnected = false;

const initializeApp = async () => {
  if (!dbConnected) {
    try {
      await connectDB();
      await seedData();
      dbConnected = true;
      console.log('[OK]: Database connected and seeded');
    } catch (error) {
      console.error('[ERROR]: Database initialization failed:', error.message);
    }
  }
};

export default async (req, res) => {
  await initializeApp();
  app(req, res);
};
