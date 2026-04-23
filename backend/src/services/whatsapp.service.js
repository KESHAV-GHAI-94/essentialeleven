import { prisma } from '../utils/prisma.js';

export class WhatsAppService {
  static async sendOrderMessage(phone, orderId, total) {
    // 1. Fetch Settings & Check Toggle
    const settings = await prisma.storeSettings.findUnique({
      where: { id: "global_settings" }
    });

    if (settings && settings.notifyOrderWhatsapp === false) {
      console.log("WhatsApp notifications disabled in settings. Skipping.");
      return { success: true, skipped: true };
    }

    const accessToken = process.env.META_WHATSAPP_TOKEN;
    const phoneNumberId = process.env.META_PHONE_NUMBER_ID;

    if (!accessToken || !phoneNumberId) {
      console.warn("WhatsApp credentials (META_TOKEN / ID) missing in ENV. Skipping.");
      return { success: false, message: "Credentials missing" };
    }

    try {
      const response = await fetch(`https://graph.facebook.com/v17.0/${phoneNumberId}/messages`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messaging_product: "whatsapp",
          to: phone.toString(),
          type: "template",
          template: {
            name: "order_confirmation",
            language: { code: "en_US" },
            components: [
              {
                type: "body",
                parameters: [
                  { type: "text", text: orderId },
                  { type: "text", text: `₹${total}` }
                ]
              }
            ]
          }
        }),
      });

      const data = await response.json();
      return { success: true, data };
    } catch (err) {
      console.error("WhatsApp Service Error:", err);
      return { success: false, error: err };
    }
  }
}
