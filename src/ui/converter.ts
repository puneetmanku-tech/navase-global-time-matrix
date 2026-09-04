import { clear, el, svg, ICON } from "./dom";
import { convert } from "../engine/convert";
import { allHostZones, metaFor } from "../data/zones";
import type { AppState } from "../store";
import { DateTime } from "luxon";

const CATALOGUE = allHostZones();

// Module-local form state — deliberately not persisted (it's a scratch tool).
let form = {
  date: DateTime.now().toFormat("yyyy-MM-dd"),
  time: "09:00",
  zone: Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC",
};

export function renderConverter(
  host: HTMLElement,
  state: AppState,
  h: { setState: (p: Partial<AppState>) => void },
): void {
  clear(host);

  const head = el("button", {
    type: "button",
    class: "conv-toggle",
    "aria-expanded": state.converterOpen,
  }, [
    svg(ICON.swap, { size: 16 }),
    el("span", {}, ["Anchor-based converter"]),
    el("span", { class: "conv-hint" }, ["pick a moment in one zone, see it everywhere"]),
    el("span", { class: `conv-caret${state.converterOpen ? " open" : ""}` }, ["▾"]),
  ]);
  head.addEventListener("click", () => h.setState({ converterOpen: !state.converterOpen }));
  host.append(head);

  if (!state.converterOpen) return;

  const body = el("div", { class: "conv-body" });

  // ---- the anchor form ----
  const dateInput = el("input", { type: "date", value: form.date, "aria-label": "Anchor date" }) as HTMLInputElement;
  const timeInput = el("input", { type: "time", value: form.time, "aria-label": "Anchor time" }) as HTMLInputElement;

  const zoneSel = el("select", { "aria-label": "Anchor timezone", class: "conv-zone" }) as HTMLSelectElement;
  for (const z of CATALOGUE) {
    zoneSel.append(el("option", { value: z.id, selected: z.id === form.zone }, [`${z.city} · ${z.id}`]));
  }

  const results = el("div", { class: "conv-results" });

  function recompute(): void {
    form = { date: dateInput.value, time: timeInput.value, zone: zoneSel.value };
    const targets = dedupe([state.homeZone, ...state.zones, form.zone]);
    const res = convert(form, targets);
    clear(results);

    if (!res.ok) {
      results.append(el("p", { class: "conv-error" }, [res.error ?? "Could not convert."]));
      return;
    }

    results.append(
      el("p", { class: "conv-anchor" }, [
        el("strong", {}, [`${metaFor(form.zone).city}: ${res.anchorLabel}`]),
        el("span", {}, [` — that's ${res.utcLabel}`]),
      ]),
    );

    const table = el("table", { class: "conv-table" });
    table.append(
      el("thead", {}, [
        el("tr", {}, [
          el("th", {}, ["Zone"]),
          el("th", {}, ["Local time"]),
          el("th", {}, ["Date"]),
          el("th", {}, ["Rule"]),
        ]),
      ]),
    );
    const tbody = el("tbody");
    for (const row of res.rows) {
      const m = metaFor(row.zone);
      tbody.append(
        el("tr", { class: row.zone === form.zone ? "is-anchor" : "" }, [
          el("td", {}, [
            el("span", { class: "ct-city" }, [m.city]),
            el("span", { class: "ct-id" }, [row.zone]),
          ]),
          el("td", { class: "ct-time", "data-mono": "true" }, [
            row.timeLabel,
            row.dayDelta !== 0
              ? el("span", { class: `ct-day ${row.dayDelta > 0 ? "next" : "prev"}` }, [
                  row.dayDelta > 0 ? " +1d" : " −1d",
                ])
              : el("span"),
          ]),
          el("td", {}, [row.dateLabel]),
          el("td", {}, [
            el("span", { class: "chip" }, [row.abbr || row.offsetLabel]),
            row.isDST ? el("span", { class: "chip dst" }, ["DST"]) : el("span"),
          ]),
        ]),
      );
    }
    table.append(tbody);
    results.append(table);
  }

  for (const input of [dateInput, timeInput, zoneSel]) {
    input.addEventListener("change", recompute);
  }

  const nowBtn = el("button", { type: "button", class: "conv-now" }, ["Now"]);
  nowBtn.addEventListener("click", () => {
    const n = DateTime.now().setZone(zoneSel.value);
    dateInput.value = n.toFormat("yyyy-MM-dd");
    timeInput.value = n.toFormat("HH:mm");
    recompute();
  });

  body.append(
    el("div", { class: "conv-form" }, [
      field("Date", dateInput),
      field("Time", timeInput),
      field("In zone", zoneSel),
      nowBtn,
    ]),
    results,
  );
  host.append(body);
  recompute();
}

function field(label: string, control: HTMLElement): HTMLElement {
  return el("label", { class: "conv-field" }, [el("span", {}, [label]), control]);
}

function dedupe(a: string[]): string[] {
  return [...new Set(a)];
}
