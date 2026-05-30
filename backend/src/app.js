const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');

// Modular Route Handlers
const authRoutes = require('./routes/auth.routes');
const productRoutes = require('./routes/product.routes');
const categoryRoutes = require('./routes/category.routes');
const orderRoutes = require('./routes/order.routes');
const reviewRoutes = require('./routes/review.routes');
const analyticsRoutes = require('./routes/analytics.routes');

// Legacy Contact message route (fully preserved)
const contactRoutes = require('./routes/contactRoutes');

// Global Middlewares
const errorHandler = require('./middleware/errorHandler');
const ApiError = require('./utils/ApiError');

const app = express();

// Security Headers
app.use(helmet({
  crossOriginResourcePolicy: false, // Allow frontend image loaders
}));

// CORS Configuration
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Rate Limiting
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 mins
  max: 200,
  message: { success: false, message: 'Too many requests from this IP, please try again after 15 minutes' },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api', apiLimiter);

// Serve static uploaded media files
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Register Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/analytics', analyticsRoutes);

// Register Legacy Routes
app.use('/api/contact', contactRoutes);

// Root Endpoint
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Behencode Repository-Service-Controller API Server v2.0' });
});

// 404 Route handler
app.use((req, res, next) => {
  next(new ApiError(404, 'Endpoint not found'));
});

// Register Centralized operational Error Interceptor catcher
app.use(errorHandler);

module.exports = app;
