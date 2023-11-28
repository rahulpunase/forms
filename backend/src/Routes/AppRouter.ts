import { Router } from "express";

export default interface AppRouter {
  readonly routerName: string;
  getRoute: () => Router;
}
