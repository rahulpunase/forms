"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
class ExpressRouter {
    constructor(routerName, middlewares) {
        this.middlewares = [];
        this.router = router;
        this.routerName = routerName;
        this.middlewares = middlewares;
    }
    get(url, callBack) {
        this.router.get(url, this.middlewares, this.catchAsync(callBack));
    }
    post(url, callBack) {
        this.router.post(url, this.middlewares, this.catchAsync(callBack));
    }
    catchAsync(fn) {
        return (req, res, next) => {
            fn(req, res, next).catch((e) => __awaiter(this, void 0, void 0, function* () {
                next(e);
            }));
        };
    }
    getRoute() {
        return this.router;
    }
}
exports.default = ExpressRouter;
