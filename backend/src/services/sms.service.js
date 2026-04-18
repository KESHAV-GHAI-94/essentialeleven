import dotenv from 'dotenv';
dotenv.config();

/**
 * Service to handle OTP generation and delivery via Twilio
 */
export class SmsService {
  /**
   * Sends a 6-digit OTP to a mobile number
   * @param {string} phone 
   * @returns {Promise<string>} The generated OTP (for development/mocking)
   */
  static async sendOTP(phone) {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Logic: In Production, we use Twilio. In Dev, we log to console.
    if (process.env.TWILIO_AUTH_TOKEN && process.env.TWILIO_ACCOUNT_SID) {
      console.log(`📲 Production: Sending OTP ${otp} via Twilio to ${phone}`);
      // Actual Twilio implementation would go here
    } else {
      console.log(`🧪 Development: [MOCK OTP] ${otp} for ${phone}`);
    }

    return otp;
  }
}
