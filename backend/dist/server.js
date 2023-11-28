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
const body_parser_1 = __importDefault(require("body-parser"));
const dotenv_1 = __importDefault(require("dotenv"));
const Routes_1 = __importDefault(require("./Routes"));
const ApiError_1 = __importDefault(require("./Errors/ApiError"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT;
// const connection = new DbConnection();
// connection.createPool();
// const pool = connection.getPool();
const jsonParser = body_parser_1.default.json();
Routes_1.default.forEach((Routes) => {
    const routes = new Routes([jsonParser]);
    app.use(routes.routerName, routes.getRoute());
});
app.get("*", (req, res, next) => {
    next(new ApiError_1.default(`NOT FOUND`, 404, false, `${req.originalUrl} not found. Or Incorrect path`));
});
app.use((err, req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // if (!errorHandler.isTrustedError(err)) {
    //   next(err);
    // }
    // await errorHandler.handleError(err);
    let statusCode = 500;
    let message = err.message;
    let data;
    if (err instanceof ApiError_1.default) {
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
}));
app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
