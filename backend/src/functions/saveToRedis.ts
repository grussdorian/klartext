// Purpose: This file contains the function that saves the response prompt to Redis.
import redisClient from '../db';
import { TargetAudiences } from '../types';

const saveToRedis = async (originalText: string, targetAudience: TargetAudiences, responsePrompt: string) => {
  const uniqueId = Date.now().toString();
  const key = `prompt|:|${originalText}|:|${targetAudience}|:|${uniqueId}`;
  await redisClient.set(key, responsePrompt);
};

export { saveToRedis };