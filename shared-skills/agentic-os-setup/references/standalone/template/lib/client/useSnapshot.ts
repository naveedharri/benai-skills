"use client";

import { useEffect, useState, useCallback } from "react";
import { onSnapshotUpdated } from "./runs-store";

export function useSnapshot<T = any>(name: string, initial?: T) {
  const [data, setData] = useState<T | undefined>(initial);
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/snapshot/${name}`, { cache: "no-store" });
      if (res.ok) setData(await res.json());
    } finally {
      setLoading(false);
    }
  }, [name]);

  useEffect(() => {
    return onSnapshotUpdated(name, () => { void refresh(); });
  }, [name, refresh]);

  return { data, loading, refresh };
}
