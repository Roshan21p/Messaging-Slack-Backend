import { MAIL_ID } from '../../config/serverConfig.js';

export const workspaceJoinMail = function (workspace) {
  return {
    from: MAIL_ID,
    subject: 'You have been added to a workspace',
    text: `Congratulations! You have been added to the workspace ${workspace.name}`
  };
};

export const workspaceDeleteMail = function (workspace) {
  return {
    from: MAIL_ID,
    subject: `Removed from "${workspace.name}" workspace`,
    text: `You have been removed from the workspace "${workspace.name}.`
  };
};
