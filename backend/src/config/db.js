const mongoose = require('mongoose');
const dns = require('dns');

// Configure Node.js to use Google DNS servers for robust SRV lookup
// try {
//   dns.setServers(['8.8.8.8', '8.8.4.4']);
// } catch (dnsErr) {
//   // Silent fallback if custom DNS setting is restricted
// }


let mongod = null;

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

const connectDB = async () => {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/behencode';
    cached.promise = (async () => {
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
        return conn;
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
          return conn;
        } catch (fallbackError) {
          console.error('\n====================================================================');
          console.error('❌ DATABASE CONNECTION ERROR');
          console.error('====================================================================');
          console.error(fallbackError.stack || fallbackError);
          console.error('====================================================================\n');
          cached.promise = null; // Reset promise on fatal error
          process.exit(1);
        }
      }
    })();
  } else {
    console.log('⏳ MongoDB connection is in progress, waiting for it to complete...');
  }

  try {
    cached.conn = await cached.promise;
  } catch (error) {
    cached.promise = null;
    throw error;
  }

  return cached.conn;
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
