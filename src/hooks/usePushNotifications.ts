// usePushNotifications.ts
// Handles Web Push subscription.
// Call subscribeAdmin() when admin needs push — browser asks permission,
// then sends subscription to backend. Notifications arrive even when
// the tab/site is fully closed (via Service Worker).

import { api, API_ENABLED } from "../lib/api";

const VAPID_PUBLIC_KEY = import.meta.env.VITE_VAPID_PUBLIC_KEY as string;

function urlBase64ToUint8Array(base64String: string): Uint8Array<ArrayBuffer> {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export async function subscribeAdmin(): Promise<{
  ok: boolean;
  status: "subscribed" | "already" | "denied" | "unsupported" | "error";
  message: string;
}> {
  try {
    // 1. Check browser support
    if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
      return {
        ok: false,
        status: "unsupported",
        message: "متصفحك لا يدعم الإشعارات — استخدم Chrome أو Edge",
      };
    }

    // 2. Request notification permission
    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
      return {
        ok: false,
        status: "denied",
        message: "تم رفض الإذن — فعّل الإشعارات من إعدادات المتصفح",
      };
    }

    // 3. Wait for SW to be ready
    const reg = await navigator.serviceWorker.ready;

    // 4. Check if already subscribed
    const existing = await reg.pushManager.getSubscription();
    if (existing) {
      // Re-send to backend in case server restarted
      if (API_ENABLED) {
        await api.subscribeToPush(existing.toJSON());
      }
      return { ok: true, status: "already", message: "الإشعارات مفعّلة بالفعل ✅" };
    }

    // 5. Subscribe with VAPID
    const subscription = await reg.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
    });

    // 6. Send subscription to backend
    if (API_ENABLED) {
      await api.subscribeToPush(subscription.toJSON());
    }

    return {
      ok: true,
      status: "subscribed",
      message: "تم تفعيل الإشعارات بنجاح 🔔 ستصلك تنبيهات حتى لو الموقع مغلق!",
    };
  } catch (e: any) {
    return { ok: false, status: "error", message: e.message || "حدث خطأ غير متوقع" };
  }
}

export async function unsubscribeAdmin(): Promise<void> {
  if (!("serviceWorker" in navigator)) return;
  try {
    const reg = await navigator.serviceWorker.ready;
    const sub = await reg.pushManager.getSubscription();
    if (!sub) return;
    if (API_ENABLED) {
      await api.unsubscribeFromPush(sub.endpoint);
    }
    await sub.unsubscribe();
  } catch {}
}

export async function getSubscriptionStatus(): Promise<
  "subscribed" | "not-subscribed" | "unsupported"
> {
  if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
    return "unsupported";
  }
  try {
    const reg = await navigator.serviceWorker.ready;
    const sub = await reg.pushManager.getSubscription();
    return sub ? "subscribed" : "not-subscribed";
  } catch {
    return "not-subscribed";
  }
}
