import type { AQICategory } from "./types";

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://api.airguard-cm.duckdns.org/api/v1";

export const CAMEROON_CENTER: [number, number] = [7.37, 12.35];
export const CAMEROON_ZOOM = 6;

export const AQI_COLORS: Record<AQICategory, string> = {
  Bon: "#22C55E",
  Modere: "#EAB308",
  Sensible: "#F97316",
  Malsain: "#EF4444",
  Tres_malsain: "#8B5CF6",
  Dangereux: "#881337",
};

export const AQI_LABELS_FR: Record<AQICategory, string> = {
  Bon: "Bon",
  Modere: "Modéré",
  Sensible: "Sensible",
  Malsain: "Malsain",
  Tres_malsain: "Très malsain",
  Dangereux: "Dangereux",
};

export const AQI_LABELS_EN: Record<AQICategory, string> = {
  Bon: "Good",
  Modere: "Moderate",
  Sensible: "Sensitive",
  Malsain: "Unhealthy",
  Tres_malsain: "Very Unhealthy",
  Dangereux: "Hazardous",
};

export const SEVERITY_COLORS: Record<string, string> = {
  modere: "#EAB308",
  grave: "#F97316",
  critique: "#EF4444",
};
