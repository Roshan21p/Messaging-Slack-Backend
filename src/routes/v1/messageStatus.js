import express from 'express';

import {
  markDmMessagesAsReadController,
  markMessageReadController,
  messageStatusController,
  messageStatusDMController
} from '../../controllers/messageStatusController.js';
import { isAuthenticated } from '../../middlewares/authMiddleware.js';

const router = express.Router();

// Get unread channel message count in a workspace
router.get(
  '/channel/unread-count/:workspaceId',
  isAuthenticated,
  messageStatusController
);

// Get unread DM message count
router.get('/dm/unread-count', isAuthenticated, messageStatusDMController);

// Mark a channel message as read
router.patch('/channel/mark-read', isAuthenticated, markMessageReadController);

// Mark all DM messages in a room as read
router.patch('/dm/mark-read', isAuthenticated, markDmMessagesAsReadController);

export default router;
