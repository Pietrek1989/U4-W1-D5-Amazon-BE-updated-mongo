import Express from "express";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";

const filesRouter = Express.Router();
const cloudinaryUploaderArticle = multer({
  storage: new CloudinaryStorage({
    cloudinary,
    params: {
      folder: "amazon",
    },
  }),
}).single("productImg");

filesRouter.post(
  "/:articleId/articleSingle",
  cloudinaryUploaderArticle,
  async (req, res, next) => {
    try {
      console.log("FILE:", req.file);
      const article = await ArticlesModel.findById(req.params.articleId);
      article.cover = req.file.path;
      await article.save();
      if (article) {
        res.send({ article, message: "file uploaded" });
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
