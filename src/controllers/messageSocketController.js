import { createMessageService } from '../services/messageService.js';
import {
  markDmMessagesAsRead,
  markMessagesAsRead
} from '../services/messageStatusService.js';
import {
  MARK_MESSAGES_AS_READ,
  NEW_MESSAGE_EVENT,
  NEW_MESSAGE_NOTIFICATION_EVENT,
  NEW_MESSAGE_RECEIVED_EVENT
} from '../utils/common/eventConstants.js';

export default function messageHandlers(io, socket) {
  const userId = socket.handshake?.auth?.userId;
  if (!userId) {
    console.log(`Socket ${socket.id} missing userId in handshake`);
    return;
  }
  socket.on(NEW_MESSAGE_EVENT, async function createMessageHandler(data, cb) {
    const { roomId, channelId, senderId, workspaceId } = data;

    // Determine the room to emit the message to
    const targetRoom = channelId || roomId;

    console.log('targetRoom to emit the message', targetRoom, workspaceId);

    if (!targetRoom) {
      return cb?.({
        success: false,
        message: 'No valid room ID provided'
      });
    }

    const messageResponse = await createMessageService(data);

    // socket.broadcast.emit(NEW_MESSAGE_RECEIVED_EVENT, messageResponse);

    io.to(targetRoom).emit(NEW_MESSAGE_RECEIVED_EVENT, messageResponse); // Implementation of rooms

    io.to(workspaceId).emit(NEW_MESSAGE_NOTIFICATION_EVENT, {
      channelId,
      roomId,
      senderId,
      workspaceId
    });

    return cb?.({
      success: true,
      message: 'Successfully created the message',
      data: messageResponse
    });
  });

  socket.on(
    MARK_MESSAGES_AS_READ,
    async function markMessageASReadHandler(data, cb) {
      const userId = socket.handshake?.auth?.userId;

      console.log('socket userId', socket.handshake?.auth?.userId);

      const { channelId, workspaceId, roomId } = data;

      if (!userId || !workspaceId) {
        return cb?.({
          success: false,
          message: 'Missing required fields',
          data: { userId, workspaceId }
        });
      }
      try {
        if (channelId) {
          await markMessagesAsRead({ userId, workspaceId, channelId });
        } else {
          await markDmMessagesAsRead({ userId, workspaceId, roomId });
        }
        console.log(
          `Marked as read for user ${userId} in workspace ${workspaceId} for channel in ${channelId} or for roomId in ${roomId}`
        );
        return cb?.({
          success: true,
          message: 'Successfully mark the message as read',
          data: {
            userId: userId,
            workspaceId: workspaceId,
            channelId: channelId,
            roomId: roomId
          }
        });
      } catch (error) {
        console.log('Error in mark_as_read socket event:', error);
      }
    }
  );
}
