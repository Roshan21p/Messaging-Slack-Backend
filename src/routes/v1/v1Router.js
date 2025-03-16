import express from 'express';

import channelRouter from './channels.js';
import memberRouter from './members.js';
import messageRouter from './messages.js';
import userRouter from './users.js';
import workspaceRouter from './workspaces.js';

const router = express.Router();

router.use('/users', userRouter);

router.use('/workspaces', workspaceRouter);

router.use('/channels', channelRouter);

router.use('/members', memberRouter);

router.use('/messages', messageRouter);

export default router;
