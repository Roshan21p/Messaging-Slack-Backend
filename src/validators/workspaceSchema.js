import { z } from 'zod';

export const createWorkspaceSchema = z.object({
  name: z.string().min(3).max(50)
});

export const addMemberToWorkspaceSchema = z.object({
  memberId: z.string()
});

export const addChannelToWorkspaceSchema = z.object({
  channelName: z.string()
});
