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
const bcrypt_1 = __importDefault(require("bcrypt"));
class PasswordController {
    constructor(prisma) {
        this.prisma = null;
        this.prisma = prisma;
    }
    updatePassword(userId, password) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            // update the old one
            yield ((_a = this.prisma) === null || _a === void 0 ? void 0 : _a.password.updateMany({
                where: {
                    user_id: userId,
                },
                data: {
                    is_active: "N",
                    updated_at: new Date(),
                },
            }));
            // create new
            const hashedPassword = yield bcrypt_1.default.hash(password, 10);
            yield ((_b = this.prisma) === null || _b === void 0 ? void 0 : _b.password.create({
                data: {
                    user_id: userId,
                    is_active: "Y",
                    password: hashedPassword,
                },
            }));
        });
    }
    createPassword(userId, password) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const hashedPassword = yield bcrypt_1.default.hash(password, 10);
            yield ((_a = this.prisma) === null || _a === void 0 ? void 0 : _a.password.create({
                data: {
                    user_id: userId,
                    is_active: "Y",
                    password: hashedPassword,
                },
            }));
        });
    }
    validatePassword(userId, password) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const passwordInDb = yield ((_a = this.prisma) === null || _a === void 0 ? void 0 : _a.password.findMany({
                where: {
                    user_id: userId,
                    is_active: "Y",
                },
            }));
            console.log({ passwordInDb });
            if (passwordInDb === null || passwordInDb === void 0 ? void 0 : passwordInDb[0].password) {
                const currentPassword = passwordInDb[0].password;
                if (currentPassword) {
                    return yield bcrypt_1.default.compare(password, currentPassword);
                }
            }
            return false;
        });
    }
}
exports.default = PasswordController;
