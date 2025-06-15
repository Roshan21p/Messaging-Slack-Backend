import { StatusCodes } from 'http-status-codes';

import {
  getUnreadMessageCount,
  markMessagesAsRead
} from '../services/messageStatusService.js';
import {
  customErrorResponse,
  internalErrorResponse,
  successResponse
} from '../utils/common/responseObjects.js';

export const messageStatusController = async (req, res) => {
  try {
    const userId = req.user;
    const workspaceId = req.params.workspaceId;

    const response = await getUnreadMessageCount(userId, workspaceId);

    return res
      .status(StatusCodes.OK)
      .json(
        successResponse(response, 'Unread message count fetched successfully')
      );
  } catch (error) {
    console.log('Message status controller error', error);

    if (error.statusCode) {
      return res.status(error.statusCode).json(customErrorResponse(error));
    }

    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(internalErrorResponse(error));
  }
};

export const markMessageReadController = async (req, res) => {
  try {
    const { workspaceId, channelId } = req.body;
    const userId = req.user;

    const response = await markMessagesAsRead({
      userId,
      workspaceId,
      channelId
    });

    return res
      .status(StatusCodes.OK)
      .json(successResponse(response, 'Marked messages as read'));
  } catch (error) {
    console.log('Mark read controller error:', error);

    if (error.statusCode) {
      return res.status(error.statusCode).json(customErrorResponse(error));
    }
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(internalErrorResponse(error));
  }
};
