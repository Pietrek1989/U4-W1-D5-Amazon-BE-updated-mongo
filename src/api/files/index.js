import Express from "express";
import multer from "multer";
import { extname } from "path";
import {
  getArticles,
  saveArticlePic,
  writeArticles,
} from "../../lib/fs-tools.js";

const filesRouter = Express.Router();

filesRouter.post(
  "/:articleId/articleSingle",
  multer().single("productPic"),
  async (req, res, next) => {
    try {
      console.log("FILE:", req.file);
      console.log("BODY:", req.body);
      const originalFileExtension = extname(req.file.originalname);
      const fileName = req.params.articleId + originalFileExtension;
      await saveArticlePic(fileName, req.file.buffer);

      const articleArray = await getArticles();
      const index = articleArray.findIndex(
        (article) => article.id === req.params.articleId
      );
      if (index !== -1) {
        const oldArticle = articleArray[index];
        const newArticle = {
          ...oldArticle,
          imageUrl: `http://localhost:3001/img/productImg/${fileName}`,
        };
        articleArray[index] = newArticle;
        await writeArticles(articleArray);
        res.send({ newArticle, message: "file uploaded" });
      } else {
        next(
          createHttpError(
            404,
            `article with id ${req.params.articleId} not found!`
          )
        );
      }
    } catch (error) {
      next(error);
    }
  }
);

export default filesRouter;
