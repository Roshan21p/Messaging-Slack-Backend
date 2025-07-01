import express from 'express';

import {
  addChannelToWorkspaceController,
  addMemberToWorkspaceController,
  createWorkspaceController,
  deleteChannelWorkspaceController,
  deleteWorkspaceController,
  deleteWorkspaceMemberController,
  getWorkspaceByJoinCodeController,
  getWorkspaceController,
  getWorkspacesUserIsMemberOfController,
  joinWorkspaceController,
  leaveWorkspaceController,
  resetJoinCodeController,
  updateChannelToWorkspaceController,
  updateWorkspaceController
} from '../../controllers/workspaceController.js';
import { isAuthenticated } from '../../middlewares/authMiddleware.js';
import {
  addChannelToWorkspaceSchema,
  addMemberToWorkspaceSchema,
  createWorkspaceSchema
} from '../../validators/workspaceSchema.js';
import { validate } from '../../validators/zodValidator.js';

const router = express.Router();

/**
 * @swagger
 * /workspaces:
 *   post:
 *     summary: Create a new workspace
 *     description: Create a new workspace with a name and optional description. Requires authentication via x-access-token.
 *     tags: [Workspaces]
 *     security:
 *       - AccessTokenAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name]
 *             properties:
 *               name:
 *                 type: string
 *                 example: Dev Team
 *               description:
 *                 type: string
 *                 example: Workspace for backend developers
 *     responses:
 *       201:
 *         description: Workspace created successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized (Missing or invalid token)
 */
router.post(
  '/',
  isAuthenticated,
  validate(createWorkspaceSchema),
  createWorkspaceController
);

/**
 * @swagger
 * /workspaces/{workspaceId}/leave:
 *   post:
 *     summary: Leave a workspace
 *     description: Allows an authenticated user to leave the specified workspace.
 *     tags: [Workspaces]
 *     security:
 *       - AccessTokenAuth: []
 *     parameters:
 *       - in: path
 *         name: workspaceId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the workspace to leave
 *     responses:
 *       200:
 *         description: Successfully left the workspace
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Workspace not found or user not a member
 */
router.post('/:workspaceId/leave', isAuthenticated, leaveWorkspaceController);

/**
 * @swagger
 * /workspaces/{workspaceId}:
 *   get:
 *     summary: Get a workspace by its ID
 *     description: Retrieve details of a specific workspace. Requires authentication.
 *     tags: [Workspaces]
 *     security:
 *       - AccessTokenAuth: []
 *     parameters:
 *       - in: path
 *         name: workspaceId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the workspace
 *     responses:
 *       200:
 *         description: Workspace retrieved successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Workspace not found
 */

router.get('/:workspaceId', isAuthenticated, getWorkspaceController);

/**
 * @swagger
 * /workspaces:
 *   get:
 *     summary: Get all workspaces the user is a member of
 *     description: Returns a list of workspaces where the authenticated user is a member. Requires authentication.
 *     tags: [Workspaces]
 *     security:
 *       - AccessTokenAuth: []
 *     responses:
 *       200:
 *         description: List of workspaces retrieved successfully
 *       401:
 *         description: Unauthorized
 */
router.get('/', isAuthenticated, getWorkspacesUserIsMemberOfController);

/**
 * @swagger
 * /workspaces/join/{joinCode}:
 *   get:
 *     summary: Get workspace by join code
 *     description: Retrieves workspace details using a valid join code. Requires authentication.
 *     tags: [Workspaces]
 *     security:
 *       - AccessTokenAuth: []
 *     parameters:
 *       - in: path
 *         name: joinCode
 *         required: true
 *         schema:
 *           type: string
 *         description: The join code of the workspace
 *     responses:
 *       200:
 *         description: Workspace found
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Invalid or expired join code
 */
router.get(
  '/join/:joinCode',
  isAuthenticated,
  getWorkspaceByJoinCodeController
);

/**
 * @swagger
 * /workspaces/{workspaceId}/channels:
 *   put:
 *     summary: Add a new channel to a workspace
 *     description: Adds a new channel to the specified workspace. Requires authentication.
 *     tags: [Workspaces]
 *     security:
 *       - AccessTokenAuth: []
 *     parameters:
 *       - in: path
 *         name: workspaceId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the workspace
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [channelName]
 *             properties:
 *               channelName:
 *                 type: string
 *                 example: general
 *               description:
 *                 type: string
 *                 example: Default public discussion channel
 *     responses:
 *       200:
 *         description: Channel added to workspace successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Workspace not found
 */
router.put(
  '/:workspaceId/channels',
  isAuthenticated,
  validate(addChannelToWorkspaceSchema),
  addChannelToWorkspaceController
);

/**
 * @swagger
 * /workspaces/{workspaceId}:
 *   put:
 *     summary: Update workspace details
 *     description: Updates the name or description of a workspace. Requires authentication.
 *     tags: [Workspaces]
 *     security:
 *       - AccessTokenAuth: []
 *     parameters:
 *       - in: path
 *         name: workspaceId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the workspace
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Updated Workspace Name
 *               description:
 *                 type: string
 *                 example: Updated description for the workspace
 *     responses:
 *       200:
 *         description: Workspace updated successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Workspace not found
 */
