import express from 'express';

import { isMemberPartOfWokspaceController } from '../../controllers/memberController.js';
import { isAuthenticated } from '../../middlewares/authMiddleware.js';

const router = express.Router();

router.get(
  '/workspace/:workspaceId',
  isAuthenticated,
  isMemberPartOfWokspaceController
);

export default router;
