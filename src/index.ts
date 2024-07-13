import express from "express";
import { bucketExists, prefixExists, uploadFile } from "./utils/aws";
import collectionRouter from "./routes/chapterCollection";
require('dotenv').config();

const app = express();
const port = 3002;

app.use('/', collectionRouter)

app.get("/", async (req, res) => {
  res.send([
    await bucketExists("manga-reader-chapters"),
    await prefixExists("manga-reader-chapters", "manga-1/chapter-1"),
    await prefixExists("manga-reader-chapters", "testing/penguin"),
    await prefixExists("manga-reader-chapters", "manga-1/testing")
  ]);
});

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});

