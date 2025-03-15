import Channel from '../schema/channel';
import crudRepository from './crudRepository';

const channelRepository = {
  ...crudRepository(Channel)
};

export default channelRepository;
