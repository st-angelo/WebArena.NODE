import express from 'express';
import mongoSanitize from 'express-mongo-sanitize';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import hpp from 'hpp';
import morgan from 'morgan';
import xss from 'xss-clean';
import { __dirname } from './utils/common.mjs';

const app = express();

// Set security HTTP headers
app.use(helmet());

// Logging
app.use(morgan('combined'));

// Limit requests from the same API
app.use(
  '/api',
  rateLimit({
    max: 100,
    windowMs: 60 * 60 * 1000,
    message: 'Too many requests from this IP, please try again in an hour!',
  })
);

// Body parser, reading body into req.body
app.use(express.json({ limit: '10kb' }));

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

// Prevent parameter pollution (multiple params with the same name)
app.use(hpp());

// Serving static files
app.use(express.static(`${__dirname}/public`));

export default app;
