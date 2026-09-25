import dotenv from 'dotenv';
dotenv.config();

/**
 * Real SMS & Multi-Gateway OTP Dispatch Service
 * Supports: Fast2SMS (India +91), 2Factor.in (India), Twilio (Global), Telegram Bot API, Custom Webhook, & Terminal Logger
 */
export async function sendSmsOtp(phoneNumber, otpCode) {
  const cleanPhone = String(phoneNumber).replace(/[^\d+]/g, '');
  const digitsOnly = cleanPhone.replace(/\D/g, '');
  const targetMobile = digitsOnly.length > 10 ? digitsOnly.slice(-10) : digitsOnly;
  const messageText = `[YatraFlow Security] Your official OTP verification code is ${otpCode}. Valid for 5 minutes. Do not share with anyone.`;

  console.log(`\n===================================================================`);
  console.log(`📱 [REAL SMS DISPATCH REQUEST]`);
  console.log(`- Recipient Phone Number: ${cleanPhone}`);
  console.log(`- Target Mobile (10-digit): ${targetMobile}`);
  console.log(`- Generated 6-Digit OTP: ${otpCode}`);
  console.log(`- Time Sent: ${new Date().toLocaleTimeString()}`);
  console.log(`===================================================================\n`);

  let sentSuccessfully = false;
  let providerUsed = 'Terminal Live Logger';
  let apiErrorMessage = '';

  // 1. Fast2SMS API Dispatch (India +91)
  if (process.env.FAST2SMS_API_KEY) {
    try {
      // First attempt: OTP route
      let response = await fetch('https://www.fast2sms.com/dev/bulkV2', {
        method: 'POST',
        headers: {
          'authorization': process.env.FAST2SMS_API_KEY,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          route: 'otp',
          variables_values: otpCode,
          numbers: targetMobile
        })
      });
      let data = await response.json();

      if (data.return) {
        sentSuccessfully = true;
        providerUsed = 'Fast2SMS Gateway (OTP Route)';
        console.log(`✅ [FAST2SMS DISPATCH SUCCESS] Real SMS delivered to +91 ${targetMobile}`);
      } else {
        console.log(`⚠️ [FAST2SMS OTP ROUTE FAILED] Retrying via Quick SMS Route...`, data.message || data);
        // Fallback attempt: Quick SMS route
        response = await fetch('https://www.fast2sms.com/dev/bulkV2', {
          method: 'POST',
          headers: {
            'authorization': process.env.FAST2SMS_API_KEY,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            route: 'q',
            message: messageText,
            language: 'english',
            numbers: targetMobile
          })
        });
        data = await response.json();
        if (data.return) {
          sentSuccessfully = true;
          providerUsed = 'Fast2SMS Gateway (Quick Route)';
          console.log(`✅ [FAST2SMS QUICK ROUTE SUCCESS] Real SMS delivered to +91 ${targetMobile}`);
        } else {
          apiErrorMessage = data.message || 'Fast2SMS API returned error.';
          console.error(`⚠️ [FAST2SMS QUICK ROUTE ERROR]`, data);
        }
      }
    } catch (err) {
      apiErrorMessage = err.message;
      console.error(`❌ [FAST2SMS DISPATCH FAILURE]`, err.message);
    }
  }

  // 2. 2Factor.in API Dispatch (India Instant OTP Gateway)
  if (!sentSuccessfully && process.env.TWO_FACTOR_API_KEY) {
    try {
      const apiKey = process.env.TWO_FACTOR_API_KEY;
      const url = `https://2factor.in/API/V1/${apiKey}/SMS/+91${targetMobile}/${otpCode}/YATRAFLOW`;
      const response = await fetch(url);
      const data = await response.json();

      if (data.Status === 'Success') {
        sentSuccessfully = true;
        providerUsed = '2Factor.in Instant SMS';
        console.log(`✅ [2FACTOR DISPATCH SUCCESS] Real SMS delivered to +91 ${targetMobile}`);
      } else {
        apiErrorMessage = data.Details || '2Factor API error.';
        console.error(`⚠️ [2FACTOR API RESPONSE ERROR]`, data);
      }
    } catch (err) {
      apiErrorMessage = err.message;
      console.error(`❌ [2FACTOR DISPATCH FAILURE]`, err.message);
    }
  }

  // 3. Twilio REST API Dispatch (Global numbers)
  if (!sentSuccessfully && process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN && process.env.TWILIO_PHONE_NUMBER) {
    try {
      const accountSid = process.env.TWILIO_ACCOUNT_SID;
      const authToken = process.env.TWILIO_AUTH_TOKEN;
      const twilioPhone = process.env.TWILIO_PHONE_NUMBER;
      const authHeader = 'Basic ' + Buffer.from(`${accountSid}:${authToken}`).toString('base64');

      const bodyParams = new URLSearchParams({
        To: cleanPhone.startsWith('+') ? cleanPhone : `+91${targetMobile}`,
        From: twilioPhone,
        Body: messageText
      });

      const response = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`, {
        method: 'POST',
        headers: {
          'Authorization': authHeader,
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: bodyParams.toString()
      });

      const data = await response.json();
      if (response.ok) {
        sentSuccessfully = true;
        providerUsed = 'Twilio SMS Gateway';
        console.log(`✅ [TWILIO DISPATCH SUCCESS] Real SMS delivered to ${cleanPhone}`);
      } else {
        apiErrorMessage = data.message || 'Twilio API error.';
        console.error(`⚠️ [TWILIO API RESPONSE ERROR]`, data);
      }
    } catch (err) {
      apiErrorMessage = err.message;
      console.error(`❌ [TWILIO DISPATCH FAILURE]`, err.message);
    }
  }

  // 4. Telegram Bot Dispatch (Instant Zero-Cost Push to Telegram Phone App)
  if (!sentSuccessfully && process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_CHAT_ID) {
    try {
      const botToken = process.env.TELEGRAM_BOT_TOKEN;
      const chatId = process.env.TELEGRAM_CHAT_ID;
      const telegramUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;
      const response = await fetch(telegramUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text: `📱 *[YatraFlow Security OTP Dispatch]*\n\nRecipient Phone: \`+91${targetMobile}\`\nVerification Code: *${otpCode}*\n\nValid for 5 minutes. Do not share with anyone.`,
          parse_mode: 'Markdown'
        })
      });
      const data = await response.json();
      if (data.ok) {
        sentSuccessfully = true;
        providerUsed = 'Telegram Instant Push Gateway';
        console.log(`✅ [TELEGRAM DISPATCH SUCCESS] Real OTP message pushed to Telegram Chat ${chatId}`);
      } else {
        apiErrorMessage = data.description || 'Telegram Bot error.';
        console.error(`⚠️ [TELEGRAM API ERROR]`, data);
      }
    } catch (err) {
      apiErrorMessage = err.message;
      console.error(`❌ [TELEGRAM DISPATCH FAILURE]`, err.message);
    }
  }

  // 5. Custom SMS Gateway Webhook
  if (!sentSuccessfully && process.env.SMS_WEBHOOK_URL) {
    try {
      const response = await fetch(process.env.SMS_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: cleanPhone,
          mobile: targetMobile,
          otp: otpCode,
          message: messageText,
          timestamp: new Date().toISOString()
        })
      });
      if (response.ok) {
        sentSuccessfully = true;
        providerUsed = 'Custom Webhook Gateway';
        console.log(`✅ [SMS WEBHOOK DISPATCH SUCCESS] Transmitted to webhook`);
      }
    } catch (err) {
      apiErrorMessage = err.message;
      console.error(`❌ [SMS WEBHOOK FAILURE]`, err.message);
    }
  }

  return {
    success: true,
    sentViaApi: sentSuccessfully,
    provider: providerUsed,
    phone: cleanPhone,
    otpCode: otpCode,
    apiError: apiErrorMessage,
    message: sentSuccessfully
      ? `Real verification code delivered to ${cleanPhone} via ${providerUsed}.`
      : `Verification code generated for ${cleanPhone}. Real SMS dispatch waiting for API keys.`
  };
}

