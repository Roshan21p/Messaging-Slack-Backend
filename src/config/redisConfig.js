import { REDIS_HOST, REDIS_PORT, REDIS_URL } from './serverConfig.js';

let redisConfig;

if (REDIS_URL) {
  const url = new URL(REDIS_URL);
  console.log('redis url', REDIS_URL, url);
  redisConfig = {
    host: url.hostname, // 'red-d11tnps9c44c73fn6dtg'
    port: Number(url.port) // 6379
  };
} else {
  redisConfig = {
    host: REDIS_HOST || 'localhost',
    port: Number(REDIS_PORT) || 6379
  };
}

export default redisConfig;
