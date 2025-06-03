import express from 'express';

import {
  getUserByUsernameController,
  signIn,
  signUp
} from '../../controllers/userContoller.js';
import { isAuthenticated } from '../../middlewares/authMiddleware.js';
import {
  userSignInSchema,
  userSignUpSchema
} from '../../validators/userSchema.js';
import { validate } from '../../validators/zodValidator.js';

const router = express.Router();

router.post('/signup', validate(userSignUpSchema), signUp);
router.post('/signin', validate(userSignInSchema), signIn);
router.get(
  '/username/:id/:username',
  isAuthenticated,
  getUserByUsernameController
);

export default router;
