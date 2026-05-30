const env = require('./config/env');
const app = require('./app');
const connectDB = require('./config/db');
const seedData = require('./config/seed');

const PORT = env.PORT || 5000;

const startServer = async () => {
  try {
    // Connect to database (with local in-memory fallback)
    await connectDB();

    // Seed default credentials and products
    await seedData();

    // Start listening on port
    app.listen(PORT, () => {
      console.log(`[OK]: Express RSC API server running on port ${PORT}`);
      console.log(`[OK]: Developer preview enabled on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error(`[CRITICAL]: Server startup failed: ${error.message}`);
    process.exit(1);
  }
};

startServer();
