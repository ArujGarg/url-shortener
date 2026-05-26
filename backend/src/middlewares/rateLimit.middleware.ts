import type { Request, Response, NextFunction } from "express";
import { Ratelimit } from "@upstash/ratelimit";
import { redisClient } from "../redis.js";

const createUrlLimiter = new Ratelimit({
  redis: redisClient,
  limiter: Ratelimit.fixedWindow(10, "60 s"),
});

const redirectLimiter = new Ratelimit({
  redis: redisClient,
  limiter: Ratelimit.fixedWindow(1000, "60 s"),
});

export const createUrlRateLimitMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const ip = req.ip ?? "anonymous";

    const { success } = await createUrlLimiter.limit(ip);

    if (!success) {
      return res.status(429).json({
        error: "Too many URL creation requests.",
      });
    }

    next();
  } catch (error) {
    console.error("Rate limiter error:", error);

    next();
  }
};

export const redirectRateLimitMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const ip = req.ip ?? "anonymous";

    const { success } = await redirectLimiter.limit(ip);

    if (!success) {
      return res.status(429).json({
        error: "Too many redirect requests.",
      });
    }

    next();
  } catch (error) {
    console.error("Rate limiter error:", error);

    next();
  }
};
