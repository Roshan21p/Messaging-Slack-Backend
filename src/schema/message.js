import mongoose from 'mongoose';
import ClientError from '../utils/errors/clientError.js';
import { StatusCodes } from 'http-status-codes';

const messageSchema = mongoose.Schema(
  {
    body: {
      type: String,
      required: [true, 'Message body is required']
    },
    image: {
      type: String
    },
    channelId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Channel',
      required: false
    },
    roomId: {
      type: String,
      required: false
    },
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Sender ID is required']
    },
    workspaceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Workspace',
      required: false
    }
  },
  { timestamps: true }
);

messageSchema.pre('validate', function (next) {
  if (!this.channelId && !this.roomId) {
    return next(
      new ClientError({
        explanation: 'A message must be associated with either a channel or a room.',
        message: 'Either channelId or roomId must be provided.',
        statusCode: StatusCodes.BAD_REQUEST,
      })
    );
  }
  if (this.channelId && this.roomId) {
    return next(
      new ClientError({
        explanation: 'A message cannot be associated with both a channel and a room simultaneously.',
        message: 'Only one of channelId or roomId should be provided.',
        statusCode: StatusCodes.BAD_REQUEST,
      })
    );
  }
  next();
});


const Message = mongoose.model('Message', messageSchema);

export default Message;
