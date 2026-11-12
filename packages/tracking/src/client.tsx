"use client";

import { useEffect } from "react";
import { isEventName, type ClientEvent } from "@bloom/core";
import { EVENTS_ENDPOINT } from "./index";

const FLUSH_MS = 2000;
const DEDUPE_MS = 1000;

let queue: ClientEvent[] = [];
let timer: ReturnType<typeof setTimeout> | undefined;
const recent = new Map<string, number>();

function flush() {
  clearTimeout(timer);
  timer = undefined;
  if (queue.length === 0) return;
  const body = JSON.stringify({ events: queue });
  queue = [];
  if (!navigator.sendBeacon?.(EVENTS_ENDPOINT, body)) {
    void fetch(EVENTS_ENDPOINT, { method: "POST", body, keepalive: true });
  }
}

// Drops repeats of the same event within DEDUPE_MS (double-clicks, StrictMode double effects).
function enqueue(event: ClientEvent) {
  const key = `${event.name}:${event.listingId ?? ""}:${event.providerId ?? ""}`;
  const now = Date.now();
  if (now - (recent.get(key) ?? 0) < DEDUPE_MS) return;
  recent.set(key, now);
  queue.push(event);
  timer ??= setTimeout(flush, FLUSH_MS);
}

// Mounted once in the root layout. Listens for clicks on any [data-track] element.
export function Tracker() {
  useEffect(() => {
    function onClick(e: MouseEvent) {
      const el = (e.target as Element | null)?.closest<HTMLElement>("[data-track]");
      const name = el?.dataset.track;
      if (!el || !isEventName(name)) return;
      enqueue({ name, listingId: el.dataset.listingId, providerId: el.dataset.providerId });
    }
    function onHide() {
      if (document.visibilityState === "hidden") flush();
    }
    document.addEventListener("click", onClick, { capture: true });
    document.addEventListener("visibilitychange", onHide);
    return () => {
      document.removeEventListener("click", onClick, { capture: true });
      document.removeEventListener("visibilitychange", onHide);
    };
  }, []);
  return null;
}

// Rendered by pages (not designs) to record views and impressions.
export function TrackView({ events }: { events: ClientEvent[] }) {
  const key = JSON.stringify(events);
  useEffect(() => {
    for (const event of JSON.parse(key) as ClientEvent[]) enqueue(event);
  }, [key]);
  return null;
}
