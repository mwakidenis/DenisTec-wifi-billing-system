const AfricasTalking = require('africastalking');

class SMSService {
  private sms: any;

  constructor() {
    const africasTalking = AfricasTalking({
      apiKey: process.env.AFRICASTALKING_API_KEY!,
      username: process.env.AFRICASTALKING_USERNAME!
    });
    
    this.sms = africasTalking.SMS;
  }

  async sendSMS(to: string, message: string): Promise<boolean> {
    try {
      // Format phone number for Kenya
      const formattedPhone = this.formatPhoneNumber(to);
      
      const result = await this.sms.send({
        to: [formattedPhone],
        message: message,
        from: 'COLLOSPOT'
      });

      console.log('SMS sent successfully:', result);
      return true;
    } catch (error) {
      console.error('Failed to send SMS:', error);
      return false;
    }
  }

  async sendPaymentConfirmation(phone: string, amount: number, receiptNumber: string): Promise<boolean> {
    const message = `Payment confirmed! KES ${amount} received. Receipt: ${receiptNumber}. Your internet access is now active. - COLLOSPOT`;
    return await this.sendSMS(phone, message);
  }

  async sendSessionExpiry(phone: string, planName: string): Promise<boolean> {
    const message = `Your ${planName} internet session has expired. Visit our portal to purchase a new plan and continue browsing. - COLLOSPOT`;
    return await this.sendSMS(phone, message);
  }

  async sendWelcomeMessage(phone: string, firstName?: string): Promise<boolean> {
    const name = firstName ? ` ${firstName}` : '';
    const message = `Welcome${name} to COLLOSPOT! Your account has been created successfully. Connect to our WiFi and enjoy high-speed internet. - COLLOSPOT`;
    return await this.sendSMS(phone, message);
  }

  async sendOTP(phone: string, otp: string): Promise<boolean> {
    const message = `Your COLLOSPOT verification code is: ${otp}. This code expires in 10 minutes. Do not share this code with anyone.`;
    return await this.sendSMS(phone, message);
  }

  async sendLowBalanceAlert(phone: string, remainingTime: string): Promise<boolean> {
    const message = `Your internet session expires in ${remainingTime}. Top up now to avoid disconnection. Visit our portal to purchase more data. - COLLOSPOT`;
    return await this.sendSMS(phone, message);
  }

  async sendPasswordReset(phone: string, resetCode: string): Promise<boolean> {
    const message = `Your COLLOSPOT password reset code is: ${resetCode}. Use this code to reset your password. Code expires in 15 minutes.`;
    return await this.sendSMS(phone, message);
  }

  private formatPhoneNumber(phone: string): string {
    // Remove any non-digit characters
    phone = phone.replace(/\D/g, '');
    
    // Handle Kenyan phone numbers
    if (phone.startsWith('0')) {
      phone = '+254' + phone.slice(1);
    } else if (phone.startsWith('254')) {
      phone = '+' + phone;
    } else if (!phone.startsWith('+254')) {
      phone = '+254' + phone;
    }
    
    return phone;
  }

  // Bulk SMS for marketing/announcements
  async sendBulkSMS(phones: string[], message: string): Promise<{ success: number; failed: number }> {
    let success = 0;
    let failed = 0;

    for (const phone of phones) {
      const sent = await this.sendSMS(phone, message);
      if (sent) {
        success++;
      } else {
        failed++;
      }
      
      // Add delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    return { success, failed };
  }
}

export default new SMSService();