"use client";

import { useState, useEffect } from "react";
import { WifiOff, RefreshCw } from "lucide-react";

export default function NetworkStatus() {
  const [isOffline, setIsOffline] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  // The Background Sync Function
  const syncOfflineQueue = async () => {
    const queueString = localStorage.getItem('samruddhisetu_offline_queue');
    if (!queueString) return;

    const queue = JSON.parse(queueString);
    if (queue.length === 0) return;

    setIsSyncing(true);

    // Process each queued application
    const remainingQueue = [];
    for (const app of queue) {
      try {
        const response = await fetch('/api/applications', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(app.payload)
        });

        if (!response.ok) {
          throw new Error("Sync failed");
        }
        // Successfully synced! It drops out of the remaining queue.
      } catch (error) {
        // If it fails again, keep it in the queue for next time
        remainingQueue.push(app);
      }
    }

    // Update the queue with any failed attempts, or clear it if all succeeded
    localStorage.setItem('samruddhisetu_offline_queue', JSON.stringify(remainingQueue));
    setIsSyncing(false);
  };

  useEffect(() => {
    setIsOffline(!navigator.onLine);

    const handleOnline = () => {
      setIsOffline(false);
      syncOfflineQueue(); // Fire the sync engine the second connection returns!
    };
    
    const handleOffline = () => setIsOffline(true);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // Check queue on initial load just in case they closed the browser while offline
    if (navigator.onLine) {
      syncOfflineQueue();
    }

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  if (isSyncing) {
    return (
      <div className="bg-blue-500 text-white text-xs font-medium px-4 py-2 flex items-center justify-center gap-2 z-[100] sticky top-0 w-full shadow-md animate-in slide-in-from-top-2">
        <RefreshCw size={14} className="shrink-0 animate-spin" />
        Connection restored. Syncing offline applications to server...
      </div>
    );
  }

  if (!isOffline) return null;

  return (
    <div className="bg-red-500 text-white text-xs font-medium px-4 py-2 flex items-center justify-center gap-2 z-[100] sticky top-0 w-full shadow-md animate-in slide-in-from-top-2">
      <WifiOff size={14} className="shrink-0" />
      You are offline. Applications will be queued and auto-synced later.
    </div>
  );
}