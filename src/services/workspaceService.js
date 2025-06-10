import { StatusCodes } from 'http-status-codes';
import { v4 as uuidv4 } from 'uuid';

import { addEmailToMailQueue } from '../producers/mailQueueProducer.js';
import channelRepository from '../repositories/channelRepository.js';
import messageRepository from '../repositories/messageRepository.js';
import userRepository from '../repositories/userRepository.js';
import workspaceRepository from '../repositories/workspaceRepository.js';
import {
  sendChannelDeleteEmails,
  sendWorkspaceDeleteEmails,
  workspaceDeleteMail,
  workspaceJoinMail,
  workspaceMemberDeleteMail
} from '../utils/common/mailObject.js';
import ClientError from '../utils/errors/clientError.js';
import ValidationError from '../utils/errors/validationError.js';

const isUserAdminOfWorkspace = (workspace, userId) => {
  return workspace.members.find(
    (member) =>
      (member.memberId.toString() === userId ||
        member.memberId._id.toString() === userId) &&
      member.role === 'admin'
  );
};

export const isUserMemberOfWorkspace = (workspace, userId) => {
  return workspace.members.find(
    (member) => member.memberId._id.toString() === userId
  );
};

const isChannelAlreadyPartOfWorkspace = (workspace, channelName) => {
  return workspace.channels.find(
    (channel) => channel.name.toLowerCase() === channelName.toLowerCase()
  );
};

export const createWorkspaceService = async (workspaceData) => {
  try {
    const joinCode = uuidv4().substring(0, 6).toUpperCase();

    const response = await workspaceRepository.create({
      name: workspaceData.name,
      description: workspaceData.description,
      joinCode
    });

    await workspaceRepository.addMemberToWorkspace(
      response._id,
      workspaceData.owner,
      'admin'
    );

    const updatedWorkspace = await workspaceRepository.addChannelToWorkspace(
      response._id,
      'general'
    );

    return updatedWorkspace;
  } catch (error) {
    console.log('Create workspace service error', error);

    if (error.name === 'ValidationError') {
      throw new ValidationError(
        {
          error: error.errors
        },
        error.message
      );
    }

    if (error.name === 'MongoServerError' && error.code === 11000) {
      throw new ValidationError(
        {
          error: ['A workspace with same details already exists']
        },
        'A workspace with same details already exists'
      );
    }
    throw error;
  }
};

export const getWorkspacesUserIsMemberOfService = async (userId) => {
  try {
    const response =
      await workspaceRepository.fetchAllWorkspaceByMemberId(userId);
    return response;
  } catch (error) {
    console.log('Get workspaces user is member of service error', error);
    throw error;
  }
};

export const deleteWorkspaceService = async (workspaceId, userId) => {
  try {
    const workspace =
      await workspaceRepository.getWorkspaceDetailsById(workspaceId);

    if (!workspace) {
      throw new ClientError({
        explanation: 'Invalid data sent from the client',
        message: 'Workspace not found',
        statusCode: StatusCodes.NOT_FOUND
      });
    }

    const isAllowed = isUserAdminOfWorkspace(workspace, userId);

    if (!isAllowed) {
      throw new ClientError({
        explanation:
          'User is either not a memeber or an admin of the workspace',
        message: 'User is not allowed to delete the workspace',
        statusCode: StatusCodes.UNAUTHORIZED
      });
    }

    const channelIds = workspace.channels;
    await channelRepository.deleteMany({ _id: { $in: channelIds } });

    const res = await messageRepository.deleteMany({ workspaceId });

    console.log(res);

    const response = await workspaceRepository.delete(workspaceId);

    await sendWorkspaceDeleteEmails(workspace);

    return response;
  } catch (error) {
    console.log('Delete workspace service error', error);
    throw error;
  }
};

