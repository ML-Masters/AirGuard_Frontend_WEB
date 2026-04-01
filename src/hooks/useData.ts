"use client";

import useSWR from "swr";
import { API_BASE_URL } from "@/lib/constants";
import { fetchWithAuth } from "@/lib/auth";
import type { Ville, AirQuality, Alert, Meteo, NationalKPIs } from "@/lib/types";

const fetcher = (url: string) => fetchWithAuth(url).then((r) => r.json());

const SLOW_DATA_OPTIONS = {
  revalidateOnFocus: false,
  revalidateIfStale: false,
  dedupingInterval: 300000, // 5 min
};

const FAST_DATA_OPTIONS = {
  revalidateOnFocus: false,
  dedupingInterval: 60000, // 1 min
};

export function useVilles() {
  return useSWR<Ville[]>(`${API_BASE_URL}/villes/`, fetcher, {
    ...SLOW_DATA_OPTIONS,
    revalidateIfStale: false,
  });
}

export function useAirQuality(params?: string) {
  const url = `${API_BASE_URL}/air-quality/${params ? `?${params}` : ""}`;
  return useSWR<AirQuality[]>(url, fetcher, SLOW_DATA_OPTIONS);
}

export function useNationalKPIs() {
  return useSWR<NationalKPIs>(`${API_BASE_URL}/air-quality/national_kpis/`, fetcher, SLOW_DATA_OPTIONS);
}

export function useActiveAlerts() {
  return useSWR<Alert[]>(`${API_BASE_URL}/alerts/active/`, fetcher, FAST_DATA_OPTIONS);
}

export function useAlerts() {
  return useSWR<Alert[]>(`${API_BASE_URL}/alerts/`, fetcher, FAST_DATA_OPTIONS);
}

export function useMeteo(params?: string) {
  const url = `${API_BASE_URL}/meteo/${params ? `?${params}` : ""}`;
  return useSWR<Meteo[]>(url, fetcher, SLOW_DATA_OPTIONS);
}
