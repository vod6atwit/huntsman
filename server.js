import 'express-async-errors';
import morgan from 'morgan';

import express from 'express';
const app = express();

import dotenv from 'dotenv';
dotenv.config();

import { dirname } from 'path';
import { fileURLToPath } from 'url';
import path from 'path';

// make sure to use .js extension to be able to use module for ESModule
// databse
import connectDB from './db/connect.js';

//router
import authRouter from './routes/authRoutes.js';
import jobsRouter from './routes/jobsRoutes.js';

// middleware
import notFoundMiddleware from './middleware/not-found.js';
import errorHandlerMiddleware from './middleware/error-handler.js';
import authorizationUser from './middleware/auth.js';
import { dir } from 'console';

if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// body parser, reading data from body(incoming request) into req.body(in controller)
app.use(express.json());

// app.get('/', (req, res) => {
//   // throw new Error('error');
//   res.send('welcome');
// });

// app.get('/api/v1', (req, res) => {
//   // throw new Error('error');
//   res.json({ msg: 'API' });
// });

// serve static files for backend
// serve as public access
const __dirname = dirname(fileURLToPath(import.meta.url));
app.use(express.static(path.resolve(__dirname, './client/build')));

// ROUTES
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/jobs', authorizationUser, jobsRouter);

// access to this route for frontend after trying access to 2 routes above
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '.client/build', 'index.html'));
});

// only run this line if app not find any routes from above
app.use(notFoundMiddleware);

// only run this line if getting errors inside the app routes
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 5555;
const start = async () => {
  try {
    await connectDB(
      process.env.MONGO_URL.replace(
        '<password>',
        process.env.MONGO_URL_PASSWORD
      )
    );
    app.listen(port, () => {
      console.log(`server listening on ${port}`);
    });
  } catch (error) {}
};

start();
