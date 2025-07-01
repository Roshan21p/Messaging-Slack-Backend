import mongoose from 'mongoose';

import { DEV_DB_URL, NODE_ENV, PROD_DB_URL } from './serverConfig.js';

const mongooseOptions = {
  connectTimeoutMS: 60000,
  serverSelectionTimeoutMS: 60000
};

export default async function connectDB() {
  try {
    const DB_URL = NODE_ENV === 'development' ? DEV_DB_URL : PROD_DB_URL;

    await mongoose.connect(DB_URL, mongooseOptions);

    console.log('Connected to MongoDB database');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error.message);
    throw error; // Important: allow the caller to handle failure (e.g., exit)
  }
}
