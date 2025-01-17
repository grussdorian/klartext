import { createClient } from 'redis';
import dotenv from 'dotenv';
dotenv.config();

const username = process.env.REDIS_USERNAME || 'scads';
const password = process.env.REDIS_PASSWORD || 'error';

const DEPLOY = process.env.DEPLOY === 'false' ? false : true;

if (DEPLOY && password === 'error') {
  throw new Error('Redis password not provided');
}

const redisClient = createClient(
  {
    username: username,
    password: password,
  }
);

redisClient.on('error', (err: Error) => console.error('Redis Client Error', err));

(async () => {
  await redisClient.connect();
})();

export default redisClient;