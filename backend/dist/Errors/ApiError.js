"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const models_1 = require("../models");
const BaseError_1 = __importDefault(require("./BaseError"));
class APIError extends BaseError_1.default {
    constructor(name, httpCode = models_1.HttpStatusCode.INTERNAL_SERVER, isOperational = true, description = "Internal server error", data = {}) {
        super(name, httpCode, isOperational, description, data);
    }
}
exports.default = APIError;
