import Express from "express";
import createHttpError from "http-errors";
import { checkArticlesSchema, triggerBadRequest } from "./validation.js";

import ArticlesModel from "./model.js";
import q2m from "query-to-mongo";

const articlesRouter = Express.Router();

articlesRouter.post(
  "/",
  checkArticlesSchema,
  triggerBadRequest,
  async (req, res, next) => {
    try {
      const newArticle = new ArticlesModel(req.body);
      const { _id } = await newArticle.save();

      // sendsPostNoticationEmail(newArticle);
      res.status(201).send({ id: newArticle.id });
    } catch (error) {
      console.log(error);
    }
  }
);

articlesRouter.get("/", async (req, res, next) => {
  try {
    const mongoQuery = q2m(req.query);
    const filter = {};

    if (req.query.category) {
      filter.category = req.query.category;
    }

    if (req.query.price) {
      filter.price = { $lte: req.query.price };
    }

    const articles = await ArticlesModel.find(
      { ...mongoQuery.criteria, ...filter },
      mongoQuery.options.fields
    )
      .limit(mongoQuery.options.limit)
      .skip(mongoQuery.options.skip)
      .sort(mongoQuery.options.sort);

    const total = await ArticlesModel.countDocuments({
      ...mongoQuery.criteria,
      ...filter,
    });

    res.send({
      links: mongoQuery.links("http://localhost:3001/articles", total),
      total,
      numberOfPages: Math.ceil(total / mongoQuery.options.limit),
      articles,
    });
  } catch (error) {
    next(error);
  }
});

articlesRouter.get("/:articleId", async (req, res, next) => {
  try {
    const article = await ArticlesModel.findById(req.params.articleId);
    // .populate( path: "review", select: "comment rate" }

    if (article) {
      res.send(article);
    } else {
      next(
        createHttpError(
          404,
          `Article with id ${req.params.articleId} not found!`
        )
      );
    }
  } catch (error) {
    next(error);
  }
});

articlesRouter.put("/:articleId", async (req, res, next) => {
  try {
    const updatedArticle = await ArticlesModel.findByIdAndUpdate(
      req.params.articleId,
      req.body,
      { new: true, runValidators: true }
    );

    if (updatedArticle) {
      res.send(updatedArticle);
    } else {
      next(
        createHttpError(
          404,
          `Article with id ${req.params.articleId} not found!`
        )
      );
    }
  } catch (error) {
    next(error);
  }
});

articlesRouter.delete("/:articleId", async (req, res, next) => {
  try {
    const deletedArticle = await ArticlesModel.findByIdAndDelete(
      req.params.articleId
    );
    if (deletedArticle) {
      res.status(204).send();
    } else {
      next(
        createHttpError(
          404,
          `Article with id ${req.params.articleId} not found!`
        )
      );
    }
  } catch (error) {
    next(error);
  }
});

export default articlesRouter;
