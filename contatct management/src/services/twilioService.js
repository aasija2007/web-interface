// Twilio Voice REST API Dispatcher for Real Mobile Phone Calls

/**
 * Get saved Twilio settings from LocalStorage
 */
export function getTwilioConfig() {
  const saved = localStorage.getItem('omnicall_twilio_settings');
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to parse Twilio config:', e);
    }
  }
  return {
    accountSid: '',
    authToken: '',
    fromTwilioNumber: '',
    twimlUrl: 'http://demo.twilio.com/docs/voice.xml'
  };
}

/**
 * Save Twilio settings
 */
export function saveTwilioConfig(config) {
  localStorage.setItem('omnicall_twilio_settings', JSON.stringify(config));
}

/**
 * Make an actual outbound phone call using Twilio Voice REST API
 * @param {string} toPhoneNumber - Destination mobile phone number (e.g. +1234567890)
 * @returns {Promise<{success: boolean, callSid?: string, mode: string, message: string}>}
 */
export async function triggerTwilioRealCall(toPhoneNumber) {
  const config = getTwilioConfig();

  // If Twilio credentials are configured, execute direct Twilio REST API call
  if (config.accountSid && config.authToken && config.fromTwilioNumber) {
    try {
      const endpoint = `https://api.twilio.com/2010-04-01/Accounts/${config.accountSid}/Calls.json`;
      
      const formData = new URLSearchParams();
      formData.append('To', toPhoneNumber);
      formData.append('From', config.fromTwilioNumber);
      formData.append('Url', config.twimlUrl || 'http://demo.twilio.com/docs/voice.xml');

      const basicAuth = btoa(`${config.accountSid}:${config.authToken}`);

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${basicAuth}`,
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: formData
      });

      const data = await response.json();

      if (response.ok && data.sid) {
        return {
          success: true,
          callSid: data.sid,
          mode: 'twilio_live',
          message: `Live Twilio call dispatched! Calling ${toPhoneNumber} from ${config.fromTwilioNumber} (Call SID: ${data.sid})`
        };
      } else {
        throw new Error(data.message || 'Twilio API call failed');
      }
    } catch (err) {
      console.warn('Twilio API call failed, falling back to native phone dialer:', err);
    }
  }

  // Fallback: Native Phone Dialer URI
  window.location.href = `tel:${toPhoneNumber.replace(/[^\d+]/g, '')}`;

  return {
    success: true,
    mode: 'native_tel',
    message: `Native dialer launched for ${toPhoneNumber}`
  };
}
