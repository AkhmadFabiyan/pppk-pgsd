"use client";

import { useEffect, useState } from "react";
import type { PublicResult } from "@/lib/db";
import type { ElectionStatus } from "@/lib/site";

type ConnectionState = "connected" | "stale";

type ResultsApiPayload = {
  data?: {
    status?: ElectionStatus;
    visible?: boolean;
    result?: PublicResult;
  };
};

function isVisibleResult(payload: ResultsApiPayload): payload is { data: { status: ElectionStatus; visible: true; result: PublicResult } } {
  return payload.data?.visible === true && Boolean(payload.data.result) && Boolean(payload.data.status);
}

function nextDelay(status: ElectionStatus | undefined) {
  return status === "open" ? 5_000 : status === "scheduled" ? 10_000 : null;
}

export function usePublicResults(initialResult: PublicResult | null, initialStatus: ElectionStatus) {
  const [result, setResult] = useState(initialResult);
  const [status, setStatus] = useState(initialStatus);
  const [connection, setConnection] = useState<ConnectionState>("connected");
  useEffect(() => {
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout> | undefined;
    let retryDelay = 5_000;

    const clearTimer = () => {
      if (timer) clearTimeout(timer);
      timer = undefined;
    };

    const schedule = (delay: number | null) => {
      clearTimer();
      if (delay !== null && document.visibilityState === "visible") timer = setTimeout(refresh, delay);
    };

    const refresh = async () => {
      try {
        const response = await fetch("/api/results", { cache: "no-store" });
        const payload = await response.json() as ResultsApiPayload;
        if (cancelled) return;

        if (isVisibleResult(payload)) {
          setResult((current) => current?.updatedAt === payload.data.result.updatedAt ? current : payload.data.result);
          setStatus(payload.data.status);
          setConnection("connected");
          retryDelay = 5_000;
          schedule(nextDelay(payload.data.status));
          return;
        }

        setResult(null);
        const nextStatus = payload.data?.status ?? "scheduled";
        setStatus(nextStatus);
        setConnection("connected");
        retryDelay = 5_000;
        schedule(nextDelay(nextStatus));
      } catch {
        if (cancelled) return;
        setConnection("stale");
        retryDelay = Math.min(retryDelay * 2, 60_000);
        schedule(retryDelay);
      }
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") void refresh();
      else clearTimer();
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    void refresh();
    return () => {
      cancelled = true;
      clearTimer();
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  return { result, status, connection };
}
