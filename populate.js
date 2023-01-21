import { readFile } from 'fs/promises';

import dotenv from 'dotenv';
dotenv.config();

import connectDB from './db/connect.js';
import Job from './models/jobs.js';

const start = async () => {
  try {
    // connect to the database
    await connectDB(
      process.env.MONGO_URL.replace(
        '<password>',
        process.env.MONGO_URL_PASSWORD
      )
    );

    // delete existing Jobs in the database
    await Job.deleteMany();

    // read json file
    const jsonProducts = JSON.parse(
      await readFile(new URL('./mock-data.json', import.meta.url))
    );

    // create new jobs in the database
    await Job.create(jsonProducts);
    console.log('Success!!!');
    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

start();
