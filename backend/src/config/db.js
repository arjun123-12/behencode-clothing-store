const mongoose = require('mongoose');
const dns = require('dns');

// Configure Node.js to use Google DNS servers for robust SRV lookup
try {
  dns.setServers(['8.8.8.8', '8.8.4.4']);
} catch (dnsErr) {
  // Silent fallback if custom DNS setting is restricted
}

let mongod = null;

const connectDB = async () => {
  const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/behencode';
  try {
    console.log(`[Connecting to Cluster0] Attempting to connect to MongoDB at: ${uri}`);
    // Use a shorter timeout for local instances to fall back faster if offline
    const isLocal = uri.includes('127.0.0.1') || uri.includes('localhost');
    const timeout = isLocal ? 3000 : 10000;

    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: timeout,
      connectTimeoutMS: timeout,
      family: 4,
      tls: uri.startsWith('mongodb+srv://'),
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`\n⚠️ Connection to MongoDB failed:`, error.stack || error);
    console.log('🤖 Falling back to automatic in-memory MongoDB (mongodb-memory-server)...');

    try {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      mongod = await MongoMemoryServer.create();
      const memoryUri = mongod.getUri();
      console.log(`🌱 Started In-Memory MongoDB Server at: ${memoryUri}`);

      const conn = await mongoose.connect(memoryUri, {
        serverSelectionTimeoutMS: 5000,
        connectTimeoutMS: 5000,
        family: 4,
      });
      console.log(`MongoDB Connected (In-Memory): ${conn.connection.host}`);
    } catch (fallbackError) {
      console.error('\n====================================================================');
      console.error('❌ DATABASE CONNECTION ERROR');
      console.error('====================================================================');
      console.error(fallbackError.stack || fallbackError);
      console.error('====================================================================\n');
      process.exit(1);
    }
  }
};

// Cleanup on exit
process.on('SIGINT', async () => {
  if (mongod) {
    await mongoose.disconnect();
    await mongod.stop();
  }
  process.exit(0);
});

module.exports = connectDB;
