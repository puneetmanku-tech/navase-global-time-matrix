/** Tiny DOM helpers — enough to build the UI without a framework. */

export function el<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  attrs: Record<string, string | number | boolean | undefined> = {},
  children: (Node | string)[] = [],
): HTMLElementTagNameMap[K] {
  const node = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (v === undefined || v === false) continue;
    if (k === "class") node.className = String(v);
    else if (k === "text") node.textContent = String(v);
    else if (k === "html") node.innerHTML = String(v);
    else if (k.startsWith("data-")) node.setAttribute(k, String(v));
    else if (k === "value" && node instanceof HTMLInputElement) node.value = String(v);
    else node.setAttribute(k, String(v));
  }
  for (const c of children) node.append(typeof c === "string" ? document.createTextNode(c) : c);
  return node;
}

export function clear(node: Element): void {
  while (node.firstChild) node.removeChild(node.firstChild);
}

export function svg(path: string, opts: { size?: number; fill?: boolean } = {}): SVGSVGElement {
  const s = opts.size ?? 18;
  const ns = "http://www.w3.org/2000/svg";
  const svgEl = document.createElementNS(ns, "svg");
  svgEl.setAttribute("viewBox", "0 0 24 24");
  svgEl.setAttribute("width", String(s));
  svgEl.setAttribute("height", String(s));
  svgEl.setAttribute("aria-hidden", "true");
  if (opts.fill) {
    svgEl.setAttribute("fill", "currentColor");
  } else {
    svgEl.setAttribute("fill", "none");
    svgEl.setAttribute("stroke", "currentColor");
    svgEl.setAttribute("stroke-width", "2");
    svgEl.setAttribute("stroke-linecap", "round");
    svgEl.setAttribute("stroke-linejoin", "round");
  }
  const p = document.createElementNS(ns, "path");
  p.setAttribute("d", path);
  svgEl.append(p);
  return svgEl;
}

export const ICON = {
  sun: "M12 3v2M12 19v2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M3 12h2M19 12h2M5.6 18.4L7 17M17 7l1.4-1.4M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8z",
  moon: "M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z",
  x: "M6 6l12 12M18 6L6 18",
  up: "M12 19V5M5 12l7-7 7 7",
  down: "M12 5v14M5 12l7 7 7-7",
  home: "M3 11l9-8 9 8M5 10v10h5v-6h4v6h5V10",
  plus: "M12 5v14M5 12h14",
  search: "M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14zM20 20l-3.5-3.5",
  swap: "M7 10l-4 4 4 4M3 14h13M17 14l4-4-4-4M21 10H8",
} as const;
