/// <reference types="vite/client" />

declare const __BUILD_DATE__: string;

declare module "suncalc" {
  interface SunPosition {
    altitude: number;
    azimuth: number;
  }
  const SunCalc: {
    getPosition(date: Date, lat: number, lng: number): SunPosition;
    getTimes(date: Date, lat: number, lng: number): Record<string, Date>;
  };
  export default SunCalc;
}
