// Web Push / Native Browser Notification Service for Weather Pulse

export async function requestNotificationPermission() {
  if (!('Notification' in window)) {
    console.warn('This browser does not support desktop notifications');
    return 'unsupported';
  }

  if (Notification.permission === 'granted') {
    return 'granted';
  }

  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    return permission;
  }

  return 'denied';
}

export function sendNativeWeatherNotification(title, body, tag = 'weather-pulse-alert') {
  if (!('Notification' in window) || Notification.permission !== 'granted') {
    return false;
  }

  try {
    const options = {
      body,
      icon: 'https://img.icons8.com/color/192/000000/weather--v1.png',
      tag,
      renotify: true,
      requireInteraction: true,
    };

    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      navigator.serviceWorker.ready.then((registration) => {
        registration.showNotification(`⚡ ${title}`, options);
      });
    } else {
      new Notification(`⚡ ${title}`, options);
    }
    return true;
  } catch (e) {
    console.error('Failed to dispatch notification:', e);
    return false;
  }
}

// Automatically check severe alerts from pulseAI and dispatch browser notifications
export function checkAndTriggerSevereAlerts(alerts = []) {
  if (!alerts || alerts.length === 0) return;

  alerts.forEach((alert) => {
    sendNativeWeatherNotification(alert.title, alert.message, `alert-${alert.title.toLowerCase().replace(/\s+/g, '-')}`);
  });
}