export const getWorkspaceService = async (workspaceId, userId) => {
  try {
    const workspace =
      await workspaceRepository.getWorkspaceDetailsById(workspaceId);

    if (!workspace) {
      throw new ClientError({
        explanation: 'Invalid data sent from the client',
        message: 'Workspace not found',
        statusCode: StatusCodes.NOT_FOUND
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

    return workspace;
  } catch (error) {
    console.log('Get workspace service error', error);
    throw error;
  }
};

export const getWorkspaceByJoinCodeService = async (joinCode, userId) => {
  try {
    const workspace =
      await workspaceRepository.getWorkspaceByJoinCode(joinCode);

    if (!workspace) {
      throw new ClientError({
        explanation: 'Invalid data sent from the client',
        message: 'Workspace not found',
        statusCode: StatusCodes.NOT_FOUND
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
    return workspace;
  } catch (error) {
    console.log('Get workspace by join code service error', error);
    throw error;
  }
};

export const updateWorkspaceService = async (
  workspaceId,
  workspaceData,
  userId
) => {
  try {
    const workspace = await workspaceRepository.getById(workspaceId);

    if (!workspace) {
      throw new ClientError({
        explanation: 'Invalid data sent from the client',
        message: 'Workspace not found',
        statusCode: StatusCodes.NOT_FOUND
      });
    }

    const isAdmin = isUserAdminOfWorkspace(workspace, userId);
    if (!isAdmin) {
      throw new ClientError({
        explanation: 'User is not an admin of the workspace',
        message: 'User is not an admin of the workspace',
        statusCode: StatusCodes.UNAUTHORIZED
      });
    }

    const updatedWorkspace = await workspaceRepository.update(
      workspaceId,
      workspaceData
    );

    return updatedWorkspace;
  } catch (error) {
    console.log('update workspace service error', error);
    throw error;
  }
};

export const resetWorkspaceJoinCodeService = async (workspaceId, userId) => {
  try {
    const newJoinCode = uuidv4().substring(0, 6).toUpperCase();
    const updatedWorkspace = await updateWorkspaceService(
      workspaceId,
      { joinCode: newJoinCode },
      userId
    );
    return updatedWorkspace;
  } catch (error) {
    console.log('reset Workspace JoinCode Service error', error);
    throw error;
  }
};

export const addMemberToWorkspaceService = async (
  workspaceId,
  memberId,
  role,
  userId
) => {
  try {
    const workspace = await workspaceRepository.getById(workspaceId);

    if (!workspace) {
      throw new ClientError({
        explanation: 'Invalid data sent from the client',
        message: 'Workspace not found',
        statusCode: StatusCodes.NOT_FOUND
      });
    }

    const isAdmin = isUserAdminOfWorkspace(workspace, userId);
    if (!isAdmin) {
      throw new ClientError({
        explanation: 'User is not an admin of the workspace',
        message: 'User is not an admin of the workspace',
        statusCode: StatusCodes.UNAUTHORIZED
      });
    }

    const isValidUser = await userRepository.getById(memberId);
    if (!isValidUser) {
      throw new ClientError({
        explanation: 'Invalid data sent from the client',
        message: 'User not found',
        statusCode: StatusCodes.NOT_FOUND
      });
    }

    const isMember = isUserMemberOfWorkspace(workspace, memberId);
    if (isMember) {
      throw new ClientError({
        explanation: 'User is already a member of the workspace',
        message: 'User is already a member of the workspace',
        statusCode: StatusCodes.UNAUTHORIZED
      });
    }

    const response = await workspaceRepository.addMemberToWorkspace(
      workspaceId,
      memberId,
      role
    );

    addEmailToMailQueue({
      ...workspaceJoinMail(workspace),
      to: isValidUser.email
    });
    return response;
  } catch (error) {
    console.log('addMemberToWorkspaceService error', error);
    throw error;
  }
};

export const addChannelToWorkspaceService = async (
  workspaceId,
  channelName,
  userId
) => {
  try {
    const workspace =
      await workspaceRepository.getWorkspaceDetailsById(workspaceId);
    if (!workspace) {
      throw new ClientError({
        explanation: 'Invalid data sent from the client',
        message: 'Workspace not found',
        statusCode: StatusCodes.NOT_FOUND
      });
    }
    const isAdmin = isUserAdminOfWorkspace(workspace, userId);
    if (!isAdmin) {
      throw new ClientError({
        explanation: 'User is not an admin of the workspace',
        message: 'User is not an admin of the workspace',
        statusCode: StatusCodes.UNAUTHORIZED
      });
    }
    const isChannelPartOfWorkspace = isChannelAlreadyPartOfWorkspace(
      workspace,
      channelName
    );
    if (isChannelPartOfWorkspace) {
      throw new ClientError({
        explanation: 'Invalid data sent from the client',
        message: 'Channel already part of workspace',
        statusCode: StatusCodes.FORBIDDEN
      });
    }
    const response = await workspaceRepository.addChannelToWorkspace(
      workspaceId,
      channelName
    );

    return response;
  } catch (error) {
    console.log('addChannelToWorkspaceService error', error);
    throw error;
  }
};

export const joinWorkspaceService = async (workspaceId, joinCode, userId) => {
  try {
    const workspace =
      await workspaceRepository.getWorkspaceDetailsById(workspaceId);

    if (!workspace) {
      throw new ClientError({
        explanation: 'Invalid data sent from the client',
        message: 'Workspace not found',
        statusCode: StatusCodes.NOT_FOUND
      });
    }

    if (workspace.joinCode !== joinCode) {
      throw new ClientError({
        explanation: 'Invalid data sent from the client',
        message: 'Invalid join code',
        statusCode: StatusCodes.UNAUTHORIZED
      });
    }

    const updatedWorkspace = await workspaceRepository.addMemberToWorkspace(
      workspaceId,
      userId,
      'member'
    );

    return updatedWorkspace;
  } catch (error) {
    console.log('joinWorkspaceService error', error);
    throw error;
  }
};

export const updateChannelToWorkspaceService = async (
  workspaceId,
  channelId,
  channelName,
  userId
) => {
  const workspace =
    await workspaceRepository.getWorkspaceDetailsById(workspaceId);

  if (!workspace) {
    throw new ClientError({
      explanation: 'Invalid data sent from the client',
      message: 'Channel not found',
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

  const isAdmin = isUserAdminOfWorkspace(workspace, userId);
  if (!isAdmin) {
    throw new ClientError({
      explanation: 'User is not an admin of the workspace',
      message: 'User is not an admin of the workspace',
      statusCode: StatusCodes.UNAUTHORIZED
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

  // Update the channel name
  channel.name = channelName;
  await channel.save();
  return channel;
};

export const deleteMemberToWorkspaceService = async (
  workspaceId,
  memberId,
  userId
) => {
  try {
    const workspace = await workspaceRepository.getById(workspaceId);

    if (!workspace) {
      throw new ClientError({
        explanation: 'Invalid data sent from the client',
        message: 'Workspace not found',
        statusCode: StatusCodes.NOT_FOUND
      });
    }

    const isAdmin = isUserAdminOfWorkspace(workspace, userId);
    if (!isAdmin) {
      throw new ClientError({
        explanation: 'User is not an admin of the workspace',
        message: 'User is not an admin of the workspace',
        statusCode: StatusCodes.UNAUTHORIZED
      });
    }

    const isValidUser = await userRepository.getById(memberId);
    if (!isValidUser) {
      throw new ClientError({
        explanation: 'Invalid data sent from the client',
        message: 'User not found',
        statusCode: StatusCodes.NOT_FOUND
      });
    }

    const isMember = isUserMemberOfWorkspace(workspace, memberId);
    if (!isMember) {
      throw new ClientError({
        explanation: 'User is not a member of the workspace',
        message: 'User is not a member of the workspace',
        statusCode: StatusCodes.UNAUTHORIZED
      });
    }

    const roomId = [userId, memberId].sort().join('_');

    const response = await workspaceRepository.update(workspaceId, {
      $pull: { members: { memberId: memberId } }
    });

    await messageRepository.deleteMany({
      roomId: roomId,
      workspaceId: workspaceId
    });

    addEmailToMailQueue({
      ...workspaceMemberDeleteMail(workspace),
      to: isValidUser.email
    });

    return response;
  } catch (error) {
    console.log('deleteMemberToWorkspaceService error', error);
    throw error;
  }
};

export const deleteChannelWorkspaceService = async (
  workspaceId,
  channelId,
  userId
) => {
  try {
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

    const isAdmin = isUserAdminOfWorkspace(workspace, userId);
    if (!isAdmin) {
      throw new ClientError({
        explanation: 'User is not an admin of the workspace',
        message: 'User is not an admin of the workspace',
        statusCode: StatusCodes.UNAUTHORIZED
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

    const response = await channelRepository.delete(channelId);

    await messageRepository.deleteMany({
      channelId: channelId,
      workspaceId: workspaceId
    });

    const recipients = workspace.members || [];
    await sendChannelDeleteEmails({ recipients, channel, workspace });

    return response;
  } catch (error) {
    console.log('deleteChannelWorkspaceService error', error);
    throw error;
  }
};
