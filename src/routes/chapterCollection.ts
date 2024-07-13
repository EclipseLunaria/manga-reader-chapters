import { Router } from "express";
import { getChapterImages } from "../utils/aws";
import extractChapter from "../services/chapterExtractor";
const collectionRouter = Router();

// Returns a list of links to stored pointing to the pages in a chapter
collectionRouter.get("/manga-:mangaId/chapter-:chapterId", async (req, res) => {
  const { mangaId, chapterId } = req.params;
  if (!mangaId || !chapterId) {
    res.status(400).send("Invalid mangaId or chapterId");
    return;
  }
  const imageLinks = await getChapterImages("manga-reader-chapters", `manga-${mangaId}/chapter-${chapterId}`);
  if (imageLinks.length > 0) {
    console.log("Found images in s3");
    return res.send(imageLinks);
  }
  // if the mangaid and chapterid exist in s3
  // return the list of links
  const img_links = await extractChapter(mangaId, chapterId);
  res.send(img_links);


  // else
  // generate the links and store them in s3
  // return the list of links
});

export default collectionRouter;
