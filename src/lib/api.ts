import { API_BASE_URL } from "./constants";
import type {
  Ville,
  Region,
  AirQuality,
  NationalKPIs,
  Alert,
  Meteo,
  PredictionResult,
  ChatResponse,
} from "./types";

async function fetchAPI<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

export const api = {
  getVilles: () => fetchAPI<Ville[]>("/villes/"),
  getRegions: () => fetchAPI<Region[]>("/regions/"),

  getAirQuality: (params?: string) =>
    fetchAPI<AirQuality[]>(`/air-quality/${params ? `?${params}` : ""}`),

  getNationalKPIs: () => fetchAPI<NationalKPIs>("/air-quality/national_kpis/"),

  getAlerts: () => fetchAPI<Alert[]>("/alerts/"),
  getActiveAlerts: () => fetchAPI<Alert[]>("/alerts/active/"),

  getMeteo: (params?: string) =>
    fetchAPI<Meteo[]>(`/meteo/${params ? `?${params}` : ""}`),

  predict: (villeNom: string, meteoData: Record<string, number> = {}) =>
    fetchAPI<PredictionResult>("/air-quality/predict/", {
      method: "POST",
      body: JSON.stringify({ ville_nom: villeNom, meteo_data: meteoData }),
    }),

  chat: (message: string) =>
    fetchAPI<ChatResponse>("/air-quality/chat/", {
      method: "POST",
      body: JSON.stringify({ message }),
    }),

  getReportPDF: () =>
    fetch(`${API_BASE_URL}/air-quality/reports/pdf/`).then((res) => res.blob()),
};
