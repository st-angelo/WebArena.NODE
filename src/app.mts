import express from 'express';
import morgan from 'morgan';

const app = express();

if (process.env.ENVIRONMENT === 'development') {
  app.use(morgan('dev'));
}

app.use(express.json({ limit: '10kb' }));

export default app;
