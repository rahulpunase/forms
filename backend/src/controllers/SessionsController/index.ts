import crypto from "crypto";
import jsonwebtoken from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

export default class Session {
  prisma: PrismaClient | null = null;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async getAllSessions() {
    const data = await this.prisma?.sessions.findMany();
    return data;
  }

  async createSession(
    userId: string,
    name: string,
    surname: string,
    email: string,
    deviceId: string = "test"
  ): Promise<string> {
    const sessionId = crypto.randomBytes(6).toString("hex");
    const token = jsonwebtoken.sign(
      {
        userId,
        name,
        surname,
        email,
        deviceId,
        sessionId,
      },
      process.env.JSON_WEB_SECRET as string
    );
    await this.prisma?.sessions.create({
      data: {
        session_id: sessionId,
        token,
        is_active: "Y",
        user_id: userId,
        device_id: deviceId,
      },
    });
    return token;
  }
}
