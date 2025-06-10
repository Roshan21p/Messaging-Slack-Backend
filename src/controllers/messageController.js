import { StatusCodes } from 'http-status-codes';

import cloudinary from '../config/cloudinaryConfig.js';
import { CLOUDINARY_API_SECRET } from '../config/serverConfig.js';
import {
  getChannelMessagesService,
  getDMMessagesService
} from '../services/messageService.js';
import {
  customErrorResponse,
  internalErrorResponse,
  successResponse
} from '../utils/common/responseObjects.js';

export const getChannelMessagesController = async (req, res) => {
  try {
    const messages = await getChannelMessagesService(
      { channelId: req.params.channelId },
      req.query.page || 1,
      req.query.limit || 100,
      req.user
    );
    return res
      .status(StatusCodes.OK)
      .json(successResponse(messages, 'Messages fetched successfully'));
  } catch (error) {
    console.log('Messages controller error', error);

    if (error.statusCode) {
      return res.status(error.statusCode).json(customErrorResponse(error));
    }

    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(internalErrorResponse(error));
  }
};

export const generateSignedUrl = async (req, res) => {
  try {
    const timestamp = Math.round(new Date().getTime() / 1000);

    // Generate signature
    const signature = cloudinary.v2.utils.api_sign_request(
      { timestamp },
      CLOUDINARY_API_SECRET
    );

    console.log('signature', signature, timestamp);

    return res
      .status(StatusCodes.CREATED)
      .json(
        successResponse(
          { signature, timestamp },
          'Generated Signed URL successfully'
        )
      );
  } catch (error) {
    console.log('Messages controller error', error);

    if (error.statusCode) {
      return res.status(error.statusCode).json(customErrorResponse(error));
    }

    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(internalErrorResponse(error));
  }
};

export const getDMMessagesController = async (req, res) => {
  try {
    const senderId = req.user; // from isAuthenticated middleware
    const receiverId = req.params.receiverId;

    // Create consistent unique roomId (e.g., lexicographically sorted)
    const roomId = [senderId, receiverId].sort().join('_');

    const messages = await getDMMessagesService(
      { roomId },
      receiverId,
      req.query.page || 1,
      req.query.limit || 20
    );
    return res
      .status(StatusCodes.OK)
      .json(successResponse(messages, 'Messages fetched successfully'));
  } catch (error) {
    console.log('Messages controller error', error);

    if (error.statusCode) {
      return res.status(error.statusCode).json(customErrorResponse(error));
    }

    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(internalErrorResponse(error));
  }
};
