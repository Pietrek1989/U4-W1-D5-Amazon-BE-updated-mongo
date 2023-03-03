import Express from "express";
import uniqid from "uniqid";
import createHttpError from "http-errors";
import { checkArticlesSchema, triggerBadRequest } from "./validation.js";
import { getArticles, writeArticles } from "../../lib/fs-tools.js";

const articlesRouter = Express.Router();

articlesRouter.post(
  "/",
  checkArticlesSchema,
  triggerBadRequest,
  async (req, res, next) => {
    try {
      const newArticle = {
        ...req.body,
        id: uniqid(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const articleArray = await getArticles();
      articleArray.push(newArticle);
      await writeArticles(articleArray);

      res.status(201).send({ id: newArticle.id });
    } catch (error) {
      console.log(error);
    }
  }
);

articlesRouter.get("/", async (req, res, next) => {
  try {
    const articleArray = await getArticles();
    if (req.query && req.query.category) {
      const filteredArticles = articleArray.filter(
        (article) => article.category === req.query.category
      );
      res.send(filteredArticles);
    } else {
      res.send(articleArray);
    }
  } catch (error) {
    next(error);
  }
});

articlesRouter.get("/:articleId", async (req, res, next) => {
  try {
    const articleArray = await getArticles();

    const chosenArticle = articleArray.find(
      (article) => article.id === req.params.articleId
    );
    if (chosenArticle) {
      res.send(chosenArticle);
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
});

articlesRouter.put(
  "/:articleId",
  checkArticlesSchema,
  triggerBadRequest,
  async (req, res, next) => {
    try {
      const articleArray = await getArticles();
      const index = articleArray.findIndex(
        (article) => article.id === req.params.articleId
      );
      if (index !== -1) {
        const oldArticle = articleArray[index];
        const newArticle = {
          ...oldArticle,
          ...req.body,
          updatedAt: new Date(),
        };
        articleArray[index] = newArticle;
        await writeArticles(articleArray);
        res.send(newArticle);
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

articlesRouter.delete("/:articleId", async (req, res, next) => {
  try {
    const articleArray = await getArticles();
    const remainingArticles = articleArray.filter(
      (article) => article.id !== req.params.articleId
    );
    if (articleArray.length !== remainingArticles.length) {
      await writeArticles(remainingArticles);
      res.status(204).send();
    } else {
      next(
        createHttpError(404, `Book with id ${req.params.articleId} not found!`)
      );
    }
  } catch (error) {
    next(error);
  }
});

articlesRouter.post("/:articleId/reviews", async (req, res, next) => {
  try {
    const newReview = {
      ...req.body,
      productId: req.params.articleId,
      id: uniqid(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const articleArray = await getArticles();
    const index = articleArray.findIndex(
      (article) => article.id === req.params.articleId
    );
    if (index !== -1) {
      const oldArticle = articleArray[index];
      const updatedArticle = {
        ...oldArticle,
        reviews: [...oldArticle.reviews, newReview],
      };
      articleArray[index] = updatedArticle;
      await writeArticles(articleArray);

      res.status(201).send({ id: newReview.id, newReview });
    }
  } catch (error) {
    console.log(error);
  }
});
articlesRouter.get("/:articleId/reviews", async (req, res, next) => {
  try {
    const articleArray = await getArticles();
    const index = articleArray.findIndex(
      (article) => article.id === req.params.articleId
    );

    res.send(articleArray[index].reviews);
  } catch (error) {
    next(error);
  }
});
export default articlesRouter;
