import "./style.css";
import { onTick, hostZone } from "./engine/clock";
import { getState, setState, subscribe } from "./store";
import { renderHomeClock } from "./ui/homeclock";
import { renderControls } from "./ui/controls";
import { renderSearch } from "./ui/search";
import { renderGrid } from "./ui/grid";
import { renderConverter } from "./ui/converter";
import { renderDisclosures } from "./ui/disclosures";
import { metaFor } from "./data/zones";

const els = {
  home: document.getElementById("homeClock")!,
  controls: document.getElementById("controls")!,
  search: document.getElementById("search")!,
  grid: document.getElementById("grid")!,
  converter: document.getElementById("converter")!,
  disclosures: document.getElementById("disclosures")!,
};

// Make sure the host zone is always available as the home zone option.
if (!getState().zones.includes(getState().homeZone)) {
  // home zone lives outside the grid list; that's fine.
}

function applyTheme(): void {
  const { theme } = getState();
  document.documentElement.dataset.theme = theme;
}

function addZone(id: string): void {
  const s = getState();
  if (s.zones.includes(id)) return;
  setState({ zones: [...s.zones, id] });
}

function removeZone(id: string): void {
  const s = getState();
  setState({ zones: s.zones.filter((z) => z !== id) });
}

function moveZone(id: string, dir: -1 | 1): void {
  const zones = [...getState().zones];
  const i = zones.indexOf(id);
  const j = i + dir;
  if (i < 0 || j < 0 || j >= zones.length) return;
  [zones[i], zones[j]] = [zones[j], zones[i]];
  setState({ zones });
}

function setHome(id: string): void {
  setState({ homeZone: id });
}

let lastUtc = Date.now();

function paint(): void {
  const state = getState();
  renderHomeClock(els.home, lastUtc, state, { onSetHome: setHome });
  renderControls(els.controls, state, { setState });
  renderGrid(els.grid, lastUtc, state, {
    onRemove: removeZone,
    onMove: moveZone,
    onSetHome: setHome,
  });
  renderConverter(els.converter, state, { setState });
}

// Static bits — render once.
renderSearch(els.search, { onAdd: addZone });
renderDisclosures(els.disclosures);
applyTheme();

subscribe(() => {
  applyTheme();
  paint();
});

onTick((t) => {
  lastUtc = t.utcMillis;
  paint();
});

// Surface the host zone in the console for support.
console.info(
  `[Global Time Matrix] host zone: ${hostZone} (${metaFor(hostZone).city})`,
);
