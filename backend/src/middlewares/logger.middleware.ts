import crypto from "crypto";
import { pinoHttp } from "pino-http";
import { logger } from "../logger.js";

export const loggerMiddleware = pinoHttp({
  logger,
  genReqId: () => crypto.randomUUID(),
});
