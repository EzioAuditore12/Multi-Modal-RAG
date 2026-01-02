import { redisClient } from '@/lib/redis-client';
import { rateLimit } from 'express-rate-limit';
import { type RedisReply, RedisStore } from 'rate-limit-redis';

export const rateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  ipv6Subnet: 56,
  store: new RedisStore({
    sendCommand: (command: string, ...args: string[]) =>
      redisClient.call(command, ...args) as Promise<RedisReply>,
  }),
});
