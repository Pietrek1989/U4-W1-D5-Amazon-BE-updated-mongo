import Express from "express";
import listEndpoints from "express-list-endpoints";
import articlesRouter from "./api/articles/index.js";
import reviewsRouter from "./api/reviews/index.js";

import filesRouter from "./api/files/index.js";
import {
  genericErrorHandler,
  badRequestHandler,
  unauthorizedHandler,
  notfoundHandler,
} from "./errorsHandlers.js";
import cors from "cors";
import { join } from "path";

const server = Express();
const port = 3001;
const publicFolderPath = join(process.cwd(), "./public");

server.use(cors());
server.use(Express.static(publicFolderPath));
server.use(Express.json());
server.use("/articles", articlesRouter);
server.use("/reviews", reviewsRouter);
server.use("/files", filesRouter);

server.use(badRequestHandler);
server.use(unauthorizedHandler);
server.use(notfoundHandler);
server.use(genericErrorHandler);
server.listen(port, () => {
  console.table(listEndpoints(server));
  console.log(`Server is running on port ${port}`);
});
