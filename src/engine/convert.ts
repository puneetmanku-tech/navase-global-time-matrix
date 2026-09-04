/**
 * The Anchor-Based Time Converter.
 *
 * Pick a wall-clock moment in one zone — "9:00 AM on 15 Mar 2026,
 * India (IST)" — and resolve it into every target zone. The anchor is
 * turned into a single UTC instant via Luxon (which applies that day's
 * IANA rules, so it correctly handles a source date that lands on the
 * far side of a DST change), then that instant is re-expressed in each
 * target zone (again with that zone's rules for that date, so EST vs
 * EDT falls out automatically).
 */

import { DateTime } from "luxon";

export interface AnchorInput {
  /** yyyy-mm-dd from an <input type="date"> */
  date: string;
  /** hh:mm 24h from an <input type="time"> */
  time: string;
  /** IANA source zone */
  zone: string;
}

export interface ConversionRow {
  zone: string;
  /** e.g. "Fri, 14 Mar" */
  dateLabel: string;
  /** e.g. "11:30 PM" */
  timeLabel: string;
  /** e.g. "EDT" */
  abbr: string;
  offsetLabel: string;
  isDST: boolean;
  /** +1 / 0 / −1 vs the anchor's own calendar day */
  dayDelta: number;
  /** minutes this zone differs from the anchor zone on that instant */
  relMinutes: number;
}

export interface ConversionResult {
  ok: boolean;
  error?: string;
  /** the resolved UTC instant */
  utcMillis?: number;
  utcLabel?: string;
  /** the anchor re-stated cleanly */
  anchorLabel?: string;
  rows: ConversionRow[];
}

export function convert(input: AnchorInput, targets: string[]): ConversionResult {
  const anchor = DateTime.fromISO(`${input.date}T${input.time}`, { zone: input.zone });

  if (!anchor.isValid) {
    return {
      ok: false,
      error:
        anchor.invalidExplanation ??
        "That date/time doesn't exist in the chosen zone (it may fall in a spring-forward gap).",
      rows: [],
    };
  }

  const utcMillis = anchor.toMillis();
  const calDate = (d: DateTime) => DateTime.utc(d.year, d.month, d.day);
  const anchorDay = calDate(anchor);

  const rows: ConversionRow[] = targets.map((zone) => {
    const dt = anchor.setZone(zone);
    const dayDelta = Math.round(calDate(dt).diff(anchorDay, "days").days) || 0;
    return {
      zone,
      dateLabel: dt.toFormat("ccc, d LLL"),
      timeLabel: dt.toFormat("h:mm a"),
      abbr: dt.offsetNameShort ?? "",
      offsetLabel: dt.toFormat("ZZ"),
      isDST: dt.isInDST,
      dayDelta,
      relMinutes: dt.offset - anchor.offset,
    };
  });

  return {
    ok: true,
    utcMillis,
    utcLabel: anchor.toUTC().toFormat("ccc, d LLL yyyy · HH:mm 'UTC'"),
    anchorLabel: anchor.toFormat("ccc, d LLL yyyy · h:mm a"),
    rows,
  };
}
