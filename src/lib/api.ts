import { API_BASE_URL } from "./constants";
import { fetchWithAuth } from "./auth";
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

interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

async function fetchAPI<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const res = await fetchWithAuth(`${API_BASE_URL}${endpoint}`, options);
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

async function fetchPaginatedAPI<T>(endpoint: string, options?: RequestInit): Promise<T[]> {
  const res = await fetchWithAuth(`${API_BASE_URL}${endpoint}`, options);
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  const data: PaginatedResponse<T> = await res.json();
  return data.results;
}

export const api = {
  getVilles: () => fetchPaginatedAPI<Ville>("/villes/"),
  getRegions: () => fetchPaginatedAPI<Region>("/regions/"),

  getAirQuality: (params?: string) =>
    fetchPaginatedAPI<AirQuality>(`/air-quality/${params ? `?${params}` : ""}`),

  getNationalKPIs: () => fetchAPI<NationalKPIs>("/air-quality/national_kpis/"),

  getAlerts: () => fetchPaginatedAPI<Alert>("/alerts/"),
  // /alerts/active/ is a custom action that returns a direct array
  getActiveAlerts: () => fetchAPI<Alert[]>("/alerts/active/"),

  getMeteo: (params?: string) =>
    fetchPaginatedAPI<Meteo>(`/meteo/${params ? `?${params}` : ""}`),

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

  getPredictionTomorrow: (villeNom: string) =>
    fetchAPI<{
      ville: string;
      date: string;
      aqi: number;
      pm25: number;
      categorie: string;
      label: string;
      conseil: string;
      chaleur: { heat_index: number; extreme: number; avertissement: string };
      risques: { inondation: number; secheresse: number; categorie_inondation: string };
    }>(`/predictions/tomorrow/?ville_nom=${encodeURIComponent(villeNom)}`),

  getPredictionWeek: (villeNom: string) =>
    fetchAPI<{
      ville: string;
      semaine: string;
      resume: string;
      jours: Array<{
        jour: string;
        date: string;
        aqi: number;
        categorie: string;
        label: string;
        conseil: string;
      }>;
    }>(`/predictions/week/?ville_nom=${encodeURIComponent(villeNom)}`),

  getReportPDF: () =>
    fetchWithAuth(`${API_BASE_URL}/air-quality/reports/pdf/`).then((res) => res.blob()),
};
