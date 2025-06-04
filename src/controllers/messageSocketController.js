import { createMessageService } from '../services/messageService.js';
import {
  NEW_MESSAGE_EVENT,
  NEW_MESSAGE_RECEIVED_EVENT
} from '../utils/common/eventConstants.js';

export default function messagleHandlers(io, socket) {
  socket.on(NEW_MESSAGE_EVENT, async function createMessageHandler(data, cb) {
    console.log(data.roomId, typeof data, data);

    const { roomId, channelId } = data;

    // Determine the room to emit the message to
    const targetRoom = channelId || roomId;

    console.log(targetRoom)

    if (!targetRoom) {
      return cb?.({
        success: false,
        message: 'No valid room ID provided'
      });
    }


    const messageResponse = await createMessageService(data);

    // socket.broadcast.emit(NEW_MESSAGE_RECEIVED_EVENT, messageResponse);

    io.to(targetRoom).emit(NEW_MESSAGE_RECEIVED_EVENT, messageResponse); // Implementation of rooms

    return cb?.({
      success: true,
      message: 'Successfully created the message',
      data: messageResponse
    });
  });
}

