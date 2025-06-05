import express from 'express';

import {
  generateSignedUrl,
  getChannelMessagesController,
  getDMMessagesController
} from '../../controllers/messageController.js';
import { isAuthenticated } from '../../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/generate-signed-url', isAuthenticated, generateSignedUrl);

router.get('/:channelId', isAuthenticated, getChannelMessagesController);

router.get('/dm/:receiverId', isAuthenticated, getDMMessagesController);

export default router;
