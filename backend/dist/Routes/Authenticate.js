"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ExpressRouter_1 = __importDefault(require("./ExpressRouter"));
class Authenticate extends ExpressRouter_1.default {
    constructor() {
        super(...arguments);
        this.routerName = "authenticate";
    }
    getLoginRoute() {
        return this.router.post("/login", (req, res) => {
            res.json({
                message: "You are logged in!",
            });
        });
    }
    getAllRoutes() {
        return [this.getLoginRoute()];
    }
}
exports.default = Authenticate;
