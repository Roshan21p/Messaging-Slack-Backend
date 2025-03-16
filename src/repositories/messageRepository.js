import Message from '../schema/message.js';
import crudRepository from './crudRepository.js';

const messageRepository = {
  ...crudRepository(Message),
  getPaginatedMessaged: async function (messageParams, page, limit) {
    const messages = await Message.find(messageParams)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate('senderId', 'username email avatar');

    return messages;
  }
};

export default messageRepository;
