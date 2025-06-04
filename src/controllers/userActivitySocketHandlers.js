import {
  USER_STOP_TYPING_EVENT,
  USER_TYPING_EVENT
} from '../utils/common/eventConstants.js';

export default function UserActivitySocketHandlers(io, socket) {
  socket.on(USER_TYPING_EVENT, ({ roomId, username }) => {
    console.log('User typing:', username, 'in channel:', roomId);
    socket.to(roomId).emit(USER_TYPING_EVENT, { roomId, username });
  });

  socket.on(USER_STOP_TYPING_EVENT, ({ roomId, username }) => {
    console.log('User stopped typing:', username, 'in channel:', roomId);
    socket.to(roomId).emit(USER_STOP_TYPING_EVENT, { roomId, username });
  });
}
