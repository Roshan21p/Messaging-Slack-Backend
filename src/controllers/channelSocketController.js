import { JOIN_CHANNEL, LEAVE_CHANNEL } from '../utils/common/eventConstants.js';

export default async function messageHandlers(io, socket) {
  socket.on(JOIN_CHANNEL, async function joinChannelHandler(data, cb) {
    const roomId = data?.channelId;

    await socket.join(roomId);

    const room = io.sockets.adapter.rooms.get(roomId);
    const roomSize = room ? room.size : 0;

    console.log(
      `User ${socket.id} joined the channel and room ${roomId}. Users now: ${roomSize}`
    );

    cb?.({
      success: true,
      message: `Successfully joined the channel and room ${roomId}`,
      data: {
        channelId: roomId,
        users: roomSize
      }
    });
  });

  socket.on(LEAVE_CHANNEL, async function leaveChannelHandler(data, cb) {
    const roomId = data?.channelId;

    await socket.leave(roomId);

    const room = io.sockets.adapter.rooms.get(roomId);
    const roomSize = room ? room.size : 0;

    console.log(
      `User ${socket.id} left the channel and room ${roomId}. Users now: ${roomSize}`
    );

    cb?.({
      success: true,
      message: `Successfully left the channel and room ${roomId}`,
      data: roomId
    });
  });
}
