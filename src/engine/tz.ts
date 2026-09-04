/**
 * Timezone maths — all offline.
 *
 * Luxon reads the IANA time-zone database that ships with the host
 * runtime (the browser's / Electron's bundled ICU). No tzdata file of
 * our own, no network: offsets and every Daylight-Saving transition are
 * computed locally from that database.
 */

import { DateTime } from "luxon";

export interface ZoneReading {
  /** e.g. "09", already zero-padded */
  hh: string;
  mm: string;
  ss: string;
  /** 24h hour as a number, for day/night + sorting */
  hour24: number;
  /** "AM" | "PM" */
  meridiem: string;
  /** e.g. "Mon 3 Mar" */
  dateLabel: string;
  /** signed minutes from UTC, e.g. 330 for IST */
  offsetMinutes: number;
  /** e.g. "GMT+5:30" */
  offsetLabel: string;
  /** abbreviation the tz db reports, e.g. "IST", "EDT", "GMT+11" */
  abbr: string;
  /** true when this zone is currently observing DST */
  isDST: boolean;
  /** +1 / 0 / -1 day relative to a reference zone's date */
  dayDelta: number;
}

/** The local calendar date of a zoned DateTime, as a bare UTC date, so
 *  two of them can be diffed in whole days regardless of either zone. */
function calDate(d: DateTime): DateTime {
  return DateTime.utc(d.year, d.month, d.day);
}

function fmtOffset(minutes: number): string {
  const sign = minutes >= 0 ? "+" : "−";
  const abs = Math.abs(minutes);
  const h = Math.floor(abs / 60);
  const m = abs % 60;
  return m === 0 ? `GMT${sign}${h}` : `GMT${sign}${h}:${String(m).padStart(2, "0")}`;
}

export function read(utcMillis: number, zone: string, referenceZone?: string): ZoneReading {
  const dt = DateTime.fromMillis(utcMillis, { zone });
  const ref = referenceZone
    ? DateTime.fromMillis(utcMillis, { zone: referenceZone })
    : dt;

  const dayDelta = Math.round(calDate(dt).diff(calDate(ref), "days").days) || 0;

  return {
    hh: dt.toFormat("HH"),
    mm: dt.toFormat("mm"),
    ss: dt.toFormat("ss"),
    hour24: dt.hour,
    meridiem: dt.toFormat("a"),
    dateLabel: dt.toFormat("ccc d LLL"),
    offsetMinutes: dt.offset,
    offsetLabel: fmtOffset(dt.offset),
    abbr: dt.offsetNameShort ?? fmtOffset(dt.offset),
    isDST: dt.isInDST,
    dayDelta,
  };
}

/** Difference this zone is from a base zone, right now, in minutes. */
export function relativeOffsetMinutes(utcMillis: number, zone: string, base: string): number {
  const a = DateTime.fromMillis(utcMillis, { zone }).offset;
  const b = DateTime.fromMillis(utcMillis, { zone: base }).offset;
  return a - b;
}

/** Human relative label, e.g. "3½ h ahead", "same time", "5 h behind". */
export function relativeLabel(deltaMinutes: number): string {
  if (deltaMinutes === 0) return "same time";
  const ahead = deltaMinutes > 0;
  const abs = Math.abs(deltaMinutes);
  const h = Math.floor(abs / 60);
  const m = abs % 60;
  const frac = m === 30 ? "½" : m === 45 ? "¾" : m === 15 ? "¼" : "";
  const num = m === 0 ? `${h}` : frac ? `${h}${frac}` : `${h}:${String(m).padStart(2, "0")}`;
  return `${num} h ${ahead ? "ahead" : "behind"}`;
}

/** Is `zone` a real IANA zone the host understands? */
export function isValidZone(zone: string): boolean {
  return DateTime.local().setZone(zone).isValid;
}

/** Next DST transition for a zone at or after `utcMillis`, or null. */
export function nextDstTransition(
  utcMillis: number,
  zone: string,
): { atMillis: number; gainsHour: boolean } | null {
  let cursor = DateTime.fromMillis(utcMillis, { zone });
  const startOffset = cursor.offset;
  const limit = cursor.plus({ years: 1 });
  // Step a day at a time to bracket the change, then binary-search the minute.
  let prev = cursor;
  while (cursor < limit) {
    cursor = cursor.plus({ days: 1 });
    if (cursor.offset !== prev.offset) {
      let lo = prev.toMillis();
      let hi = cursor.toMillis();
      while (hi - lo > 60_000) {
        const mid = Math.floor((lo + hi) / 2);
        if (DateTime.fromMillis(mid, { zone }).offset === prev.offset) lo = mid;
        else hi = mid;
      }
      return { atMillis: hi, gainsHour: cursor.offset < startOffset };
    }
    prev = cursor;
  }
  return null;
}
