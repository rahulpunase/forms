import crypto from "crypto";
import bcrypt from "bcrypt";
import { PrismaClient, profile } from "@prisma/client";
import APIError from "../../Errors/ApiError";
import { HttpStatusCode } from "../../models";

export default class Profile {
  prisma: PrismaClient | null = null;

  static readonly PROFILE_LOCKED_COUNT = 3;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async createProfile(userId: string): Promise<string> {
    const profileId = crypto.randomBytes(6).toString("hex");
    await this.prisma?.profile.create({
      data: {
        profile_id: profileId,
        is_active: "Y",
        user_id: userId,
      },
    });

    return profileId;
  }

  async getProfileWithUserId(userId: string): Promise<profile> {
    try {
      const profile = await this.prisma?.profile.findUnique({
        where: {
          user_id: userId,
        },
      });
      if (!profile) {
        throw new APIError(
          "Not Found",
          HttpStatusCode.OK,
          false,
          "Profile not found with userId"
        );
      }
      return profile;
    } catch (e) {
      throw new APIError(
        "Not Found",
        HttpStatusCode.OK,
        false,
        "Profile not found with userId"
      );
    }
  }

  async resetPasswordFailureAttemptToZero(profile: profile) {
    return await this.prisma?.profile.update({
      where: {
        profile_id: profile.profile_id,
      },
      data: {
        password_failure_attempt: 0,
        is_active: "Y",
      },
    });
  }

  async updatePassword(
    profile: profile,
    updatePasswordCode: number,
    password: string
  ) {
    if (profile.update_password_code !== Number(updatePasswordCode)) {
      throw new APIError(
        "Failed",
        HttpStatusCode.BAD_REQUEST,
        false,
        "Update password code did not match."
      );
    }
    if (profile.is_password_change_required !== "Y") {
      throw new APIError(
        "Failed",
        HttpStatusCode.BAD_REQUEST,
        false,
        "Cannot update password."
      );
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    return await this.prisma?.profile.update({
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
    });
  }

  async increasePasswordFailedAttempt(profile: profile) {
    const newLockedCount = (profile.password_failure_attempt || 0) + 1;
    const isNewLockedCountReached =
      newLockedCount === Profile.PROFILE_LOCKED_COUNT;
    return await this.prisma?.profile.update({
      where: {
        profile_id: profile.profile_id,
      },
      data: {
        password_failure_attempt: newLockedCount,
        ...(isNewLockedCountReached
          ? {
              is_active: "N",
            }
          : {}),
      },
    });
  }
}
