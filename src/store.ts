/**
 * Persistence hook.
 *
 * The dashboard (which zones, their order, the home zone, clock format,
 * theme) is cached so it survives an app restart. Web builds use
 * localStorage; a future native build can swap `read`/`write` for file
 * writes without touching the rest of the app.
 */

const KEY = "gtm.state.v1";

export type ClockFormat = "24h" | "12h";
export type Theme = "system" | "dark" | "light";

export interface AppState {
  zones: string[];
  homeZone: string;
  format: ClockFormat;
  theme: Theme;
  showSeconds: boolean;
  converterOpen: boolean;
}

const DEFAULTS: AppState = {
  zones: [
    "America/Los_Angeles",
    "America/New_York",
    "Europe/London",
    "Asia/Kolkata",
    "Asia/Singapore",
    "Australia/Sydney",
  ],
  homeZone: Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC",
  format: "24h",
  theme: "system",
  showSeconds: true,
  converterOpen: false,
};

function read(): AppState {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return { ...DEFAULTS };
    const parsed = JSON.parse(raw) as Partial<AppState>;
    return {
      ...DEFAULTS,
      ...parsed,
      zones: Array.isArray(parsed.zones) && parsed.zones.length ? parsed.zones : DEFAULTS.zones,
    };
  } catch {
    return { ...DEFAULTS };
  }
}

function write(state: AppState): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    /* private mode / quota — the app still works, just won't remember */
  }
}

let state: AppState = read();
const subs = new Set<(s: AppState) => void>();

export function getState(): AppState {
  return state;
}

export function setState(patch: Partial<AppState>): void {
  state = { ...state, ...patch };
  write(state);
  for (const fn of subs) fn(state);
}

export function subscribe(fn: (s: AppState) => void): () => void {
  subs.add(fn);
  return () => subs.delete(fn);
}

export function resetState(): void {
  state = { ...DEFAULTS };
  write(state);
  for (const fn of subs) fn(state);
}
