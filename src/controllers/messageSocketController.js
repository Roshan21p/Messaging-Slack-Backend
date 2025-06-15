import { createMessageService } from '../services/messageService.js';
import {
  NEW_MESSAGE_EVENT,
  NEW_MESSAGE_NOTIFICATION_EVENT,
  NEW_MESSAGE_RECEIVED_EVENT
} from '../utils/common/eventConstants.js';

export default function messagleHandlers(io, socket) {
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

    console.log('messageResponse', messageResponse, 'socket', socket.handshake);

    // socket.broadcast.emit(NEW_MESSAGE_RECEIVED_EVENT, messageResponse);

    io.to(targetRoom).emit(NEW_MESSAGE_RECEIVED_EVENT, messageResponse); // Implementation of rooms

    io.to(workspaceId).emit(NEW_MESSAGE_NOTIFICATION_EVENT, {
      channelId,
      senderId,
      workspaceId
    });

    return cb?.({
      success: true,
      message: 'Successfully created the message',
      data: messageResponse
    });
  });
}
