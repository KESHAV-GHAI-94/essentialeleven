import { prisma } from "../utils/prisma.js";

export class UserService {
  static async findByEmail(email) {
    return await prisma.user.findUnique({
      where: { email },
    });
  }

  static async createUser(data) {
    return await prisma.user.create({
      data: {
        email: data.email,
        name: data.name || data.email.split("@")[0],
        password: data.password,
      },
    });
  }

  static async findOrCreateUser(email) {
    const user = await this.findByEmail(email);
    if (user) return user;
    return await this.createUser({ email });
  }

  static async findOrCreateUserByPhone(phone) {
    const user = await prisma.user.findFirst({
      where: { phone },
    });
    
    if (user) return user;

    return await prisma.user.create({
      data: {
        phone,
        name: `User ${phone.slice(-4)}`,
        email: `${phone}@temp.e11.com`, // Place holder email
      },
    });
  }
}
