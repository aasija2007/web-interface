// Web Audio API DTMF Tone Generator and Call Dispatcher

// Standard DTMF Frequencies (Hz)
const DTMF_FREQUENCIES = {
  '1': [697, 1209],
  '2': [697, 1336],
  '3': [697, 1477],
  '4': [770, 1209],
  '5': [770, 1336],
  '6': [770, 1477],
  '7': [852, 1209],
  '8': [852, 1336],
  '9': [852, 1477],
  '*': [941, 1209],
  '0': [941, 1336],
  '#': [941, 1477]
};

let audioCtx = null;

function getAudioContext() {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

/**
 * Play dual tone for a phone key press
 * @param {string} key - '0'-'9', '*', '#'
 * @param {number} duration - Tone duration in ms (default 180ms)
 */
export function playDtmfTone(key, duration = 180) {
  try {
    const freqs = DTMF_FREQUENCIES[key];
    if (!freqs) return;

    const ctx = getAudioContext();
    if (!ctx) return;

    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc1.type = 'sine';
    osc2.type = 'sine';

    osc1.frequency.setValueAtTime(freqs[0], ctx.currentTime);
    osc2.frequency.setValueAtTime(freqs[1], ctx.currentTime);

    // Soft volume curve to avoid clipping
    gainNode.gain.setValueAtTime(0.15, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration / 1000);

    osc1.connect(gainNode);
    osc2.connect(gainNode);
    gainNode.connect(ctx.destination);

    osc1.start();
    osc2.start();

    osc1.stop(ctx.currentTime + duration / 1000);
    osc2.stop(ctx.currentTime + duration / 1000);
  } catch (err) {
    console.warn('Audio tone play failed:', err);
  }
}

/**
 * Clean phone number string for dialing/links (remove spaces, hyphens, brackets)
 * @param {string} phone 
 * @returns {string}
 */
export function cleanPhoneNumber(phone) {
  if (!phone) return '';
  return phone.replace(/[^\d+]/g, '');
}

/**
 * Initiate real phone call via browser's native protocol (triggers phone/skype/OS dialer)
 * @param {string} phone 
 */
export function makePhoneCall(phone) {
  const cleanNumber = cleanPhoneNumber(phone);
  if (!cleanNumber) return false;
  window.location.href = `tel:${cleanNumber}`;
  return true;
}

/**
 * Launch WhatsApp Voice/Video Call or direct Chat link
 * @param {string} phone 
 * @param {string} message 
 */
export function launchWhatsApp(phone, message = '') {
  let cleanNumber = cleanPhoneNumber(phone);
  // Default country code handling if missing '+'
  if (!cleanNumber.startsWith('+') && cleanNumber.length === 10) {
    cleanNumber = '1' + cleanNumber; // or default clean format
  }
  // Strip leading plus for wa.me API
  const numOnly = cleanNumber.replace('+', '');
  
  const encodedMsg = encodeURIComponent(message);
  const waUrl = message 
    ? `https://wa.me/${numOnly}?text=${encodedMsg}`
    : `https://wa.me/${numOnly}`;

  window.open(waUrl, '_blank', 'noopener,noreferrer');
}

/**
 * Launch SMS app with pre-filled message
 * @param {string} phone 
 * @param {string} message 
 */
export function launchSms(phone, message = '') {
  const cleanNumber = cleanPhoneNumber(phone);
  const encodedMsg = encodeURIComponent(message);
  window.location.href = `sms:${cleanNumber}?body=${encodedMsg}`;
}
