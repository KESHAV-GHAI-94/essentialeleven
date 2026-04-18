"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";

/**
 * Syncs localStorage recently-viewed product IDs to the database
 * the moment the user signs in. Runs once per session.
 */
export function useSyncRecentlyViewed() {
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status !== "authenticated" || !session?.user) return;

    const syncKey = `rv_synced_${(session.user as any).id}`;
    // Only sync once per login session
    if (sessionStorage.getItem(syncKey)) return;

    const raw = localStorage.getItem("recently_viewed");
    if (!raw) return;

    let productIds: string[] = [];
    try {
      productIds = JSON.parse(raw);
    } catch {
      return;
    }

    if (productIds.length === 0) return;

    fetch("/api/user/sync-viewed", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productIds }),
    })
      .then((res) => {
        if (res.ok) {
          sessionStorage.setItem(syncKey, "1");
          console.log("✅ Recently viewed synced to DB");
        }
      })
      .catch(console.error);
  }, [status, session]);
}
