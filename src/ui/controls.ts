import { clear, el } from "./dom";
import type { AppState, ClockFormat, Theme } from "../store";

export function renderControls(
  host: HTMLElement,
  state: AppState,
  h: { setState: (p: Partial<AppState>) => void },
): void {
  clear(host);

  host.append(
    seg("Clock", [
      ["24h", state.format === "24h"],
      ["12h", state.format === "12h"],
    ], (v) => h.setState({ format: v as ClockFormat })),

    toggle("Seconds", state.showSeconds, (v) => h.setState({ showSeconds: v })),

    seg("Theme", [
      ["System", state.theme === "system"],
      ["Dark", state.theme === "dark"],
      ["Light", state.theme === "light"],
    ], (v) => h.setState({ theme: v.toLowerCase() as Theme })),
  );
}

function seg(
  label: string,
  options: [string, boolean][],
  onPick: (v: string) => void,
): HTMLElement {
  const group = el("div", { class: "seg", role: "group", "aria-label": label });
  group.append(el("span", { class: "seg-label" }, [label]));
  const box = el("div", { class: "seg-box" });
  for (const [name, active] of options) {
    const b = el("button", { type: "button", class: `seg-btn${active ? " on" : ""}`, "aria-pressed": active }, [name]);
    b.addEventListener("click", () => onPick(name));
    box.append(b);
  }
  group.append(box);
  return group;
}

function toggle(label: string, on: boolean, onChange: (v: boolean) => void): HTMLElement {
  const wrap = el("label", { class: "switch" });
  const input = el("input", { type: "checkbox" }) as HTMLInputElement;
  input.checked = on;
  input.addEventListener("change", () => onChange(input.checked));
  wrap.append(input, el("span", { class: "switch-track", "aria-hidden": "true" }), el("span", { class: "switch-label" }, [label]));
  return wrap;
}
