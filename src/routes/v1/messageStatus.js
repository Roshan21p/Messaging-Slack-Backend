import express from 'express';

import {
  markMessageReadController,
  messageStatusController
} from '../../controllers/messageStatusController.js';
import { isAuthenticated } from '../../middlewares/authMiddleware.js';

const router = express.Router();

router.get(
  '/unreadMessageCount/:workspaceId',
  isAuthenticated,
  messageStatusController
);

router.patch('/readMessage', isAuthenticated, markMessageReadController);

export default router;
