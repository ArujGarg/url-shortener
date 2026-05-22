import rateLimit from "express-rate-limit";
import RedisStore from "rate-limit-redis";
import { redisClient } from "../redis.js";

export const createUrlLimiter = rateLimit({
  windowMs: 60 * 1000,

  max: 10,

  standardHeaders: true,

  legacyHeaders: false,

  message: {
    error: "Too many URL creation requests.",
  },

  store: new RedisStore({
    sendCommand: (...args: string[]) => redisClient.sendCommand(args),
  }),
});

export const redirectLimiter = rateLimit({
  windowMs: 60 * 1000,

  max: 1000,

  standardHeaders: true,

  legacyHeaders: false,

  message: {
    error: "Too many redirect requests.",
  },

  store: new RedisStore({
    sendCommand: (...args: string[]) => redisClient.sendCommand(args),
  }),
});
