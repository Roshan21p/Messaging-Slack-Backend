import { MAIL_ID } from '../../config/serverConfig.js';
import { addEmailToMailQueue } from '../../producers/mailQueueProducer.js';

export const workspaceJoinMail = function (workspace) {
  return {
    from: MAIL_ID,
    subject: 'You have been added to a workspace',
    text: `Congratulations! You have been added to the workspace ${workspace.name}`
  };
};

export const workspaceDeleteMail = ({ workspace, username }) => {
  return `
    <p>Hello ${username},</p>
    <p>The workspace <strong>${workspace.name}</strong> has been deleted.</p>
    <p>If this was unexpected, please contact support team.</p>
    <p>Regards,<br>The Messaging-Slack Team</p>
  `;
};

export const workspaceMemberDeleteMail = function (workspace) {
  return {
    from: MAIL_ID,
    subject: `Removed from "${workspace.name}" workspace`,
    text: `You have been removed from the workspace "${workspace.name}.`
  };
};

export const sendWorkspaceDeleteEmails = async (workspace) => {
  const recipients = workspace.members || [];
  if (!recipients || recipients.length === 0) return;

  const emailJobs = recipients
    .filter((member) => member?.memberId?.email) // keep only valid emails
    .map((member) => {
      const email = member.memberId.email;
      const username = member.memberId.username;

      return addEmailToMailQueue({
        to: email,
        subject: `Workspace "${workspace.name}" Deleted`,
        html: workspaceDeleteMail({ workspace, username })
      });
    });

  await Promise.all(emailJobs); // Wait for all emails to be queued
};

export const sendChannelDeleteEmails = async ({
  recipients,
  channel,
  workspace
}) => {
  if (!recipients || recipients.length === 0) return;

  const emailJobs = recipients
    .filter((member) => member?.memberId?.email) // 🔥 only keep those with emails
    .map((member) => {
      const email = member.memberId.email;
      const username = member.memberId.username;

      return addEmailToMailQueue({
        to: email,
        subject: `Channel "${channel.name}" Deleted`,
        html: channelDeleteMail({ channel, workspace, username })
      });
    });

  await Promise.all(emailJobs);
};

export const channelDeleteMail = ({ channel, workspace, username }) => {
  return `
    <div>
      <p>Hi ${username || 'User'},</p>
      <p>The channel <strong>${channel.name}</strong> has been deleted from the workspace <strong>${workspace.name}</strong>.</p>
      <p>If you have any questions, contact your workspace admin.</p>
    </div>
  `;
};
