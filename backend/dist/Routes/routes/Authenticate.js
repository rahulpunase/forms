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
const models_1 = require("../../models");
const client_1 = require("@prisma/client");
const utils_1 = require("../../utils");
const ExpressRouter_1 = __importDefault(require("../ExpressRouter"));
const ApiError_1 = __importDefault(require("../../Errors/ApiError"));
const UsersController_1 = __importDefault(require("../../controllers/UsersController"));
const SessionsController_1 = __importDefault(require("../../controllers/SessionsController"));
const ProfileController_1 = __importDefault(require("../../controllers/ProfileController"));
const PasswordController_1 = __importDefault(require("../../controllers/PasswordController"));
class Authenticate extends ExpressRouter_1.default {
    constructor(middlewares) {
        super("/authenticate", middlewares);
        this.prisma = new client_1.PrismaClient();
        this.getLoginRoute();
        this.getRegisterRoute();
        this.getTestRoute();
        this.getLoginRoute();
        this.updatePassword();
    }
    getLoginRoute() {
        this.post("/login", (req, res) => __awaiter(this, void 0, void 0, function* () {
            const body = req.body;
            const notAvailable = (0, utils_1.notAvailableValidate)(body, ["email", "password"]);
            if (notAvailable) {
                throw new ApiError_1.default("Incorrect info", models_1.HttpStatusCode.OK, false, "Incorrect information provided.");
            }
            const userController = new UsersController_1.default(this.prisma);
            const user = yield userController.getUserWithEmail(body.email);
            const profileController = new ProfileController_1.default(this.prisma);
            const profile = yield profileController.getProfileWithUserId(user.id);
            if (Number(profile.password_failure_attempt) ===
                ProfileController_1.default.PROFILE_LOCKED_COUNT) {
                throw new ApiError_1.default("Incorrect info", models_1.HttpStatusCode.BAD_REQUEST, false, "Your profile is locked");
            }
            const passwordController = new PasswordController_1.default(this.prisma);
            const isPasswordMatched = yield passwordController.validatePassword(user.id, body.password);
            if (!isPasswordMatched) {
                const updatedProfile = yield profileController.increasePasswordFailedAttempt(profile);
                throw new ApiError_1.default("Incorrect info", models_1.HttpStatusCode.OK, false, "Incorrect password.", { profile_failure_count: updatedProfile === null || updatedProfile === void 0 ? void 0 : updatedProfile.password_failure_attempt });
            }
            const sessionController = new SessionsController_1.default(this.prisma);
            const token = yield sessionController.createSession(user.id, body.name, body.surname, body.email, "test");
            // on successfully logged in
            yield profileController.resetPasswordFailureAttemptToZero(profile);
            res.cookie("srftoken", token);
            res.send({
                data: {
                    userId: user.id,
                    email: user.email,
                    token: token,
                },
                success: true,
            });
        }));
    }
    getRegisterRoute() {
        this.post("/register", (req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            const body = req.body;
            const notAvailable = (0, utils_1.notAvailableValidate)(body, [
                "name",
                "surname",
                "email",
                "password",
            ]);
            if (notAvailable) {
                throw new ApiError_1.default("Incorrect info", models_1.HttpStatusCode.OK, false, `Missing information ${notAvailable}`);
            }
            const userController = new UsersController_1.default(this.prisma);
            const sessionController = new SessionsController_1.default(this.prisma);
            const profileController = new ProfileController_1.default(this.prisma);
            const passwordController = new PasswordController_1.default(this.prisma);
            const deviceId = (_a = body.deviceId) !== null && _a !== void 0 ? _a : "test";
            const data = yield this.prisma.$transaction((tx) => __awaiter(this, void 0, void 0, function* () {
                const createdUser = yield userController.createUser(body.name, body.surname, body.email);
                yield profileController.createProfile(createdUser.id);
                yield passwordController.createPassword(createdUser.id, body.password);
                const token = yield sessionController.createSession(createdUser.id, body.name, body.surname, body.email, deviceId);
                return {
                    userId: createdUser.id,
                    email: createdUser.email,
                    token: token,
                };
            }));
            res.send({
                data,
                success: true,
            });
        }));
    }
    forgotPasswordRoute() {
        this.post("/forgot-password", (req, res) => __awaiter(this, void 0, void 0, function* () {
            const body = req.body;
        }));
    }
    updatePassword() {
        this.post("/update-password", (req, res) => __awaiter(this, void 0, void 0, function* () {
            const body = req.body;
            const userController = new UsersController_1.default(this.prisma);
            const profileController = new ProfileController_1.default(this.prisma);
            const notAvailable = (0, utils_1.notAvailableValidate)(body, [
                "userId",
                "password",
                "passwordCode",
            ]);
            if (notAvailable) {
                throw new ApiError_1.default("Incorrect info", models_1.HttpStatusCode.BAD_REQUEST, false, `Insufficient data ${notAvailable} not provided`);
            }
            yield this.prisma.$transaction((tx) => __awaiter(this, void 0, void 0, function* () {
                const user = yield userController.getUserWithUserId(body.userId);
                const passwordController = new PasswordController_1.default(this.prisma);
                yield passwordController.updatePassword(user.id, body.password);
            }));
            res.send({
                status: true,
                message: "Successfully updated password!",
            });
        }));
    }
    getTestRoute() {
        this.get("/test", (req, res) => {
            throw new Error("oops");
        });
    }
}
exports.default = Authenticate;
