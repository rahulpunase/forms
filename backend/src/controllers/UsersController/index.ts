import crypto from "crypto";
import { PrismaClient, users } from "@prisma/client";
import APIError from "../../Errors/ApiError";
import { HttpStatusCode } from "../../models";

export default class UsersController {
  prisma: PrismaClient | null = null;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async createUser(
    name: string,
    surname: string,
    email: string
  ): Promise<users> {
    const id = crypto.randomBytes(6).toString("hex");
    const user = await this.prisma?.users.create({
      data: {
        id,
        name,
        surname,
        email,
      },
    });
    if (!user) {
      throw new APIError(
        "User Not Found",
        HttpStatusCode.OK,
        false,
        "User not found"
      );
    }
    return user;
  }

  async getUserWithEmail(email: string): Promise<users> {
    const user = await this.prisma?.users.findUnique({
      where: {
        email,
      },
    });
    if (!user) {
      throw new APIError(
        "User Not Found",
        HttpStatusCode.OK,
        false,
        "User not found"
      );
    }
    return user;
  }

  async getUserWithUserId(userId: string): Promise<users> {
    const user = await this.prisma?.users.findUnique({
      where: {
        id: userId,
      },
    });
    if (!user) {
      throw new APIError(
        "User Not Found",
        HttpStatusCode.OK,
        false,
        "User not found"
      );
    }
    return user;
  }
}
