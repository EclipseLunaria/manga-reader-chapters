import { Router } from "express";

const collectionRouter = Router();

// Returns a list of links to stored pointing to the pages in a chapter
collectionRouter.get("/manga-:mangaId/chapter-:chapterId", (req, res) => {
  const { mangaId, chapterId } = req.params;
  
});
