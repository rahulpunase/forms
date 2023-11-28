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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
class Session {
    constructor(prisma) {
        this.prisma = null;
        this.prisma = prisma;
    }
    getAllSessions() {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield ((_a = this.prisma) === null || _a === void 0 ? void 0 : _a.sessions.findMany());
            return data;
        });
    }
    createSession(userId, name, surname, email, deviceId = "test") {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const sessionId = crypto_1.default.randomBytes(6).toString("hex");
            const token = jsonwebtoken_1.default.sign({
                userId,
                name,
                surname,
                email,
                deviceId,
                sessionId,
            }, process.env.JSON_WEB_SECRET);
            yield ((_a = this.prisma) === null || _a === void 0 ? void 0 : _a.sessions.create({
                data: {
                    session_id: sessionId,
                    token,
                    is_active: "Y",
                    user_id: userId,
                    device_id: deviceId,
                },
            }));
            return token;
        });
    }
}
exports.default = Session;
