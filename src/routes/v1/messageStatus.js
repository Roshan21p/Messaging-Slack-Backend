import express from 'express';

import {
  markDmMessagesAsReadController,
  markMessageReadController,
  messageStatusController,
  messageStatusDMController
} from '../../controllers/messageStatusController.js';
import { isAuthenticated } from '../../middlewares/authMiddleware.js';

const router = express.Router();

/**
 * @swagger
 * /message-status/channel/unread-count/{workspaceId}:
 *   get:
 *     summary: Get unread message count for each channel in a workspace
 *     tags: [Message Status]
 *     security:
 *       - AccessTokenAuth: []
 *     parameters:
 *       - in: path
 *         name: workspaceId
 *         required: true
 *         schema:
 *           type: string
 *         description: "The ID of the workspace"
 *     responses:
 *       200:
 *         description: "Unread channel message counts fetched successfully"
 *       401:
 *         description: "Unauthorized"
 *       500:
 *         description: "Internal server error"
 */
router.get(
  '/channel/unread-count/:workspaceId',
  isAuthenticated,
  messageStatusController
);

/**
 * @swagger
 * /message-status/dm/unread-count:
 *   get:
 *     summary: Get unread direct message count for the authenticated user
 *     tags: [Message Status]
 *     security:
 *       - AccessTokenAuth: []
 *     responses:
 *       200:
 *         description: "Unread DM message count fetched successfully"
 *       401:
 *         description: "Unauthorized"
 *       500:
 *         description: "Internal server error"
 */
router.get('/dm/unread-count', isAuthenticated, messageStatusDMController);

/**
 * @swagger
 * /message-status/channel/mark-read:
 *   patch:
 *     summary: Mark channel messages as read
 *     tags: [Message Status]
 *     security:
 *       - AccessTokenAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [workspaceId, channelId]
 *             properties:
 *               workspaceId:
 *                 type: string
 *                 example: 64e8f3c13df79b89d5d12345
 *               channelId:
 *                 type: string
 *                 example: 64e8f3c13df79b89d5d67890
 *     responses:
 *       200:
 *         description: Channel messages marked as read successfully
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.patch('/channel/mark-read', isAuthenticated, markMessageReadController);

/**
 * @swagger
 * /message-status/dm/mark-read:
 *   patch:
 *     summary: Mark all DM messages in a room as read
 *     description: >
 *       Marks all direct messages in a DM room as read for the authenticated user.

 *       The `roomId` must be constructed by lexicographically sorting the two user IDs (sender and receiver),
 *       and joining them with an underscore (`_`). For example: `userA_userB`.
 *       
 *       This ensures a consistent room identifier between both users.
 *     tags: [Message Status]
 *     security:
 *       - AccessTokenAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [roomId]
 *             properties:
 *               roomId:
 *                 type: string
 *                 example: "64e8a1_userb789"
 *                 description: Unique DM room ID created by sorting sender and receiver user IDs
 *     responses:
 *       200:
 *         description: DM messages marked as read successfully
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.patch('/dm/mark-read', isAuthenticated, markDmMessagesAsReadController);

export default router;
