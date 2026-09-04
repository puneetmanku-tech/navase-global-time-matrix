import { clear, el, svg, ICON } from "./dom";
import { read, relativeOffsetMinutes, relativeLabel } from "../engine/tz";
import { classify } from "../engine/daynight";
import { metaFor } from "../data/zones";
import type { AppState } from "../store";

interface Handlers {
  onRemove: (id: string) => void;
  onMove: (id: string, dir: -1 | 1) => void;
  onSetHome: (id: string) => void;
}

export function renderGrid(host: HTMLElement, utc: number, state: AppState, h: Handlers): void {
  clear(host);

  if (state.zones.length === 0) {
    host.append(
      el("div", { class: "empty" }, [
        el("p", {}, ["No zones yet."]),
        el("p", { class: "empty-sub" }, ["Search above to add the cities you work across."]),
      ]),
    );
    return;
  }

  state.zones.forEach((id, i) => {
    host.append(card(id, i, state, utc, h));
  });
}

function card(id: string, index: number, state: AppState, utc: number, h: Handlers): HTMLElement {
  const meta = metaFor(id);
  const r = read(utc, id, state.homeZone);
  const dn = classify(utc, meta.lat, meta.lon, r.hour24);
  const relMin = relativeOffsetMinutes(utc, id, state.homeZone);
  const isHome = id === state.homeZone;

  const hm =
    state.format === "24h"
      ? `${r.hh}:${r.mm}`
      : `${((r.hour24 + 11) % 12) + 1}:${r.mm}`;

  const root = el("article", {
    class: `card phase-${dn.phase} ${dn.isLight ? "is-light" : "is-dark"}${isHome ? " is-home" : ""}`,
  });

  // header: city + controls
  const head = el("div", { class: "card-head" }, [
    el("div", { class: "card-place" }, [
      el("h3", {}, [meta.city]),
      el("span", { class: "card-country" }, [meta.country]),
    ]),
    el("div", { class: "card-tools" }, [
      toolBtn(ICON.home, isHome ? "Home zone" : "Set as your zone", () => h.onSetHome(id), isHome),
      toolBtn(ICON.up, "Move earlier", () => h.onMove(id, -1), false, index === 0),
      toolBtn(ICON.down, "Move later", () => h.onMove(id, 1), false, index === state.zones.length - 1),
      toolBtn(ICON.x, `Remove ${meta.city}`, () => h.onRemove(id)),
    ]),
  ]);

  // the clock
  const clockRow = el("div", { class: "card-clock", "data-mono": "true" }, [
    el("span", { class: "clock-hm" }, [hm]),
    state.showSeconds ? el("span", { class: "clock-ss" }, [r.ss]) : el("span"),
    state.format === "12h" ? el("span", { class: "clock-mer" }, [r.meridiem]) : el("span"),
  ]);

  // day badge
  const dayBadge =
    r.dayDelta === 0
      ? null
      : el("span", { class: `daybadge ${r.dayDelta > 0 ? "next" : "prev"}` }, [
          r.dayDelta > 0 ? "next day" : "prev day",
        ]);

  const dateRow = el("div", { class: "card-date" }, [r.dateLabel, dayBadge ?? el("span")]);

  // meta line: offset / abbr / dst
  const metaRow = el("div", { class: "card-meta" }, [
    el("span", { class: "chip" }, [r.abbr]),
    el("span", { class: "chip subtle" }, [r.offsetLabel]),
    r.isDST ? el("span", { class: "chip dst" }, ["DST"]) : el("span"),
  ]);

  // relative to home
  const relRow = isHome
    ? el("div", { class: "card-rel home-tag" }, [
        dnIcon(dn.isLight),
        el("span", {}, ["your zone"]),
      ])
    : el("div", { class: "card-rel" }, [
        dnIcon(dn.isLight),
        el("span", {}, [
          relMin === 0 ? "same as your time" : relativeLabel(relMin),
          " · ",
          dn.label,
        ]),
      ]);

  root.append(head, clockRow, dateRow, metaRow, relRow);
  return root;
}

function toolBtn(
  path: string,
  label: string,
  onClick: () => void,
  active = false,
  disabled = false,
): HTMLButtonElement {
  const b = el("button", {
    type: "button",
    class: `tool${active ? " on" : ""}`,
    "aria-label": label,
    title: label,
    disabled,
  }) as HTMLButtonElement;
  b.append(svg(path, { size: 15 }));
  b.addEventListener("click", onClick);
  return b;
}

function dnIcon(light: boolean): SVGSVGElement {
  return svg(light ? ICON.sun : ICON.moon, { size: 14 });
}
