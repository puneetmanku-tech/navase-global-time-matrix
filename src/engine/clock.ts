/**
 * The clock engine.
 *
 * One ticking loop for the whole app, bound to the local host machine's
 * clock. Every tick it reads `Date.now()` once, exposes it as a stable
 * UTC millisecond baseline, and notifies subscribers. The loop re-aligns
 * itself to the top of each wall-clock second (so the displayed seconds
 * flip cleanly) and pauses work while the tab/window is hidden.
 *
 * There is deliberately no network time sync — every reading is only as
 * accurate as this device's own clock. See ui/disclosures.ts.
 */

export type Tick = {
  /** UTC milliseconds since the Unix epoch, straight from the host. */
  utcMillis: number;
  /** The host's own IANA zone, e.g. "Asia/Kolkata". */
  hostZone: string;
};

type Listener = (t: Tick) => void;

const listeners = new Set<Listener>();
let timer: number | undefined;
let lastSecond = -1;

export const hostZone: string =
  Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";

function now(): Tick {
  return { utcMillis: Date.now(), hostZone };
}

function emit(): void {
  const t = now();
  for (const fn of listeners) {
    try {
      fn(t);
    } catch (err) {
      console.error("[clock] listener threw", err);
    }
  }
}

/** Schedule the next tick for the top of the coming second (+ a hair). */
function scheduleAligned(): void {
  window.clearTimeout(timer);
  if (document.hidden) return; // resumed by the visibilitychange handler
  const delay = 1000 - (Date.now() % 1000) + 8;
  timer = window.setTimeout(() => {
    const sec = Math.floor(Date.now() / 1000);
    if (sec !== lastSecond) {
      lastSecond = sec;
      emit();
    }
    scheduleAligned();
  }, delay);
}

/** Subscribe to per-second ticks. Returns an unsubscribe function. */
export function onTick(fn: Listener): () => void {
  listeners.add(fn);
  fn(now()); // paint immediately, don't wait up to a second
  if (listeners.size === 1) scheduleAligned();
  return () => {
    listeners.delete(fn);
    if (listeners.size === 0) window.clearTimeout(timer);
  };
}

/** Current reading without subscribing. */
export function readNow(): Tick {
  return now();
}

document.addEventListener("visibilitychange", () => {
  if (!document.hidden && listeners.size > 0) {
    lastSecond = -1;
    emit(); // catch up whatever we missed while hidden
    scheduleAligned();
  }
});
