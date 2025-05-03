import cors from 'cors';
import express from 'express';
import { createServer } from 'http';
import { StatusCodes } from 'http-status-codes';
import morgan from 'morgan';
import { Server } from 'socket.io';

import bullServerAdapter from './config/bullBoardConfig.js';
import connectDB from './config/dbConfig.js';
import { FRONTEND_URL, PORT } from './config/serverConfig.js';
import ChannelSocketHandlers from './controllers/channelSocketController.js';
import MessageSocketHandlers from './controllers/messageSocketController.js';
import UserActivitySocketHandlers from './controllers/userActivitySocketHandlers.js';
import apiRouter from './routes/apiRoutes.js';

const app = express();
const server = createServer(app);

const io = new Server(server, {
  cors: {
    origin: '*'
  }
});

app.use(
  cors({
    origin: FRONTEND_URL,
    credentials: true
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(morgan('dev'));

app.use('/ui', bullServerAdapter.getRouter());

app.use('/api', apiRouter);

app.get('/ping', (req, res) => {
  return res.status(StatusCodes.OK).json({ message: 'pong' });
});

io.on('connection', (socket) => {
  console.log('a user connected', socket.id);

  // setTimeout(() => {
  //   socket.emit("message","This is a message from the server");
  // },3000)

  // socket.on('messageFromClient', (data) => {
  //   console.log('Message from client', data);

  //   io.emit('new message', data.toUpperCase());
  // });
  UserActivitySocketHandlers(io, socket);
  MessageSocketHandlers(io, socket);
  ChannelSocketHandlers(io, socket);

  
});

// socket.io and express server both listen on 'server' instead of 'app'
// because both need to run on the same HTTP server instance. This allows
// socket.io to share the HTTP server with the Express app, enabling real-time
// communication and API handling through a single server.

server.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);
  await connectDB();
});
