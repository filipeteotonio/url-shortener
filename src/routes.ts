import express, { Request, Response } from "express";
import crypto from "crypto";
import { addHours } from "date-fns";

const router = express.Router();
const SHORT_URLS_COLLECTION = "short-urls";

router.post("/shorten", async (req: Request, res: Response) => {
  const longUrl: string = req.body.longUrl;

  if (!longUrl) {
    return res.status(400).send({ error: "URL is required" });
  }

  const db = req.app.locals.db;
  const shortUrls = db.collection(SHORT_URLS_COLLECTION);

  const existingShortUrl = await shortUrls.findOne({
    longUrl,
    expirationDate: { $gt: new Date() },
  });

  if (existingShortUrl) {
    return res.status(200).send({ shortUrl: existingShortUrl.shortUrl });
  }

  const base64Hash = crypto
    .createHash("sha256")
    .update(longUrl)
    .digest("base64");
  const shortHash = base64Hash.substring(0, 11);
  const shortUrl = `www.us.com/${shortHash}`;
  const expirationInHours = parseInt(
    process.env.SHORT_URL_EXPIRATION_HOURS || "24"
  );

  const expirationDate = addHours(new Date(), expirationInHours);
  await shortUrls.insertOne({ shortUrl, longUrl, expirationDate });

  return res.status(200).send({ shortUrl });
});

router.get("/long", async (req: Request, res: Response) => {
  const shortUrl: string = req.query.shortUrl as string;
  console.log(shortUrl);
  if (!shortUrl) {
    return res.status(400).send({ error: "URL is required!" });
  }

  const db = req.app.locals.db;
  const shortUrls = db.collection(SHORT_URLS_COLLECTION);
  const existingShortUrl = await shortUrls.findOne({
    shortUrl,
    expirationDate: { $gt: new Date() },
  });

  if (existingShortUrl) {
    return res.status(200).send({ longUrl: existingShortUrl.longUrl });
  }

  return res.status(404).send({ error: "URL not found!" });
});

export default router;
