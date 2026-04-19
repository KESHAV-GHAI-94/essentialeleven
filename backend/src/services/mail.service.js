import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY || 're_placeholder');

export class MailService {
  static async sendOrderConfirmation(email, orderDetails) {
    try {
      const { data, error } = await resend.emails.send({
        from: 'Eleven Essentials <orders@elevenessentials.com>',
        to: [email],
        subject: `Order Confirmed! ${orderDetails.id}`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: auto;">
            <h1 style="color: #0F172A;">Thank you for your order!</h1>
            <p>Hi ${orderDetails.customerName},</p>
            <p>Your order <strong>${orderDetails.id}</strong> has been received and is being processed.</p>
            <hr />
            <h3>Order Summary</h3>
            <ul>
              ${orderDetails.items.map(item => `<li>${item.name} x ${item.quantity} - ₹${item.price}</li>`).join('')}
            </ul>
            <p><strong>Total Amount:</strong> ₹${orderDetails.total}</p>
            <hr />
            <p>We'll notify you once your items are shipped.</p>
            <p>Best regards,<br />The Eleven Essentials Team</p>
          </div>
        `,
      });

      if (error) {
        console.error("Resend Error:", error);
        return { success: false, error };
      }

      return { success: true, data };
    } catch (err) {
      console.error("Mail Service Exception:", err);
      return { success: false, error: err };
    }
  }
}
