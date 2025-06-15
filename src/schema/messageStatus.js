import mongoose from 'mongoose';

const messageStatusSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    channelId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Channel',
      required: false
    },
    workspaceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Workspace',
      required: false
    },
    roomId: {
      type: String,
      required: false
    },
    lastReadAt: {
      type: Date,
      default: null
    }
  },
  { timestamps: true }
);

const MessageStatus = mongoose.model('MessageStatus', messageStatusSchema);

export default MessageStatus;
