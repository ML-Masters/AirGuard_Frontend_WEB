"use client";

import useSWR from "swr";
import { API_BASE_URL } from "@/lib/constants";
import { fetchWithAuth } from "@/lib/auth";
import type { Ville, AirQuality, Alert, Meteo, NationalKPIs } from "@/lib/types";

interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

const fetcher = (url: string) => fetchWithAuth(url).then((r) => r.json());

// Fetcher that extracts results from paginated DRF responses
const paginatedFetcher = <T,>(url: string): Promise<T[]> =>
  fetchWithAuth(url)
    .then((r) => r.json())
    .then((data: PaginatedResponse<T>) => data.results);

const DATA_OPTIONS = {
  revalidateOnFocus: false,
  dedupingInterval: 30000,
  refreshInterval: 30000, // 30 sec
};

export function useVilles() {
  return useSWR<Ville[]>(`${API_BASE_URL}/villes/`, paginatedFetcher, {
    ...DATA_OPTIONS,
    revalidateIfStale: false,
  });
}

export function useAirQuality(params?: string) {
  const url = `${API_BASE_URL}/air-quality/${params ? `?${params}` : ""}`;
  return useSWR<AirQuality[]>(url, paginatedFetcher, DATA_OPTIONS);
}

export function useNationalKPIs() {
  return useSWR<NationalKPIs>(`${API_BASE_URL}/air-quality/national_kpis/`, fetcher, DATA_OPTIONS);
}

export function useActiveAlerts() {
  // /alerts/active/ returns a direct array (custom action, not paginated)
  return useSWR<Alert[]>(`${API_BASE_URL}/alerts/active/`, fetcher, DATA_OPTIONS);
}

export function useAlerts() {
  return useSWR<Alert[]>(`${API_BASE_URL}/alerts/`, paginatedFetcher, DATA_OPTIONS);
}

export function useMeteo(params?: string) {
  const url = `${API_BASE_URL}/meteo/${params ? `?${params}` : ""}`;
  return useSWR<Meteo[]>(url, paginatedFetcher, DATA_OPTIONS);
}
