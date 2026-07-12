import nodemailer from 'nodemailer';
import { prisma, ServiceError } from '@paysphere/shared';

// Email transporter (configured via env)
const transporter = process.env.SMTP_HOST
  ? nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT) || 587,
      secure: false,
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    })
  : null;

/**
 * Internal: Create notification + send email.
 * Called by other services via POST /internal/send
 * Body: { userId, type, title, message, metadata? }
 */
export async function sendInternal(req, res) {
  const { userId, type, title, message, metadata } = req.body;

  const notification = await prisma.notification.create({
    data: { userId, type, title, message, metadata },
  });

  // Send email if SMTP is configured
  if (transporter) {
    try {
      const user = await prisma.user.findUnique({ where: { id: userId } });
      if (user?.email) {
        await transporter.sendMail({
          from: process.env.SMTP_FROM || 'noreply@paysphere.com',
          to: user.email,
          subject: title,
          text: message,
          html: `<h2>${title}</h2><p>${message}</p>`,
        });
      }
    } catch (err) {
      console.warn(`[notification-service] Email send failed: ${err.message}`);
    }
  }

  res.status(201).json({ message: 'Notification sent', notificationId: notification.id });
}

/**
 * GET /
 */
export async function getNotifications(req, res) {
  const page = parseInt(req.query.page) || 1;
  const limit = Math.min(parseInt(req.query.limit) || 20, 50);
  const unreadOnly = req.query.unread === 'true';

  const where = { userId: req.user.userId };
  if (unreadOnly) where.read = false;

  const [notifications, unreadCount] = await Promise.all([
    prisma.notification.findMany({
      where, orderBy: { createdAt: 'desc' }, skip: (page - 1) * limit, take: limit,
    }),
    prisma.notification.count({ where: { userId: req.user.userId, read: false } }),
  ]);

  res.json({ notifications, unreadCount, pagination: { page, limit } });
}

/**
 * POST /mark-read/:id
 */
export async function markAsRead(req, res) {
  const result = await prisma.notification.updateMany({
    where: { id: req.params.id, userId: req.user.userId },
    data: { read: true },
  });

  if (result.count === 0) {
    throw new ServiceError('Notification not found', 404, 'NOTIFICATION_NOT_FOUND');
  }

  res.json({ message: 'Notification marked as read' });
}

/**
 * POST /mark-all-read
 */
export async function markAllAsRead(req, res) {
  await prisma.notification.updateMany({
    where: { userId: req.user.userId, read: false },
    data: { read: true },
  });

  res.json({ message: 'All notifications marked as read' });
}

/**
 * DELETE /:id
 */
export async function deleteNotification(req, res) {
  await prisma.notification.deleteMany({
    where: { id: req.params.id, userId: req.user.userId },
  });

  res.json({ message: 'Notification deleted' });
}
