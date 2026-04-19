export class WhatsAppService {
  static async sendOrderMessage(phone, orderId, total) {
    const accessToken = process.env.META_WHATSAPP_TOKEN;
    const phoneNumberId = process.env.META_PHONE_NUMBER_ID;

    if (!accessToken || !phoneNumberId) {
      console.warn("WhatsApp credentials missing. Skipping message.");
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
          to: phone,
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
