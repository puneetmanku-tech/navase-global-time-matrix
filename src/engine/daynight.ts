/**
 * Day / night classification for a zone's location, computed locally
 * from the sun's altitude (SunCalc). Falls back to a crude hour-of-day
 * rule when we have no coordinates for the zone.
 */

import SunCalc from "suncalc";

export type Phase = "day" | "golden" | "twilight" | "night" | "unknown";

export interface DayNight {
  phase: Phase;
  /** true for day/golden — a light card; false for twilight/night */
  isLight: boolean;
  label: string;
}

export function classify(
  utcMillis: number,
  lat: number,
  lon: number,
  hour24: number,
): DayNight {
  if (!Number.isFinite(lat) || !Number.isFinite(lon)) {
    const light = hour24 >= 7 && hour24 < 19;
    return {
      phase: "unknown",
      isLight: light,
      label: light ? "daytime" : "night",
    };
  }

  const pos = SunCalc.getPosition(new Date(utcMillis), lat, lon);
  const alt = (pos.altitude * 180) / Math.PI; // degrees above horizon

  if (alt >= 6) return { phase: "day", isLight: true, label: "daytime" };
  if (alt >= -0.833) return { phase: "golden", isLight: true, label: "golden hour" };
  if (alt >= -6) return { phase: "twilight", isLight: false, label: "twilight" };
  if (alt >= -18) return { phase: "twilight", isLight: false, label: "dusk / dawn" };
  return { phase: "night", isLight: false, label: "night" };
}
