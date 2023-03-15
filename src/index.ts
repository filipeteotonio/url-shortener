import express from "express";
import { connectToDatabase } from "./config";
import router from "./routes";
import dotenv from "dotenv";

dotenv.config();
const app = express();
let database;

connectToDatabase().then((db) => {
  app.listen(3000, () => {
    console.log("Server started on port 3000");
  });
  database = db;
});

app.use(express.json());

app.use((req, res, next) => {
  req.app.locals.db = database;
  next();
});

app.use(router);
