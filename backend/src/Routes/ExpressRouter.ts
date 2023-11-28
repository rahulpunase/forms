import express, { NextFunction, Request, Response, Router } from "express";
import AppRouter from "./AppRouter";
import { PrismaClient } from "@prisma/client";

const router = express.Router();

class ExpressRouter implements AppRouter {
  router: Router;

  routerName: string;

  middlewares: Array<any> = [];

  constructor(routerName: string, middlewares: Array<any>) {
    this.router = router;
    this.routerName = routerName;
    this.middlewares = middlewares;
  }

  get(
    url: string,
    callBack: (req: Request, res: Response, next: NextFunction) => Promise<any>
  ) {
    this.router.get(url, this.middlewares, this.catchAsync(callBack));
  }

  post(
    url: string,
    callBack: (req: Request, res: Response, next: NextFunction) => Promise<any>
  ) {
    this.router.post(url, this.middlewares, this.catchAsync(callBack));
  }

  private catchAsync(
    fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
  ) {
    return (req: Request, res: Response, next: NextFunction) => {
      fn(req, res, next).catch(async (e) => {
        next(e);
      });
    };
  }

  getRoute() {
    return this.router;
  }
}

export default ExpressRouter;
