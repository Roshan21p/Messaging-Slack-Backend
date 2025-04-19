import express from 'express';

import {
  generateSignedUrl,
  getMessagesController
} from '../../controllers/messageController.js';
import { isAuthenticated } from '../../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/generate-signed-url', isAuthenticated, generateSignedUrl);

router.get('/:channelId', isAuthenticated, getMessagesController);

export default router;
