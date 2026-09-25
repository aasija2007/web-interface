import emailjs from '@emailjs/browser';

/**
 * Get EmailJS configuration from LocalStorage or default demo setup
 */
export function getEmailConfig() {
  const saved = localStorage.getItem('omnicall_email_settings');
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (e) {
      console.error('Error parsing email settings:', e);
    }
  }
  return {
    serviceId: 'service_gmail_default',
    templateId: 'template_contact_msg',
    publicKey: '',
    useDirectGmailWeb: true
  };
}

/**
 * Save EmailJS configuration
 */
export function saveEmailConfig(config) {
  localStorage.setItem('omnicall_email_settings', JSON.stringify(config));
}

/**
 * Send real email using EmailJS or open Gmail Web Compose window
 * @param {Object} params - { to_email, to_name, subject, message, from_name, reply_to }
 * @returns {Promise<{success: boolean, mode: string, message: string}>}
 */
export async function sendRealEmail(params) {
  const config = getEmailConfig();

  // If EmailJS PublicKey is provided, use real direct live SDK dispatch!
  if (config.publicKey && config.serviceId && config.templateId) {
    try {
      emailjs.init(config.publicKey);
      const response = await emailjs.send(
        config.serviceId,
        config.templateId,
        {
          to_email: params.to_email,
          to_name: params.to_name || 'Valued Contact',
          from_name: params.from_name || 'OmniCall User',
          subject: params.subject || 'Direct Message from Contact Manager',
          message: params.message || '',
          reply_to: params.reply_to || ''
        }
      );
      
      if (response.status === 200) {
        return {
          success: true,
          mode: 'emailjs',
          message: `Real email successfully dispatched to ${params.to_email} via EmailJS!`
        };
      }
    } catch (error) {
      console.warn('EmailJS direct send failed, using Gmail web compose fallback:', error);
    }
  }

  // Direct Gmail Web Compose URL (Opens real Gmail compose tab pre-filled!)
  const gmailWebUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(params.to_email)}&su=${encodeURIComponent(params.subject || '')}&body=${encodeURIComponent(params.message || '')}`;

  window.open(gmailWebUrl, '_blank', 'noopener,noreferrer');

  return {
    success: true,
    mode: 'gmail_web',
    message: `Opened direct Gmail compose tab for ${params.to_email}`
  };
}

/**
 * Open native OS Mail app via mailto: URI
 */
export function openNativeMailto(toEmail, subject = '', body = '') {
  const mailtoUri = `mailto:${encodeURIComponent(toEmail)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  window.location.href = mailtoUri;
}
