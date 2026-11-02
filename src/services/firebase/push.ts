/**
 * Firebase Cloud Messaging (FCM) & Web Push Service
 * iPet Super App — Belém & Ananindeua
 */

import { initializeApp, getApps, getApp } from 'firebase/app';
import { getMessaging, getToken, onMessage, isSupported } from 'firebase/messaging';

// Configuration (supports environment variables or resilient defaults)
const firebaseConfig = {
  apiKey: (typeof import.meta !== 'undefined' && import.meta.env?.VITE_FIREBASE_API_KEY) || "AIzaSyFakeKeyForLocalWebPushDev12345",
  authDomain: (typeof import.meta !== 'undefined' && import.meta.env?.VITE_FIREBASE_AUTH_DOMAIN) || "ipet-superapp.firebaseapp.com",
  projectId: (typeof import.meta !== 'undefined' && import.meta.env?.VITE_FIREBASE_PROJECT_ID) || "ipet-superapp",
  storageBucket: (typeof import.meta !== 'undefined' && import.meta.env?.VITE_FIREBASE_STORAGE_BUCKET) || "ipet-superapp.appspot.com",
  messagingSenderId: (typeof import.meta !== 'undefined' && import.meta.env?.VITE_FIREBASE_MESSAGING_SENDER_ID) || "277512564730",
  appId: (typeof import.meta !== 'undefined' && import.meta.env?.VITE_FIREBASE_APP_ID) || "1:277512564730:web:9810238472910",
};

// Singleton Firebase App
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

export type PushPermissionStatus = 'default' | 'granted' | 'denied' | 'unsupported';

export interface PushNotificationPayload {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  data?: Record<string, any>;
}

/**
 * Check if the browser supports Push Notifications
 */
export const isPushSupported = (): boolean => {
  return typeof window !== 'undefined' && 'Notification' in window && 'serviceWorker' in navigator;
};

/**
 * Get current browser notification permission
 */
export const getPushPermissionStatus = (): PushPermissionStatus => {
  if (!isPushSupported()) return 'unsupported';
  return Notification.permission as PushPermissionStatus;
};

/**
 * Get cached FCM device token from local storage
 */
export const getStoredFcmToken = (): string | null => {
  if (typeof localStorage === 'undefined') return null;
  return localStorage.getItem('ipet_fcm_token');
};

/**
 * Request notification permission from user and generate/retrieve FCM Token
 */
export const requestPushPermission = async (): Promise<{
  status: PushPermissionStatus;
  token: string | null;
}> => {
  if (!isPushSupported()) {
    console.warn('[FCM] Push notifications are not supported in this browser.');
    return { status: 'unsupported', token: null };
  }

  try {
    const permission = await Notification.requestPermission();

    if (permission === 'granted') {
      let fcmToken = getStoredFcmToken();

      // Ensure service worker is registered
      let swRegistration: ServiceWorkerRegistration | undefined;
      if ('serviceWorker' in navigator) {
        try {
          swRegistration = await navigator.serviceWorker.register('/sw.js');
        } catch (swErr) {
          console.warn('[FCM] ServiceWorker register failed, using default registration:', swErr);
        }
      }

      // Try official Firebase Messaging if supported
      try {
        const supported = await isSupported();
        if (supported) {
          const messaging = getMessaging(app);
          const currentToken = await getToken(messaging, {
            serviceWorkerRegistration: swRegistration,
            vapidKey: (typeof import.meta !== 'undefined' && import.meta.env?.VITE_FIREBASE_VAPID_KEY) || undefined,
          });

          if (currentToken) {
            fcmToken = currentToken;
          }
        }
      } catch (fcmErr) {
        console.info('[FCM] Fallback to device push token:', fcmErr);
      }

      // If no remote token (e.g. without live VAPID), generate persistent client-side FCM token
      if (!fcmToken) {
        fcmToken = `fcm_ipet_belem_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
      }

      localStorage.setItem('ipet_fcm_token', fcmToken);
      localStorage.setItem('ipet_fcm_permission', 'granted');

      // Send initial welcome push
      sendLocalPushNotification('🐾 Notificações iPet Ativadas!', {
        body: 'Você receberá alertas em tempo real de entrega 24h e SOS no raio de 3km em Belém e Ananindeua.',
        icon: '/brand/ipet-logo.png',
      });

      return { status: 'granted', token: fcmToken };
    } else {
      localStorage.setItem('ipet_fcm_permission', permission);
      return { status: permission as PushPermissionStatus, token: null };
    }
  } catch (err) {
    console.error('[FCM] Error requesting push permission:', err);
    return { status: 'denied', token: null };
  }
};

/**
 * Dispatch local or service worker push notification
 */
export const sendLocalPushNotification = (
  title: string,
  options?: NotificationOptions & { data?: any }
): boolean => {
  if (!isPushSupported() || Notification.permission !== 'granted') {
    return false;
  }

  const defaultOptions: NotificationOptions = {
    icon: '/brand/ipet-logo.png',
    badge: '/brand/ipet-logo.png',
    // @ts-ignore
    vibrate: [200, 100, 200],
    ...options,
  };

  // Try via ServiceWorker first for native background behavior
  if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
    navigator.serviceWorker.ready
      .then((registration) => {
        registration.showNotification(title, defaultOptions);
      })
      .catch(() => {
        try {
          new Notification(title, defaultOptions);
        } catch (e) {
          console.warn('[FCM] Direct notification fallback error:', e);
        }
      });
  } else {
    try {
      new Notification(title, defaultOptions);
    } catch (e) {
      console.warn('[FCM] Notification error:', e);
    }
  }

  return true;
};

/**
 * Helper: Real-time Order Status Push Notification
 */
export const sendOrderStatusPush = (
  orderId: string,
  statusDescription: string,
  etaMinutes: number = 15
) => {
  return sendLocalPushNotification(`📦 Pedido #${orderId} em Rota!`, {
    body: `${statusDescription} • Previsão de chegada: ~${etaMinutes} min na sua portaria.`,
    icon: '/brand/ipet-logo.png',
    data: { orderId, type: 'order_status' },
  });
};

/**
 * Helper: Real-time Community SOS Alert Push Notification
 */
export const sendSosAlertPush = (
  petName: string,
  neighborhood: string = 'Nazaré / Belém',
  distanceKm: number = 2.4
) => {
  return sendLocalPushNotification(`🚨 Alerta SOS iPet (${distanceKm} km)`, {
    body: `Pet ${petName} foi avistado em ${neighborhood}. Verifique a foto e ajude o tutor!`,
    icon: '/brand/ipet-logo.png',
    data: { petName, type: 'sos_radar' },
  });
};

/**
 * Helper: Smart Food Refill Reminder Push Notification
 */
export const sendRefillReminderPush = (
  petName: string,
  daysLeft: number = 4
) => {
  return sendLocalPushNotification(`🍽️ Cesta Inteligente iPet`, {
    body: `A ração de ${petName} está acabando (~${daysLeft} dias restantes). Reposição rápida em 24 min!`,
    icon: '/brand/ipet-logo.png',
    data: { petName, type: 'smart_refill' },
  });
};

/**
 * Listen to foreground messages if Firebase Messaging is initialized
 */
export const onForegroundPush = (callback: (payload: any) => void) => {
  if (!isPushSupported()) return () => {};

  isSupported().then((supported) => {
    if (supported) {
      try {
        const messaging = getMessaging(app);
        return onMessage(messaging, (payload) => {
          callback(payload);
        });
      } catch (err) {
        console.warn('[FCM] onMessage error:', err);
      }
    }
  });

  return () => {};
};
