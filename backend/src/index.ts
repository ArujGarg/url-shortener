import express from "express";
import { customAlphabet } from "nanoid";
import prisma from "./db/prisma.js";
import cors from "cors";
import { redisClient } from "./redis.js";
import { startFlushClicksWorker } from "./workers/flushClick.workers.js";
import { isValidUrl } from "./helpers/validateUrl.helpers.js";
import {
  createUrlRateLimitMiddleware,
  redirectRateLimitMiddleware,
} from "./middlewares/rateLimit.middleware.js";
import { logger } from "./logger.js";
import { loggerMiddleware } from "./middlewares/logger.middleware.js";

const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://url-shortener-eight-coral.vercel.app/",
    ],
  }),
);

app.use(express.json());
app.use(loggerMiddleware);

const alphabet = "abcdefghijklmnopqrstuvwxyz0123456789";
const nanoid = customAlphabet(alphabet, 7);

app.get("/:shortCode", redirectRateLimitMiddleware, async (req, res) => {
  try {
    const { shortCode } = req.params;

    if (!shortCode || Array.isArray(shortCode)) {
      return res.status(400).json({
        error: "Invalid short code",
      });
    }

    const cachedUrl = await redisClient.get<string>(`url:${shortCode}`);

    if (cachedUrl) {
      logger.info(
        {
          shortCode,
        },
        "CACHE HIT",
      );
      await redisClient.incr(`clicks:${shortCode}`);
      return res.redirect(cachedUrl);
    }

    logger.info(
      {
        shortCode,
      },
      "CACHE MISS",
    );

    const url = await prisma.url.findUnique({
      where: {
        shortCode,
      },
    });

    if (!url) {
      return res.status(404).json({
        error: "Short URL not found",
      });
    }

    await redisClient.set(`url:${shortCode}`, url.originalUrl, {
      ex: 60 * 60 * 24,
    });
    await redisClient.incr(`clicks:${shortCode}`);

    return res.redirect(url.originalUrl);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: "Internal server error",
    });
  }
});

app.post("/api/v1/urls", createUrlRateLimitMiddleware, async (req, res) => {
  try {
    const { originalUrl } = req.body;

    if (!originalUrl) {
      return res.status(400).json({
        error: "Original URL is required",
      });
    }

    if (!isValidUrl(originalUrl)) {
      return res.status(400).json({
        error: "Invalid URL",
      });
    }

    let shortCode = nanoid();

    while (await prisma.url.findUnique({ where: { shortCode } })) {
      shortCode = nanoid();
    }

    const url = await prisma.url.create({
      data: {
        shortCode,
        originalUrl,
      },
    });

    return res.status(201).json({
      message: "URL shortened successfully",
      data: url,
    });
  } catch (error) {
    logger.error(error);

    return res.status(500).json({
      error: "Internal server error",
    });
  }
});

const startServer = async () => {
  startFlushClicksWorker();

  const PORT = process.env.PORT || 3002;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer();
