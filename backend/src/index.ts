import express from "express";
import { customAlphabet } from "nanoid";
import prisma from "./db/prisma.js";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

const alphabet = "abcdefghijklmnopqrstuvwxyz0123456789";
const nanoid = customAlphabet(alphabet, 7);

app.get("/:shortCode", async (req, res) => {
  try {
    const { shortCode } = req.params;

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

    return res.redirect(url.originalUrl);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: "Internal server error",
    });
  }
});

app.post("/api/v1/urls", async (req, res) => {
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
    console.error(error);

    return res.status(500).json({
      error: "Internal server error",
    });
  }
});

app.listen(3002, () => {
  console.log("Server is running on port 3002");
});

function isValidUrl(url: string) {
  try {
    const parsedUrl = new URL(url);

    return parsedUrl.protocol === "http:" || parsedUrl.protocol === "https:";
  } catch {
    return false;
  }
}
