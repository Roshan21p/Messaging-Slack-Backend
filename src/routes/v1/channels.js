import express from 'express';

import { getChannelByIdController } from '../../controllers/channelController.js';
import { isAuthenticated } from '../../middlewares/authMiddleware.js';

const router = express.Router();

/**
 * @swagger
 * /channels/{channelId}:
 *   get:
 *     summary: Get channel by ID
 *     description: Retrieves the details of a specific channel. Requires authentication via x-access-token.
 *     tags: [Channels]
 *     security:
 *       - AccessTokenAuth: []
 *     parameters:
 *       - in: path
 *         name: channelId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the channel to retrieve
 *     responses:
 *       200:
 *         description: Channel details retrieved successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Channel not found
 */

router.get('/:channelId', isAuthenticated, getChannelByIdController);

export default router;
