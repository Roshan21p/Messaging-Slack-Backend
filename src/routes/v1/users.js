import express from 'express';

import {
  fetchAllUsersController,
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

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Endpoints related to user registration, login, and retrieval
 */

/**
 * @swagger
 * /users/signup:
 *   post:
 *     summary: Register a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [username, email, password]
 *             properties:
 *               username:
 *                 type: string
 *                 example: roshan21
 *               email:
 *                 type: string
 *                 format: email
 *                 example: roshan12345@gmail.com
 *               password:
 *                 type: string
 *                 example: 123456
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Validation error
 */

router.post('/signup', validate(userSignUpSchema), signUp);

/**
 * @swagger
 * /users/signin:
 *   post:
 *     summary: User login
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: roshan@gmail.com
 *               password:
 *                 type: string
 *                 example: 123456
 *     responses:
 *       200:
 *         description: Login successful
 *       400:
 *         description: Invalid credentials
 */

router.post('/signin', validate(userSignInSchema), signIn);

/**
 * @swagger
 * /users/username/{id}/{username}:
 *   get:
 *     summary: Get user by ID and username
 *     description: Requires token in Authorization header.
 *     tags: [Users]
 *     security:
 *       - AccessTokenAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *       - in: path
 *         name: username
 *         required: true
 *         schema:
 *           type: string
 *         description: Username
 *     responses:
 *       200:
 *         description: User found
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 */
router.get(
  '/username/:id/:username',
  isAuthenticated,
  getUserByUsernameController
);

router.get(
  '/username/:id/:username',
  isAuthenticated,
  getUserByUsernameController
);

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Fetch all users
 *     description: Returns a list of all users. Requires token in Authorization header.
 *     tags: [Users]
 *     security:
 *       - AccessTokenAuth: []
 *     responses:
 *       200:
 *         description: List of users retrieved successfully
 *       401:
 *         description: Unauthorized
 */

router.get('/', isAuthenticated, fetchAllUsersController);

export default router;
