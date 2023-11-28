import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

export default class PasswordController {
  prisma: PrismaClient | null = null;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async updatePassword(userId: string, password: string) {
    // update the old one
    await this.prisma?.password.updateMany({
      where: {
        user_id: userId,
      },
      data: {
        is_active: "N",
        updated_at: new Date(),
      },
    });

    // create new
    const hashedPassword = await bcrypt.hash(password, 10);

    await this.prisma?.password.create({
      data: {
        user_id: userId,
        is_active: "Y",
        password: hashedPassword,
      },
    });
  }

  async createPassword(userId: string, password: string) {
    const hashedPassword = await bcrypt.hash(password, 10);

    await this.prisma?.password.create({
      data: {
        user_id: userId,
        is_active: "Y",
        password: hashedPassword,
      },
    });
  }

  async validatePassword(userId: string, password: string): Promise<boolean> {
    const passwordInDb = await this.prisma?.password.findMany({
      where: {
        user_id: userId,
        is_active: "Y",
      },
    });
    console.log({ passwordInDb });
    if (passwordInDb?.[0].password) {
      const currentPassword = passwordInDb[0].password;
      if (currentPassword) {
        return await bcrypt.compare(password, currentPassword);
      }
    }
    return false;
  }
}
