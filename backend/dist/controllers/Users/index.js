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
const crypto_1 = __importDefault(require("crypto"));
const ApiError_1 = __importDefault(require("../../Errors/ApiError"));
const models_1 = require("../../models");
class Users {
    constructor(prisma) {
        this.prisma = null;
        this.prisma = prisma;
    }
    createUser(name, surname, email) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const id = crypto_1.default.randomBytes(6).toString("hex");
            const user = yield ((_a = this.prisma) === null || _a === void 0 ? void 0 : _a.users.create({
                data: {
                    id,
                    name,
                    surname,
                    email,
                },
            }));
            return user;
        });
    }
    getUserWithEmail(email) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield ((_a = this.prisma) === null || _a === void 0 ? void 0 : _a.users.findUnique({
                    where: {
                        email,
                    },
                }));
                if (!user) {
                    throw new ApiError_1.default("User Not Found", models_1.HttpStatusCode.OK, false, "User not found");
                }
                return user;
            }
            catch (e) {
                throw new ApiError_1.default("User Not Found", models_1.HttpStatusCode.OK, false, "User not found");
            }
        });
    }
    getUserWithUserId(userId) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield ((_a = this.prisma) === null || _a === void 0 ? void 0 : _a.users.findUnique({
                    where: {
                        id: userId,
                    },
                }));
                if (!user) {
                    throw new ApiError_1.default("User Not Found", models_1.HttpStatusCode.OK, false, "User not found");
                }
                return user;
            }
            catch (e) {
                throw new ApiError_1.default("User Not Found", models_1.HttpStatusCode.OK, false, "User not found");
            }
        });
    }
}
exports.default = Users;
