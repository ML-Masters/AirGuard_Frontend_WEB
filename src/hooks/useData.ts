"use client";

import useSWR from "swr";
import { API_BASE_URL } from "@/lib/constants";
import type { Ville, AirQuality, Alert, Meteo, NationalKPIs } from "@/lib/types";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export function useVilles() {
  return useSWR<Ville[]>(`${API_BASE_URL}/villes/`, fetcher);
}

export function useAirQuality(params?: string) {
  const url = `${API_BASE_URL}/air-quality/${params ? `?${params}` : ""}`;
  return useSWR<AirQuality[]>(url, fetcher);
}

export function useNationalKPIs() {
  return useSWR<NationalKPIs>(`${API_BASE_URL}/air-quality/national_kpis/`, fetcher);
}

export function useActiveAlerts() {
  return useSWR<Alert[]>(`${API_BASE_URL}/alerts/active/`, fetcher);
}

export function useAlerts() {
  return useSWR<Alert[]>(`${API_BASE_URL}/alerts/`, fetcher);
}

export function useMeteo(params?: string) {
  const url = `${API_BASE_URL}/meteo/${params ? `?${params}` : ""}`;
  return useSWR<Meteo[]>(url, fetcher);
}
