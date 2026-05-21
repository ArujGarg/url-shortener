import prisma from "../db/prisma.js";
import { redisClient } from "../redis.js";

export const startFlushClicksWorker = () => {
  setInterval(async () => {
    try {
      const keys = await redisClient.keys("clicks:*");

      for (const key of keys) {
        const shortCode = key.split(":")[1];

        const count = await redisClient.get(key);

        if (!count || !shortCode) continue;

        await prisma.url.update({
          where: {
            shortCode,
          },
          data: {
            clicks: {
              increment: Number(count),
            },
          },
        });

        await redisClient.del(key);
      }

      console.log("Flushed click counts to DB");
    } catch (error) {
      console.log(error);
    }
  }, 60000);
};
