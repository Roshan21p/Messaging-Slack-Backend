import express from 'express';

import {
  generateSignedUrl,
  getChannelMessagesController,
  getDMMessagesController
} from '../../controllers/messageController.js';
import { isAuthenticated } from '../../middlewares/authMiddleware.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Messages
 */

/**
 * @swagger
 * /messages/generate-signed-url:
 *   get:
 *     summary: Generate a signed Cloudinary upload URL
 *     tags: [Messages]
 *     security:
 *       - AccessTokenAuth: []
 *     responses:
 *       201:
 *         description: "Signed URL generated successfully"

 *       401:
 *         description: "Unauthorized"
 */
router.get('/generate-signed-url', isAuthenticated, generateSignedUrl);

/**
 * @swagger
 * /messages/{channelId}:
 *   get:
 *     summary: Get all messages for a specific channel
 *     tags: [Messages]
 *     security:
 *       - AccessTokenAuth: []
 *     parameters:
 *       - in: path
 *         name: channelId
 *         required: true
 *         schema:
 *           type: string
 *         description: "ID of the channel"
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: "Page number (Eg: 1)"
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: "Number of messages per page (Eg: 20)"
 *     responses:
 *       200:
 *         description: "Channel messages fetched successfully"
 *       401:
 *         description: "Unauthorized"
 *       500:
 *         description: "Internal server error"
 */
router.get('/:channelId', isAuthenticated, getChannelMessagesController);

/**
 * @swagger
 * /messages/dm/{receiverId}:
 *   get:
 *     summary: Get direct messages between the authenticated user and another user
 *     tags: [Messages]
 *     security:
 *       - AccessTokenAuth: []
 *     parameters:
 *       - in: path
 *         name: receiverId
 *         required: true
 *         schema:
 *           type: string
 *         description: "User ID of the receiver"
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: "Page number (Eg: 1)"
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: "Number of messages per page (Eg: 20)"
 *     responses:
 *       200:
 *         description: "DM messages fetched successfully"
 *       401:
 *         description: "Unauthorized"
 *       500:
 *         description: "Internal server error"
 */
router.get('/dm/:receiverId', isAuthenticated, getDMMessagesController);

export default router;
