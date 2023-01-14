import express from 'express';
const app = express();
import dotenv from 'dotenv';
dotenv.config();

import connectDB from './db/connect.js';

// make sure to use .js extension to be able to use module for ESModule
// middleware
import notFoundMiddleware from './middleware/not-found.js';
import errorHandlerMiddleware from './middleware/error-handler.js';

app.get('/', (req, res) => {
  throw new Error('error');
  res.send('welcome');
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
