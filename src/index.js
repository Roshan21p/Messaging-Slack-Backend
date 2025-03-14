import express from 'express';
import { StatusCodes } from 'http-status-codes';

import { PORT } from './config/serverConfig.js';


const app = express();

app.get('/ping', (req, res) => {
  return res.status(StatusCodes.OK).json({ message: 'pong' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
