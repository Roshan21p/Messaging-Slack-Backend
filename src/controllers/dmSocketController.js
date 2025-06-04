import {
  JOIN_DM_ROOM,
  LEAVE_DM_ROOM,
  ONLINE_USERS_EVENT
} from '../utils/common/eventConstants.js';

const onlineUsersInDM = new Map(); // Map<roomId, Set<userId>>
console.log('onlineUsersInDM', onlineUsersInDM);

export default async function dmSocketHandlers(io, socket) {
  const userId = socket?.handshake?.auth?.userId;
  if (!userId) {
    console.log(`Socket ${socket.id} missing userId  in handshake DM`);
    return;
  }

  socket.on(JOIN_DM_ROOM, async function joinDMHandler(data, cb) {
    const roomId = data?.roomId;
    console.log('room', roomId, data);

    if (!roomId) {
      cb?.({
        success: false,
        message: 'Missing roomId'
      });
      return;
    }

    //const roomId = [userId, receiverId].sort().join('_');

    await socket.join(roomId);

    if (!onlineUsersInDM.has(roomId)) {
      onlineUsersInDM.set(roomId, new Set());
    }
    onlineUsersInDM.get(roomId).add(userId);

    const onlineCount = onlineUsersInDM.get(roomId).size;

    console.log(
      `User ${userId} joined DM room ${roomId}. Users now: ${onlineCount}`
    );

    // Notify others in the room that a user has joined
    io.to(roomId).emit(ONLINE_USERS_EVENT, {
      roomId: roomId,
      count: onlineCount
    });

    cb?.({
      success: true,
      message: `Successfully Joined DM room ${roomId}`,
      data: {
        roomId: roomId,
        users: onlineCount
      }
    });
  });

  socket.on(LEAVE_DM_ROOM, async function leaveDMHandler(data, cb) {
    const roomId = data?.roomId;

    console.log('room', roomId);

    if (!roomId) {
      cb?.({
        success: false,
        message: 'Missing receiverId'
      });
      return;
    }

    //const roomId = [userId, receiverId].sort().join('_');

    await socket.leave(roomId);

    const userSet = onlineUsersInDM.get(roomId);
    console.log('userSet', userSet, 'onlineUsersInDM', onlineUsersInDM);
    if (userSet) {
      userSet.delete(userId);

      if (userSet.size === 0) {
        onlineUsersInDM.delete(roomId);
      }
    }

    const onlineCount = onlineUsersInDM.get(roomId)?.size || 0;

    console.log(
      `User ${socket.id} left the room ${roomId}. Users now: ${onlineCount}`
    );

    // Notify others in the room that a user has left
    io.to(roomId).emit(ONLINE_USERS_EVENT, {
      roomId: roomId,
      count: onlineCount
    });

    cb?.({
      success: true,
      message: `Successfully left the room ${roomId}`,
      data: {
        roomId: roomId,
        users: onlineCount
      }
    });
  });
}
