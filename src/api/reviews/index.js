import express from "express";
import createError from "http-errors";
import ReviewsModel from "./model.js";

const reviewsRouter = express.Router();

reviewsRouter.post("/", async (req, res, next) => {
  try {
    const newReview = new ReviewsModel(req.body);
    const { _id } = await newReview.save();
    res.status(201).send({ _id });
  } catch (error) {
    next(error);
  }
});

reviewsRouter.get("/", async (req, res, next) => {
  try {
    const reviews = await ReviewsModel.find().populate({
      path: "productId",
      select: "name",
    });
    res.send(reviews);
  } catch (error) {
    next(error);
  }
});

reviewsRouter.get("/:reviewId", async (req, res, next) => {
  try {
    const review = await ReviewsModel.findById(req.params.reviewId).populate({
      path: "productId",
      select: "name",
    });
    if (review) {
      res.send(review);
    } else {
      next(
        createError(404, `Review with id ${req.params.reviewId} not found!`)
      );
    }
  } catch (error) {
    next(error);
  }
});

reviewsRouter.put("/:reviewId", async (req, res, next) => {
  try {
    const updatedReview = await ReviewsModel.findByIdAndUpdate(
      req.params.reviewId,
      req.body,
      { new: true, runValidators: true }
    );
    if (updatedReview) {
      res.send(updatedReview);
    } else {
      next(
        createError(404, `Review with id ${req.params.reviewId} not found!`)
      );
    }
  } catch (error) {
    next(error);
  }
});

reviewsRouter.delete("/:reviewId", async (req, res, next) => {
  try {
    const deletedReview = await ReviewsModel.findByIdAndDelete(
      req.params.reviewId
    );
    if (deletedReview) {
      res.status(204).send();
    } else {
      next(
        createError(404, `Review with id ${req.params.reviewId} not found!`)
      );
    }
  } catch (error) {
    next(error);
  }
});

export default reviewsRouter;
