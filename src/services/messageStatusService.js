import { StatusCodes } from 'http-status-codes';

import channelRepository from '../repositories/channelRepository.js';
import workspaceRepository from '../repositories/workspaceRepository.js';
import Message from '../schema/message.js';
import MessageStatus from '../schema/messageStatus.js';
import ClientError from '../utils/errors/clientError.js';
import { isUserMemberOfWorkspace } from './workspaceService.js';

export const getUnreadMessageCount = async (userId, workspaceId) => {
  try {
    if (!workspaceId) {
      throw new ClientError({
        explanation: 'Workspace Id must me provided',
        message: 'Please provide workspaceID',
        statusCode: StatusCodes.BAD_REQUEST
      });
    }

    const workspace =
      await workspaceRepository.getWorkspaceDetailsById(workspaceId);

    if (!workspace) {
      throw new ClientError({
        explanation: 'Invalid data sent from the client',
        message: 'Workspace not found',
        statusCode: StatusCodes.NOT_FOUND
      });
    }

    let userChannelIds = [];

    userChannelIds = workspace.channels;

    const isMember = isUserMemberOfWorkspace(workspace, userId);

    if (!isMember) {
      throw new ClientError({
        explanation: 'User is not a member of the workspace',
        message: 'User is not a member of the workspace',
        statusCode: StatusCodes.UNAUTHORIZED
      });
    }

    const statuses = await MessageStatus.find({ userId });

    const statusMap = new Map(); // key = channelId , value = lastReadAt

    statuses.forEach((status) => {
      if (status.channelId) {
        const key = status.channelId.toString();
        statusMap.set(key, status.lastReadAt);
      }
    });

    const channelUnreadCounts = [];

    for (const channelId of userChannelIds) {
      const key = channelId._id.toString();
      const lastReadAt = statusMap.get(key) || new Date(0);

      const count = await Message.countDocuments({
        channelId,
        workspaceId,
        senderId: { $ne: userId }, // Exclude messages sent by the user
        createdAt: { $gt: lastReadAt }
      });
      channelUnreadCounts.push({ channelId, unreadCount: count });
    }

    return {
      channels: channelUnreadCounts
    };
  } catch (error) {
    console.log('getUnreadMessageCount service error', error);
    throw error;
  }
};

export const markMessagesAsRead = async ({
  userId,
  workspaceId,
  channelId
}) => {
  try {
    if (!workspaceId || !channelId) {
      throw new ClientError({
        explanation: 'Workspace and ChannelId  must me provided',
        message: 'Please provide workspaceID and ChannelID',
        statusCode: StatusCodes.BAD_REQUEST
      });
    }
    const workspace =
      await workspaceRepository.getWorkspaceDetailsById(workspaceId);

    if (!workspace) {
      throw new ClientError({
        explanation: 'Invalid data sent from the client',
        message: 'Workspace not found',
        statusCode: StatusCodes.NOT_FOUND
      });
    }

    const channel =
      await channelRepository.getChannelWithWorkspaceDetails(channelId);

    if (!channel) {
      throw new ClientError({
        explanation: 'Invalid data sent from the client',
        message: 'Channel not found',
        statusCode: StatusCodes.NOT_FOUND
      });
    }

    // Check if the channel actually belongs to the given workspace
    if (channel?.workspaceId?._id.toString() !== workspaceId) {
      throw new ClientError({
        explanation: 'Invalid data sent from the client',
        message: 'This channel does not belong to the specified workspace',
        statusCode: StatusCodes.FORBIDDEN
      });
    }

    const isMember = isUserMemberOfWorkspace(workspace, userId);

    if (!isMember) {
      throw new ClientError({
        explanation: 'User is not a member of the workspace',
        message: 'User is not a member of the workspace',
        statusCode: StatusCodes.UNAUTHORIZED
      });
    }

    const query = { userId, channelId, workspaceId };

    const update = {
      lastReadAt: new Date()
    };

    const options = {
      upsert: true, // Create document if it doesn't exist
      new: true // Return the new/updated document
    };

    const status = await MessageStatus.findOneAndUpdate(query, update, options);
    return status;
  } catch (error) {
    console.log('markMessagesAsRead service error', error);

    throw error;
  }
};
