/// <reference types="vite-plugin-pwa/client" />
import { useEffect, useState } from 'react';
import { useRegisterSW } from 'virtual:pwa-register/react';

/**
 * Wraps the vite-plugin-pwa service worker registration.
 * Returns needRefresh (boolean) and a triggerUpdate() function.
 */
export function useServiceWorker() {
  const { needRefresh: [needRefresh], updateServiceWorker } = useRegisterSW({
    onRegistered(r: ServiceWorkerRegistration | undefined) {
      if (r) {
        // Check for updates every 60 seconds when the page is visible
        setInterval(() => { if (document.visibilityState === 'visible') r.update(); }, 60000);
      }
    },
  });
  return { needRefresh, update: () => updateServiceWorker(true) };
}
