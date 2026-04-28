import nodemailer from 'nodemailer';
import PDFDocument from 'pdfkit';
import { prisma } from '../utils/prisma.js';
import { formatPhoneNumber } from '../utils/phone.js';

export class MailService {
  /**
   * Fetches the global mail and store settings from the database
   */
  static async getSettings() {
    try {
      const settings = await prisma.storeSettings.findUnique({
        where: { id: "global_settings" }
      });
      return settings || {
        storeName: "Eleven Essentials",
        storeEmail: process.env.GMAIL_USER,
        senderEmail: process.env.GMAIL_USER,
        senderName: "Eleven Essentials",
        senderPhone: "+91 98765 43210",
        whatsappNumber: "+91 98765 43210"
      };
    } catch (error) {
      console.error("Failed to fetch settings for mail:", error);
      return null;
    }
  }

  /**
   * Creates a transporter based on DB settings or falls back to ENV
   */
  static async getTransporter(settings) {
    if (settings?.smtpHost && settings?.smtpUser && settings?.smtpPass) {
      return nodemailer.createTransport({
        host: settings.smtpHost,
        port: settings.smtpPort || 587,
        secure: settings.smtpSecure || false,
        auth: {
          user: settings.smtpUser,
          pass: settings.smtpPass
        }
      });
    }

    // Default Fallback
    return nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD
      }
    });
  }
  /**
   * Sends an order confirmation email with a generated PDF invoice attached.
   */
  static async sendOrderConfirmation(email, orderDetails) {
    try {
      const settings = await this.getSettings();

      // Check toggle
      if (settings && settings.notifyOrderEmail === false) {
        console.log("Order confirmation email disabled in settings. Skipping.");
        return { success: true, skipped: true };
      }

      const transporter = await this.getTransporter(settings);

      const storeName = settings?.storeName || "Eleven Essentials";
      const senderName = settings?.senderName || storeName;
      const senderEmail = settings?.senderEmail || settings?.storeEmail || process.env.GMAIL_USER;
      const storePhone = formatPhoneNumber(settings?.senderPhone) || "+91 98765 43210";

      // 1. Generate PDF Invoice strictly in memory
      const doc = new PDFDocument({ margin: 50 });
      const buffers = [];
      doc.on('data', buffers.push.bind(buffers));

      const pdfPromise = new Promise((resolve) => {
        doc.on('end', () => {
          resolve(Buffer.concat(buffers));
        });
      });

      // Simple, clean Invoice layout
      doc.fontSize(24).fillColor('#0F172A').text('TAX INVOICE', { align: 'right' });
      doc.moveDown(0.5);
      doc.fontSize(20).fillColor('#F59E0B').text(storeName.toUpperCase(), { align: 'left' });
      doc.fontSize(10).fillColor('#94A3B8').text('Premium Lifestyle Essentials', { align: 'left' });
      doc.fontSize(10).fillColor('#475569').text(`Contact: ${storePhone} | ${senderEmail}`, { align: 'left' });
      doc.moveDown(2);

      doc.fontSize(12).fillColor('#475569');
      doc.text(`Invoice ID: #INV-${orderDetails.id.slice(-8).toUpperCase()}`);
      doc.text(`Date of Issue: ${new Date().toLocaleDateString()}`);
      doc.text(`Billed To: ${orderDetails.customerName || email}`);
      if (orderDetails.address) {
        doc.text(`Address: ${orderDetails.address}, ${orderDetails.city} - ${orderDetails.pincode}`);
      }
      if (orderDetails.phone) {
        doc.text(`Phone: ${orderDetails.phone}`);
      }
      doc.moveDown(2);

      doc.fontSize(14).fillColor('#0F172A').text('Order Summary', { underline: true });
      doc.moveDown(0.5);

      let yPosition = doc.y;
      doc.fontSize(12).fillColor('#475569');
      orderDetails.items.forEach(item => {
        doc.text(`${item.name} (Qty: ${item.quantity})`, 50, yPosition);
        doc.text(`INR ${item.price.toLocaleString()}`, 400, yPosition, { width: 100, align: 'right' });
        yPosition += 20;
      });

      doc.moveDown(2);
      // Ensure yPosition moves down appropriately before line
      doc.y = yPosition + 10;
      doc.moveTo(50, doc.y).lineTo(500, doc.y).strokeColor('#E2E8F0').stroke();
      doc.moveDown(1);

      doc.fontSize(16).fillColor('#0F172A').text(`Total Amount: INR ${orderDetails.total.toLocaleString()}`, { align: 'right' });
      doc.moveDown(4);
      doc.fontSize(10).fillColor('#94A3B8').text(`Thank you for shopping with ${storeName}.`, { align: 'center' });

      doc.end();

      const pdfBuffer = await pdfPromise;

      // 2. Send email with the embedded attachment
      const info = await transporter.sendMail({
        from: `"${senderName}" <${senderEmail}>`,
        to: email,
        subject: `✅ Order Confirmed — #${orderDetails.id.slice(-8).toUpperCase()}`,
        html: `
          <div style="font-family: 'Segoe UI', sans-serif; max-width: 600px; margin: auto; background: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #E2E8F0;">
            <!-- Header -->
            <div style="background: #0F172A; padding: 32px; text-align: center;">
              <h1 style="color: #F59E0B; margin: 0; font-size: 24px; letter-spacing: 2px;">${storeName.toUpperCase()}</h1>
              <p style="color: #94A3B8; margin: 8px 0 0; font-size: 12px; text-transform: uppercase; letter-spacing: 3px;">Premium Lifestyle Essentials</p>
            </div>
            
            <!-- Body -->
            <div style="padding: 32px;">
              <h2 style="color: #0F172A; margin: 0 0 8px;">Thank you for your order! 🎉</h2>
              <p style="color: #475569; line-height: 1.6;">Hi ${orderDetails.customerName || 'there'},</p>
              <p style="color: #475569; line-height: 1.6;">Your order <strong style="color: #0F172A;">#${orderDetails.id.slice(-8).toUpperCase()}</strong> has been confirmed and is being processed.</p>
              
              <!-- Order Items -->
              <div style="background: #F8FAFC; border-radius: 12px; padding: 20px; margin: 24px 0;">
                <h3 style="color: #0F172A; margin: 0 0 16px; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">Order Summary</h3>
                <table style="width: 100%; border-collapse: collapse;">
                  ${orderDetails.items.map(item => `
                    <tr style="border-bottom: 1px solid #E2E8F0;">
                      <td style="padding: 10px 0; color: #0F172A; font-weight: 600;">${item.name}</td>
                      <td style="padding: 10px 0; color: #64748B; text-align: center;">×${item.quantity}</td>
                      <td style="padding: 10px 0; color: #0F172A; font-weight: 700; text-align: right;">₹${item.price.toLocaleString()}</td>
                    </tr>
                  `).join('')}
                </table>
              </div>
              
              <!-- Total -->
              <div style="background: #0F172A; border-radius: 12px; padding: 20px; text-align: center;">
                <p style="color: #F59E0B; font-size: 11px; text-transform: uppercase; letter-spacing: 2px; margin: 0 0 4px;">Total Amount</p>
                <p style="color: #ffffff; font-size: 28px; font-weight: 800; margin: 0;">₹${orderDetails.total.toLocaleString()}</p>
              </div>
              
              <p style="color: #475569; line-height: 1.6; margin-top: 24px;">Please find your official tax invoice attached as a PDF to this email. We'll notify you once your items are shipped. 📦</p>
              
              <hr style="border: none; border-top: 1px solid #E2E8F0; margin: 24px 0;" />
              <p style="color: #94A3B8; font-size: 12px;">Best regards,<br/>The ${storeName} Team<br/>Contact: ${storePhone}</p>
            </div>
          </div>
        `,
        attachments: [
          {
            filename: `Invoice_${orderDetails.id.slice(-8).toUpperCase()}.pdf`,
            content: pdfBuffer,
            contentType: 'application/pdf'
          }
        ]
      });

      console.log("📧 Email with PDF sent:", info.messageId);
      return { success: true, messageId: info.messageId };
    } catch (err) {
      console.error("Mail Service Error:", err);
      return { success: false, error: err.message };
    }
  }

  /**
   * Sends a shipping confirmation email
   */
  static async sendShippingUpdate(email, orderDetails) {
    try {
      const settings = await this.getSettings();

      // Check toggle
      if (settings && settings.notifyShippedEmail === false) {
        console.log("Shipping update email disabled in settings. Skipping.");
        return { success: true, skipped: true };
      }

      const transporter = await this.getTransporter(settings);

      const storeName = settings?.storeName || "Eleven Essentials";
      const senderName = settings?.senderName || storeName;
      const senderEmail = settings?.senderEmail || settings?.storeEmail || process.env.GMAIL_USER;

      const info = await transporter.sendMail({
        from: `"${senderName}" <${senderEmail}>`,
        to: email,
        subject: `📦 Your order has been shipped! — #${orderDetails.id.slice(-8).toUpperCase()}`,
        html: `
          <div style="font-family: 'Segoe UI', sans-serif; max-width: 600px; margin: auto;">
            <div style="background: #0F172A; padding: 32px; text-align: center; border-radius: 16px 16px 0 0;">
              <h1 style="color: #F59E0B; margin: 0; font-size: 24px;">${storeName.toUpperCase()}</h1>
            </div>
            <div style="padding: 32px; background: #ffffff; border-radius: 0 0 16px 16px; border: 1px solid #E2E8F0; border-top: none;">
              <h2 style="color: #0F172A;">Your order is on its way! 🚚</h2>
              <p style="color: #475569;">Order <strong>#${orderDetails.id.slice(-8).toUpperCase()}</strong> has been shipped.</p>
              ${orderDetails.trackingId ? `<p style="color: #475569;">Tracking ID: <strong>${orderDetails.trackingId}</strong></p>` : ''}
              <p style="color: #94A3B8; font-size: 12px; margin-top: 24px;">— The ${storeName} Team</p>
            </div>
          </div>
        `,
      });

      return { success: true, messageId: info.messageId };
    } catch (err) {
      console.error("Mail Service Error:", err);
      return { success: false, error: err.message };
    }
  }
  /**
   * Sends a notification to the admin about a new order
   */
  static async sendAdminNotification(orderDetails) {
    try {
      const settings = await this.getSettings();

      // Check toggle (reusing notifyOrderEmail or we can assume admin always wants it if not specified, 
      // but let's stick to the settings if they exist)
      if (settings && settings.notifyOrderEmail === false) {
        console.log("Admin order notification disabled in settings. Skipping.");
        return { success: true, skipped: true };
      }

      const transporter = await this.getTransporter(settings);

      const storeName = settings?.storeName || "Eleven Essentials";
      const senderEmail = settings?.senderEmail || settings?.storeEmail || process.env.GMAIL_USER;

      const info = await transporter.sendMail({
        from: `"${storeName} System" <${senderEmail}>`,
        to: process.env.ADMIN_EMAIL || process.env.GMAIL_USER,
        subject: `🚨 NEW ORDER Alert — #${orderDetails.id.slice(-8).toUpperCase()}`,
        html: `
          <div style="font-family: sans-serif; background: #F8FAFC; padding: 40px;">
            <div style="max-width: 600px; margin: auto; background: #ffffff; border-radius: 8px; border: 1px solid #E2E8F0; overflow: hidden;">
              <div style="background: #0F172A; padding: 20px; text-align: center;">
                <h2 style="color: #F59E0B; margin: 0;">New Order Received</h2>
              </div>
              <div style="padding: 30px;">
                <h3 style="margin-top: 0;">Order Details</h3>
                <p><strong>Customer:</strong> ${orderDetails.customerName}</p>
                <p><strong>Email:</strong> ${orderDetails.email || 'N/A'}</p>
                <p><strong>Phone:</strong> ${orderDetails.phone || 'N/A'}</p>
                <p><strong>Address:</strong> ${orderDetails.address}, ${orderDetails.city} - ${orderDetails.pincode}</p>
                <hr style="border: none; border-top: 1px solid #E2E8F0; margin: 20px 0;"/>
                <table style="width: 100%;">
                  ${orderDetails.items.map(item => `
                    <tr>
                      <td style="padding: 5px 0;">${item.name} x ${item.quantity}</td>
                      <td style="text-align: right;">₹${item.price.toLocaleString()}</td>
                    </tr>
                  `).join('')}
                </table>
                <div style="margin-top: 20px; padding-top: 20px; border-top: 2px solid #0F172A; text-align: right;">
                  <span style="font-size: 18px; font-weight: bold;">Total: ₹${orderDetails.total.toLocaleString()}</span>
                </div>
                <div style="margin-top: 30px;">
                  <a href="${process.env.NEXTAUTH_URL}/admin/orders/${orderDetails.id}" style="background: #0F172A; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold; display: inline-block;">Manage Order</a>
                </div>
              </div>
            </div>
          </div>
        `
      });
      console.log("📢 Admin Notification Sent:", info.messageId);
      return { success: true };
    } catch (err) {
      console.error("Admin Notification Mail Error:", err);
      return { success: false };
    }
  }
}

