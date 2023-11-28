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
const bcrypt_1 = __importDefault(require("bcrypt"));
const ApiError_1 = __importDefault(require("../../Errors/ApiError"));
const models_1 = require("../../models");
class Profile {
    constructor(prisma) {
        this.prisma = null;
        this.prisma = prisma;
    }
    createProfile(userId) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const profileId = crypto_1.default.randomBytes(6).toString("hex");
            yield ((_a = this.prisma) === null || _a === void 0 ? void 0 : _a.profile.create({
                data: {
                    profile_id: profileId,
                    is_active: "Y",
                    user_id: userId,
                },
            }));
            return profileId;
        });
    }
    getProfileWithUserId(userId) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const profile = yield ((_a = this.prisma) === null || _a === void 0 ? void 0 : _a.profile.findUnique({
                    where: {
                        user_id: userId,
                    },
                }));
                if (!profile) {
                    throw new ApiError_1.default("Not Found", models_1.HttpStatusCode.OK, false, "Profile not found with userId");
                }
                return profile;
            }
            catch (e) {
                throw new ApiError_1.default("Not Found", models_1.HttpStatusCode.OK, false, "Profile not found with userId");
            }
        });
    }
    resetPasswordFailureAttemptToZero(profile) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            return yield ((_a = this.prisma) === null || _a === void 0 ? void 0 : _a.profile.update({
                where: {
                    profile_id: profile.profile_id,
                },
                data: {
                    password_failure_attempt: 0,
                    is_active: "Y",
                },
            }));
        });
    }
    updatePassword(profile, updatePasswordCode, password) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            if (profile.update_password_code !== Number(updatePasswordCode)) {
                throw new ApiError_1.default("Failed", models_1.HttpStatusCode.BAD_REQUEST, false, "Update password code did not match.");
            }
            if (profile.is_password_change_required !== "Y") {
                throw new ApiError_1.default("Failed", models_1.HttpStatusCode.BAD_REQUEST, false, "Cannot update password.");
            }
            const hashedPassword = yield bcrypt_1.default.hash(password, 10);
            return yield ((_a = this.prisma) === null || _a === void 0 ? void 0 : _a.profile.update({
                where: {
                    profile_id: profile.profile_id,
                },
                data: {
                    is_password_change_required: "N",
                    update_password_code: null,
                    is_active: "Y",
                    updated_at: new Date(),
                    password_failure_attempt: 0,
                },
            }));
        });
    }
    increasePasswordFailedAttempt(profile) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const newLockedCount = (profile.password_failure_attempt || 0) + 1;
            const isNewLockedCountReached = newLockedCount === Profile.PROFILE_LOCKED_COUNT;
            return yield ((_a = this.prisma) === null || _a === void 0 ? void 0 : _a.profile.update({
                where: {
                    profile_id: profile.profile_id,
                },
                data: Object.assign({ password_failure_attempt: newLockedCount }, (isNewLockedCountReached
                    ? {
                        is_active: "N",
                    }
                    : {})),
            }));
        });
    }
}
Profile.PROFILE_LOCKED_COUNT = 3;
exports.default = Profile;
