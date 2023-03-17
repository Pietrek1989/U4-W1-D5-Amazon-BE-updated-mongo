import { checkSchema, validationResult } from "express-validator";
import createHttpError from "http-errors";

const articlesSchema = {
  name: {
    in: ["body"],
    isString: true,
    notEmpty: true,
    errorMessage: "Name is required and should be a string",
  },
  description: {
    in: ["body"],
    isString: true,
    notEmpty: true,
    errorMessage: "Description is required and should be a string",
  },
  brand: {
    in: ["body"],
    isString: true,
    notEmpty: true,
    errorMessage: "Brand is required and should be a string",
  },
  imageUrl: {
    in: ["body"],
    isURL: true,
    notEmpty: true,
    errorMessage: "Image URL is required and should be a valid URL",
  },
  price: {
    in: ["body"],
    isFloat: {
      options: { min: 0 },
      errorMessage: "Price should be a positive number",
    },
    notEmpty: true,
    errorMessage: "Price is required and should be a positive number",
  },
  category: {
    in: ["body"],
    isString: true,
    notEmpty: true,
    errorMessage: "Category is required and should be a string",
  },
};

export const checkArticlesSchema = checkSchema(articlesSchema);

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
