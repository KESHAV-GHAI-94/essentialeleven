import dotenv from 'dotenv';
import fetch from 'node-fetch';

dotenv.config();

const accessToken = process.env.META_WHATSAPP_TOKEN;
const phoneNumberId = process.env.META_PHONE_NUMBER_ID;

// The test number you registered on Meta Dashboard
// Note: It must include the exact country code but NOT the '+' sign
const TO_PHONE = "917051023512"; // Update this!

async function testSMS() {
  console.log('Sending test message to WhatsApp via Meta...');

  console.log('Sending test message to WhatsApp via Meta...');

  try {
    const response = await fetch(`https://graph.facebook.com/v17.0/${phoneNumberId}/messages`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        to: TO_PHONE,
        type: "template",
        template: {
          name: "hello_world",
          language: { code: "en_US" }
        }
      }),
    });

    const data = await response.json();
    console.log("\nWhatsApp Response:", data);

    if (data.error) {
      console.log("\n❌ Message failed. Check the error above.");
    } else {
      console.log("\n✅ Success! Check your WhatsApp.");
    }

  } catch (err) {
    console.error("Test Script Error:", err);
  }
}

testSMS();
