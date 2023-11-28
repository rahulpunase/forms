import express, { Express, NextFunction, Request, Response } from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import Routes from "./Routes";
import APIError from "./Errors/ApiError";

dotenv.config();

const app: Express = express();
const port = process.env.PORT;

// const connection = new DbConnection();

// connection.createPool();
// const pool = connection.getPool();
const jsonParser = bodyParser.json();
Routes.forEach((Routes) => {
  const routes = new Routes([jsonParser]);
  app.use(routes.routerName, routes.getRoute());
});

app.get("*", (req: Request, res: Response, next: NextFunction) => {
  next(
    new APIError(
      `NOT FOUND`,
      404,
      false,
      `${req.originalUrl} not found. Or Incorrect path`
    )
  );
});

app.use(async (err: Error, req: Request, res: Response, next: NextFunction) => {
  // if (!errorHandler.isTrustedError(err)) {
  //   next(err);
  // }
  // await errorHandler.handleError(err);
  let statusCode = 500;
  let message = err.message;
  let data;
  if (err instanceof APIError) {
    statusCode = err.httpCode;
    message = err.message;
    data = err.data;
  }
  res.status(statusCode).send({
    success: false,
    status: statusCode,
    message: message,
    data: data,
  });
});

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
