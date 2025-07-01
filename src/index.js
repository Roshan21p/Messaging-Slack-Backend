import cors from 'cors';
import express from 'express';
import { createServer } from 'http';
import { StatusCodes } from 'http-status-codes';
import morgan from 'morgan';
import { Server } from 'socket.io';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

import bullServerAdapter from './config/bullBoardConfig.js';
import connectDB from './config/dbConfig.js';
import { FRONTEND_URL, PORT } from './config/serverConfig.js';
import ChannelSocketHandlers from './controllers/channelSocketController.js';
import DmSocketHandlers from './controllers/dmSocketController.js';
import MessageSocketHandlers from './controllers/messageSocketController.js';
import UserActivitySocketHandlers from './controllers/userActivitySocketHandlers.js';
import apiRouter from './routes/apiRoutes.js';
import { options } from './utils/common/swaggerOptions.js';

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

const swaggerDocs = swaggerJSDoc(options);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use('/ui', bullServerAdapter.getRouter());

app.use('/api', apiRouter);

app.get('/ping', (req, res) => {
  return res.status(StatusCodes.OK).json({ message: 'pong' });
});

io.on('connection', (socket) => {
  const userId = socket.handshake?.auth?.userId;

  if (!socket.id || !userId) {
    console.log('Socket Id is missing therefore conection cannot establish');
    return;
  }
  socket.join(userId);
  console.log('a user connected', socket.id, userId);

  ChannelSocketHandlers(io, socket);
  DmSocketHandlers(io, socket);
  UserActivitySocketHandlers(io, socket);
  MessageSocketHandlers(io, socket);

  socket.on('JoinWorkspace', ({ workspaceId }, cb) => {
    if (workspaceId) {
      socket.join(workspaceId);
      console.log(`User joined workspace_${workspaceId}_${socket.id}`);
      cb?.({
        success: true,
        data: workspaceId,
        message: 'Workspace joined successfully'
      });
    }
  });

  socket.on('LeaveWorkspace', ({ workspaceId }) => {
    if (workspaceId) {
      socket.leave(workspaceId);
      console.log(`User left workspace_${workspaceId}_${socket.id}`);
    }
  });

  socket.on('disconnect', (reason) => {
    console.log(
      `User disconnected: ${userId}, socketId: ${socket.id}, reason: ${reason}`
    );
  });
});

// socket.io and express server both listen on 'server' instead of 'app'
// because both need to run on the same HTTP server instance. This allows
// socket.io to share the HTTP server with the Express app, enabling real-time
// communication and API handling through a single server.
app.get('/connect-db', async (req, res) => {
  try {
    await connectDB();
    return res
      .status(StatusCodes.OK)
      .json({ message: 'Connected to MongoDB successfully' });
  } catch (error) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: 'Failed to connect to MongoDB', error: error.message });
  }
});

server.listen(PORT, async () => {
  try {
    await connectDB(); // 👈 if this fails, it throws, and server won't start
    console.log(`Server is running on port ${PORT}`);
  } catch (err) {
    console.error('Failed to start server due to DB error:', err.message);
    process.exit(1); // Exit process
  }
});