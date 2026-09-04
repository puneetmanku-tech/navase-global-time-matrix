import { clear, el } from "./dom";
import { read } from "../engine/tz";
import { metaFor } from "../data/zones";
import type { AppState } from "../store";

export function renderHomeClock(
  host: HTMLElement,
  utc: number,
  state: AppState,
  h: { onSetHome: (id: string) => void },
): void {
  const r = read(utc, state.homeZone);
  const meta = metaFor(state.homeZone);
  const hm =
    state.format === "24h"
      ? `${r.hh}:${r.mm}`
      : `${((r.hour24 + 11) % 12) + 1}:${r.mm}`;

  clear(host);

  const label = el("label", { class: "home-label", for: "homeZoneSel" }, ["Your time — "]);
  const sel = el("select", { id: "homeZoneSel", class: "home-select", "aria-label": "Home timezone" });
  for (const z of dedupe([state.homeZone, ...state.zones])) {
    const m = metaFor(z);
    sel.append(el("option", { value: z, selected: z === state.homeZone }, [m.city]));
  }
  sel.addEventListener("change", () => h.onSetHome(sel.value));
  label.append(sel);

  host.append(
    label,
    el("div", { class: "home-time", "data-mono": "true" }, [
      el("span", { class: "home-hm" }, [hm]),
      state.showSeconds ? el("span", { class: "home-ss" }, [r.ss]) : el("span"),
      state.format === "12h" ? el("span", { class: "home-mer" }, [r.meridiem]) : el("span"),
    ]),
    el("div", { class: "home-meta" }, [
      `${r.dateLabel} · ${r.offsetLabel}${r.isDST ? " · DST" : ""} · ${meta.country}`,
    ]),
  );
}

function dedupe(a: string[]): string[] {
  return [...new Set(a)];
}
