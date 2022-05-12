const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');

// Controllers
const { globalErrorHandler } = require('./controllers/errors.controller');

// Routers
const { usersRouter } = require('./routes/users.routes');
const { postsRouter } = require('./routes/posts.routes');
const { commentsRouter } = require('./routes/comments.routes');

// Init express app
const app = express();

// Enable CORS
app.use(cors()); // permite la conexcion entre servidor-client

// Enable incoming JSON data
app.use(express.json());

// Add security headers
app.use(helmet()); // seguridad para los headers de la app

// Compress responses
app.use(compression()); // comprime la res del servidor al cliente (reduce su tamaño en datos para mejorar la velocidad de res)

// Log incoming requests
if (process.env.NODE_ENV === 'development')
  app.use(morgan('dev')); //en desarrollo
else app.use(morgan('combined')); //en produccion

// Limit IP requests
const limiter = rateLimit({
  max: 10000,
  windowMs: 1 * 60 * 60 * 1000, // 1 hr
  message: 'Too many requests from this IP',
});

app.use(limiter);

// Endpoints
app.use('/api/v1/users', usersRouter);
app.use('/api/v1/posts', postsRouter);
app.use('/api/v1/comments', commentsRouter);

// Global error handler
app.use('*', globalErrorHandler);

module.exports = { app };
