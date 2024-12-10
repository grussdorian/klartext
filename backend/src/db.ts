import { createClient } from 'redis';
import dotenv from 'dotenv';
dotenv.config();
const DEPLOY = process.env.DEPLOY === 'false' ? false : true;
const REDIS_PASSWORD = process.env.REDIS_PASSWORD || 'error';
if (DEPLOY && REDIS_PASSWORD === 'error') {
  throw new Error('Redis password not provided');
}
const username = process.env.REDIS_USERNAME || 'scads';
const redisClient = createClient(
  {
    username: username,
    password: REDIS_PASSWORD,
  }
);

redisClient.on('error', (err: Error) => console.error('Redis Client Error', err));

(async () => {
  await redisClient.connect();
})();

export default redisClient;