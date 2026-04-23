import { prisma } from "../utils/prisma.js";

export class NotificationController {
  static async create(data) {
    return await prisma.notification.create({
      data: {
        message: data.message,
        type: data.type,
        userId: data.userId || null
      }
    });
  }

  static async listAdminNotifications() {
    return await prisma.notification.findMany({
      where: { userId: null },
      orderBy: { createdAt: 'desc' },
      take: 20
    });
  }

  static async markAsRead(id) {
    return await prisma.notification.update({
      where: { id },
      data: { isRead: true }
    });
  }

  static async markAllAsRead() {
    return await prisma.notification.updateMany({
      where: { isRead: false },
      data: { isRead: true }
    });
  }
}
