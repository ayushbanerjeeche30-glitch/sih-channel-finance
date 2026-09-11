"use client";
import { useEffect } from "react";

export default function ServiceWorkerRegistry() {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .then((reg) => {
          // Only attempt to check for a new Service Worker if the device has internet
          if (navigator.onLine) {
            reg.update().catch(() => console.log("Offline: Skipped SW update check."));
          }
        })
        .catch((err) => console.error("SW Registration Error:", err));
    }
  }, []);
  
  return null;
}