router.put('/:workspaceId', isAuthenticated, updateWorkspaceController);

/**
 * @swagger
 * /workspaces/{workspaceId}/channel/{channelId}:
 *   put:
 *     summary: Update a channel in a workspace
 *     description: Updates the details of a specific channel in the workspace. Requires authentication.
 *     tags: [Workspaces]
 *     security:
 *       - AccessTokenAuth: []
 *     parameters:
 *       - in: path
 *         name: workspaceId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the workspace
 *       - in: path
 *         name: channelId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the channel
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               channelName:
 *                 type: string
 *                 example: updated-channel-name
 *               description:
 *                 type: string
 *                 example: Updated description for the channel
 *     responses:
 *       200:
 *         description: Channel updated successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Workspace or channel not found
 */
router.put(
  '/:workspaceId/channel/:channelId',
  isAuthenticated,
  updateChannelToWorkspaceController
);

/**
 * @swagger
 * /workspaces/{workspaceId}/join:
 *   put:
 *     summary: Join a workspace
 *     description: Authenticated user joins the specified workspace using a join code.
 *     tags: [Workspaces]
 *     security:
 *       - AccessTokenAuth: []
 *     parameters:
 *       - in: path
 *         name: workspaceId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the workspace to join
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [joinCode]
 *             properties:
 *               joinCode:
 *                 type: string
 *                 example: abcd1234
 *     responses:
 *       200:
 *         description: Joined workspace successfully
 *       400:
 *         description: Invalid join code or already a member
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Workspace not found
 */
router.put('/:workspaceId/join', isAuthenticated, joinWorkspaceController);

/**
 * @swagger
 * /workspaces/{workspaceId}/members:
 *   put:
 *     summary: Add a member to the workspace
 *     description: Adds a user to the specified workspace. Requires authentication.
 *     tags: [Workspaces]
 *     security:
 *       - AccessTokenAuth: []
 *     parameters:
 *       - in: path
 *         name: workspaceId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the workspace
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [userId]
 *             properties:
 *               memberId:
 *                 type: string
 *                 example: 67d3ca52dac234874c7799c9
 *     responses:
 *       200:
 *         description: Member added successfully
 *       400:
 *         description: Validation error or already a member
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Workspace or user not found
 */
router.put(
  '/:workspaceId/members',
  isAuthenticated,
  validate(addMemberToWorkspaceSchema),
  addMemberToWorkspaceController
);

/**
 * @swagger
 * /workspaces/{workspaceId}/joinCode/reset:
 *   put:
 *     summary: Reset join code for a workspace
 *     description: Generates a new join code for the specified workspace. Requires authentication.
 *     tags: [Workspaces]
 *     security:
 *       - AccessTokenAuth: []
 *     parameters:
 *       - in: path
 *         name: workspaceId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the workspace
 *     responses:
 *       200:
 *         description: Join code reset successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Workspace not found
 */
router.put(
  '/:workspaceId/joinCode/reset',
  isAuthenticated,
  resetJoinCodeController
);

/**
 * @swagger
 * /workspaces/{workspaceId}:
 *   delete:
 *     summary: Delete a workspace
 *     description: Permanently deletes a workspace. Only accessible to workspace admins. Requires authentication.
 *     tags: [Workspaces]
 *     security:
 *       - AccessTokenAuth: []
 *     parameters:
 *       - in: path
 *         name: workspaceId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the workspace to delete
 *     responses:
 *       200:
 *         description: Workspace deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (not admin)
 *       404:
 *         description: Workspace not found
 */
router.delete('/:workspaceId', isAuthenticated, deleteWorkspaceController);

/**
 * @swagger
 * /workspaces/{workspaceId}/member/delete:
 *   delete:
 *     summary: Remove a member from the workspace
 *     description: Deletes a member from the specified workspace. Requires authentication.
 *     tags: [Workspaces]
 *     security:
 *       - AccessTokenAuth: []
 *     parameters:
 *       - in: path
 *         name: workspaceId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the workspace
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [userId]
 *             properties:
 *               memberId:
 *                 type: string
 *                 example: 65f129d84aeaf38ccbead123
 *     responses:
 *       200:
 *         description: Member removed successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (not workspace admin)
 *       404:
 *         description: Workspace or member not found
 */
router.delete(
  '/:workspaceId/member/delete',
  isAuthenticated,
  deleteWorkspaceMemberController
);

/**
 * @swagger
 * /workspaces/{workspaceId}/channel/{channelId}:
 *   delete:
 *     summary: Delete a channel from the workspace
 *     description: Deletes a specific channel from the workspace. Requires authentication.
 *     tags: [Workspaces]
 *     security:
 *       - AccessTokenAuth: []
 *     parameters:
 *       - in: path
 *         name: workspaceId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the workspace
 *       - in: path
 *         name: channelId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the channel to delete
 *     responses:
 *       200:
 *         description: Channel deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (not authorized to delete)
 *       404:
 *         description: Channel or workspace not found
 */
router.delete(
  '/:workspaceId/channel/:channelId',
  isAuthenticated,
  deleteChannelWorkspaceController
);

export default router;
