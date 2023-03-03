import { checkSchema, validationResult } from "express-validator";
import createHttpError from "http-errors";

const reviewsSchema = {
  comment: {
    in: ["body"],
    isString: true,
    notEmpty: true,
    errorMessage: "Comment is required and should be a string",
  },
  rate: {
    in: ["body"],
    isInt: {
      options: { min: 1, max: 5 },
      errorMessage: "Rate should be an integer between 1 and 5",
    },
    notEmpty: true,
    errorMessage: "Rate is required and should be an integer between 1 and 5",
  },
  productId: {
    in: ["body"],
    isString: true,
    notEmpty: true,
    errorMessage: "Product ID is required and should be a string",
  },
};
export const checkReviewsSchema = checkSchema(reviewsSchema);

export const triggerBadRequest = (req, res, next) => {
  const errors = validationResult(req);
  console.log(errors.array());
  if (errors.isEmpty()) {
    next();
  } else {
    next(
      createHttpError(400, "Errors during book validation", {
        errorsList: errors.array(),
      })
    );
  }
};
