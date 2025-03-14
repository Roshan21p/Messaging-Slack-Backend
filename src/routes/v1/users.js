import express from 'express';

import { signUp } from '../../controllers/userContoller.js';
import { validate } from '../../validators/zodValidator.js';
import { userSignUpSchema } from '../../validators/userSchema.js';


const router = express.Router();

router.post('/signup', validate(userSignUpSchema), signUp);

export default router;
