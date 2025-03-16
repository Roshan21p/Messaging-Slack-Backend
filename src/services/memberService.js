import { StatusCodes } from 'http-status-codes';

import userRepository from '../repositories/userRepository.js';
import workspaceRepository from '../repositories/workspaceRepository.js';
import ClientError from '../utils/errors/clientError.js';
import { isUserMemberOfWorkspace } from './workspaceService.js';

export const isMemberPartOfWokspaceService = async (workspaceId, memberId) => {
  try {
    const workspace = await workspaceRepository.getById(workspaceId);

    if (!workspace) {
      throw new ClientError({
        explanation: 'Invalid data sent from the client',
        message: 'Workspace not found',
        statusCode: StatusCodes.NOT_FOUND
      });
    }

    const isUserAMember = isUserMemberOfWorkspace(workspace, memberId);

    if (!isUserAMember) {
      throw new ClientError({
        explanation: 'User is not a member of the workspace',
        message: 'User is not a member of the workspace',
        statusCode: StatusCodes.UNAUTHORIZED
      });
    }
    const user = await userRepository.getById(memberId);
    return user;
  } catch (error) {
    console.log('Member is part of workspace service', error);
    throw error;
  }
};
