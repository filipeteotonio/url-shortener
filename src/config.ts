import { MongoClient } from "mongodb";

const MONGODB_URL = process.env.MONGODB_URL || "mongodb://0.0.0.0:27017";
const DB_NAME = "url-shortener";
const COLLECTION_LONG_URLS = "long-urls";
const COLLECTION_SHORT_URLS = "short-urls";

export async function connectToDatabase() {
  try {
    const client = await MongoClient.connect(MONGODB_URL);
    const db = client.db(DB_NAME);

    const collections = await db.collections();
    const longUrlsCollectionExists = collections.some(
      (collection) => collection.collectionName === COLLECTION_LONG_URLS
    );

    const shortUrlsCollectionExists = collections.some(
      (collection) => collection.collectionName === COLLECTION_SHORT_URLS
    );

    // Create collections if they don't exist
    if (!longUrlsCollectionExists) {
      await db.createCollection(COLLECTION_LONG_URLS);
    }
    if (!shortUrlsCollectionExists) {
      await db.createCollection(COLLECTION_SHORT_URLS);
    }

    console.log(`Connected to MongoDB at ${MONGODB_URL}`);
    return db;
  } catch (error) {
    console.error(`Failed to connect to MongoDB at ${MONGODB_URL}`);
    console.error(error);
    process.exit(1);
  }
}
