import fs from "fs-extra";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const { readJSON, writeJSON, writeFile } = fs;

const dataFolderPath = join(
  dirname(fileURLToPath(import.meta.url)),
  "../api/data"
);
const reviewsJSONPath = join(dataFolderPath, "reviews.json");
const articlesJSONPath = join(dataFolderPath, "articles.json");
const articlesPublicFolderPath = join(process.cwd(), "./public/img/productImg");

export const getArticles = () => readJSON(articlesJSONPath);
export const writeArticles = (articlesArray) =>
  writeJSON(articlesJSONPath, articlesArray);
export const getReviews = () => readJSON(reviewsJSONPath);
export const writeReviews = (reviewsArray) =>
  writeJSON(reviewsJSONPath, reviewsArray);

export const saveArticlePic = (fileName, fileContentAsBuffer) =>
  writeFile(join(articlesPublicFolderPath, fileName), fileContentAsBuffer);
