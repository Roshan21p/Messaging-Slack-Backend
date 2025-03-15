import express from 'express';

import { getChannelByIdController } from '../../controllers/channelController.js';
import { isAuthenticated } from '../../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/:channelId', isAuthenticated, getChannelByIdController);

export default router;
