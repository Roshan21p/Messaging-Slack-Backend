import { StatusCodes } from 'http-status-codes';

import channelRepository from '../repositories/channelRepository.js';
import messageRepository from '../repositories/messageRepository.js';
import userRepository from '../repositories/userRepository.js';
import ClientError from '../utils/errors/clientError.js';
import { isUserMemberOfWorkspace } from './workspaceService.js';

export const getChannelMessagesService = async (
  messageParams,
  page,
  limit,
  userId
) => {
  try {
    const channelDetails =
      await channelRepository.getChannelWithWorkspaceDetails(
        messageParams.channelId
      );

    if (!channelDetails) {
      throw new ClientError({
        explanation: `Channel with ID: ${messageParams.channelId} does not exist or has been deleted.`,
        message: 'Channel Not found',
        statusCode: StatusCodes.NOT_FOUND
      });
    }
    const workspace = channelDetails.workspaceId;

    const isMember = isUserMemberOfWorkspace(workspace, userId);

    if (!isMember) {
      throw new ClientError({
        explanation: 'User is not a member of the workspace',
        message: 'User is not a member of the workspace',
        statusCode: StatusCodes.UNAUTHORIZED
      });
    }

    const messages = await messageRepository.getPaginatedMessaged(
      messageParams,
      page,
      limit
    );

    if (!messages || messages.length === 0) {
      throw new ClientError({
        explanation: `No messages found for channel ID: ${messageParams.channelId}. The channel might be empty or not exist.`,
        message: 'No messages available',
        statusCode: StatusCodes.NOT_FOUND
      });
    }
    return messages;
  } catch (error) {
    console.log('Error in getMessagesService:', error);
    throw error;
  }
};

export const getDMMessagesService = async (roomId, receiverId, page, limit) => {
  try {
    const user = await userRepository.getById(receiverId);

    if (!user) {
      throw new ClientError({
        explanation: 'The requested user does not exist in the database.',
        message: `User is not found `,
        statusCode: StatusCodes.NOT_FOUND
      });
    }

    const messages = await messageRepository.getPaginatedMessaged(
      roomId,
      page,
      limit
    );

    if (!messages || messages.length === 0) {
      throw new ClientError({
        explanation: `No messages found for this id: ${receiverId}.`,
        message: 'No messages available',
        statusCode: StatusCodes.NOT_FOUND
      });
    }
    return messages;
  } catch (error) {
    console.log('Error in getDMMessagesService:', error);
    throw error;
  }
};

export const createMessageService = async (message) => {
  const newMessage = await messageRepository.create(message);

  const getMessageDetails = await messageRepository.getMessageDetails(
    newMessage._id
  );

  return getMessageDetails;
};
