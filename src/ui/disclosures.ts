import { el } from "./dom";
import { DateTime } from "luxon";

/**
 * The regulatory / limitations disclosure. Kept prominent (not buried
 * in an About box) because every reading this app shows depends on the
 * host clock and on a tz database that is a point-in-time snapshot.
 */
export function renderDisclosures(host: HTMLElement): void {
  const built = __BUILD_DATE__;

  const d = el("details", { class: "disc" });
  d.append(
    el("summary", {}, ["Accuracy, limitations & disclaimers"]),
    section("Your device's clock is the source of truth", [
      "Every time shown is calculated from this device's own system clock. Global Time Matrix does not contact a network time server. If your clock is wrong, fast, or slow, every card and every conversion is off by the same amount. Check your operating system's date & time settings before relying on a reading.",
    ]),
    section("Time-zone rules are a snapshot", [
      `Offsets and Daylight-Saving transitions come from the IANA time-zone database bundled with your browser or with this app at build time (this build: ${DateTime.fromISO(built).toFormat("d LLL yyyy")}). Governments change time-zone and DST rules, sometimes at very short notice. A future date near a rule change may be shown using the rule that was current when this database was compiled.`,
    ]),
    section("Shifting boundaries and disputed regions", [
      "City-to-zone assignments follow the IANA database's editorial choices. In disputed or recently re-aligned territories the zone in use on the ground may differ. Treat the country label as a convenience, not a political statement.",
    ]),
    section("Not for mission-critical timing", [
      "This is a planning and scheduling aid. Do not use it for aviation, maritime or rail operations, legal or contractual deadlines, financial market or settlement timing, emergency response, or any purpose where a timing error could cause harm or loss. For those, use an authoritative, audited time source.",
    ]),
    section("No warranty", [
      "Global Time Matrix is provided free, as-is, without warranty of any kind. NavAse Technologies accepts no liability for any loss arising from its use.",
    ]),
  );
  host.append(d);
}

function section(title: string, paras: string[]): HTMLElement {
  return el("div", { class: "disc-item" }, [
    el("h4", {}, [title]),
    ...paras.map((p) => el("p", {}, [p])),
  ]);
}
