
import { JOIN_CHANNEL, LEAVE_CHANNEL, ONLINE_USERS_EVENT} from '../utils/common/eventConstants.js';


const onlineUsersPerRoom = new Map();
console.log("onlineUsersPerRoom",onlineUsersPerRoom)

export default async function messageHandlers(io, socket) {

  const userId = socket.handshake?.auth?.userId;
  if(!userId){
    console.log(`Socket ${socket.id} missing userId in handshake`);
    return;
  }


  socket.on(JOIN_CHANNEL, async function joinChannelHandler(data, cb) {
    const roomId = data?.channelId;

    await socket.join(roomId);

    // Add userId to the set for this room
    if(!onlineUsersPerRoom.has(roomId)){
      onlineUsersPerRoom.set(roomId, new Set());
    }
    onlineUsersPerRoom.get(roomId).add(userId);

    const onlineCount = onlineUsersPerRoom.get(roomId).size;

    console.log("onlineUsersPerRoom in Join channel",onlineUsersPerRoom)

    console.log(
      `User ${socket.id} joined the channel and room ${roomId}. Users now: ${onlineCount}`
    );

    // Notify others in the room that a user has joined
    io.to(roomId).emit(ONLINE_USERS_EVENT, { channelId: roomId, count: onlineCount});

    cb?.({
      success: true,
      message: `Successfully joined the channel and room ${roomId}`,
      data: {
        channelId: roomId,
        users: onlineCount
      }
    });
  });

  socket.on(LEAVE_CHANNEL, async function leaveChannelHandler(data, cb) {
    const roomId = data?.channelId;

    await socket.leave(roomId);

    const userSet = onlineUsersPerRoom.get(roomId);
    console.log("userSet",userSet, "onlineUsersPerRoom",onlineUsersPerRoom)
    if(userSet){
      userSet.delete(userId);

      if(userSet.size === 0){
        onlineUsersPerRoom.delete(roomId);
      }
    }

    const onlineCount = onlineUsersPerRoom.get(roomId)?.size || 0;

    console.log(
      `User ${socket.id} left the channel and room ${roomId}. Users now: ${onlineCount}`
    );

    // Notify others in the room that a user has left
    io.to(roomId).emit(ONLINE_USERS_EVENT, { channelId: roomId, count: onlineCount});

    cb?.({
      success: true,
      message: `Successfully left the channel and room ${roomId}`,
      data: {
        channelId: roomId,
        users: onlineCount
      }
    });
  });

 
}
