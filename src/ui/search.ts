import { clear, el, svg, ICON } from "./dom";
import { allHostZones, type ZoneMeta } from "../data/zones";

const CATALOGUE = allHostZones();

export function renderSearch(host: HTMLElement, h: { onAdd: (id: string) => void }): void {
  clear(host);

  const input = el("input", {
    type: "text",
    class: "search-input",
    placeholder: "Add a city or timezone…",
    "aria-label": "Search for a city or timezone to add",
    autocomplete: "off",
    spellcheck: false,
  }) as HTMLInputElement;

  const iconBtn = el("span", { class: "search-icon", "aria-hidden": "true" });
  iconBtn.append(svg(ICON.search, { size: 16 }));

  const list = el("ul", { class: "search-results", role: "listbox", hidden: true });

  const wrap = el("div", { class: "search-wrap" }, [iconBtn, input, list]);
  host.append(wrap);

  let active = -1;
  let matches: ZoneMeta[] = [];

  function close(): void {
    list.hidden = true;
    active = -1;
    clear(list);
  }

  function pick(id: string): void {
    h.onAdd(id);
    input.value = "";
    close();
    input.focus();
  }

  function render(): void {
    const q = input.value.trim().toLowerCase();
    if (!q) return close();
    matches = CATALOGUE.filter((z) => (z.q ?? z.id.toLowerCase()).includes(q)).slice(0, 8);
    clear(list);
    if (!matches.length) {
      list.append(el("li", { class: "search-empty" }, ["No match — try a country or an IANA id like Asia/Tokyo"]));
      list.hidden = false;
      return;
    }
    matches.forEach((z, i) => {
      const li = el("li", { class: `search-opt${i === active ? " active" : ""}`, role: "option", "data-id": z.id }, [
        el("span", { class: "opt-city" }, [z.city]),
        el("span", { class: "opt-country" }, [z.country]),
        el("span", { class: "opt-id" }, [z.id]),
      ]);
      li.addEventListener("mousedown", (e) => {
        e.preventDefault();
        pick(z.id);
      });
      list.append(li);
    });
    list.hidden = false;
  }

  input.addEventListener("input", () => {
    active = -1;
    render();
  });
  input.addEventListener("keydown", (e) => {
    if (list.hidden) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      active = Math.min(active + 1, matches.length - 1);
      render();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      active = Math.max(active - 1, 0);
      render();
    } else if (e.key === "Enter" && active >= 0) {
      e.preventDefault();
      pick(matches[active].id);
    } else if (e.key === "Escape") {
      close();
    }
  });
  input.addEventListener("blur", () => window.setTimeout(close, 120));
}
