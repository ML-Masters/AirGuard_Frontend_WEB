"use client";

import { API_BASE_URL } from "./constants";

const ACCESS_KEY = "airguard_access";
const REFRESH_KEY = "airguard_refresh";

export function getAccessToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(ACCESS_KEY);
}

export function getRefreshToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(REFRESH_KEY);
}

export function setTokens(access: string, refresh: string) {
  localStorage.setItem(ACCESS_KEY, access);
  localStorage.setItem(REFRESH_KEY, refresh);
}

export function clearTokens() {
  localStorage.removeItem(ACCESS_KEY);
  localStorage.removeItem(REFRESH_KEY);
}

export function isLoggedIn(): boolean {
  return !!getAccessToken();
}

export async function login(email: string, password: string): Promise<{ success: boolean; error?: string }> {
  try {
    const res = await fetch(`${API_BASE_URL}/login/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) {
      return { success: false, error: "Email ou mot de passe incorrect" };
    }
    const data = await res.json();
    setTokens(data.access, data.refresh);
    return { success: true };
  } catch {
    return { success: false, error: "Impossible de contacter le serveur" };
  }
}

export async function refreshAccessToken(): Promise<boolean> {
  const refresh = getRefreshToken();
  if (!refresh) return false;

  try {
    const res = await fetch(`${API_BASE_URL}/token/refresh/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh }),
    });
    if (!res.ok) {
      clearTokens();
      return false;
    }
    const data = await res.json();
    setTokens(data.access, data.refresh || refresh);
    return true;
  } catch {
    clearTokens();
    return false;
  }
}

export async function fetchWithAuth(url: string, options: RequestInit = {}): Promise<Response> {
  let token = getAccessToken();

  let res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  // If 401, try refresh
  if (res.status === 401 && getRefreshToken()) {
    const refreshed = await refreshAccessToken();
    if (refreshed) {
      token = getAccessToken();
      res = await fetch(url, {
        ...options,
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          ...options.headers,
        },
      });
    }
  }

  return res;
}

export function logout() {
  clearTokens();
  // TODO: Use the current locale instead of hardcoded /fr/. This is a non-component
  // context so we can't use useLocale(). Consider reading from the URL path or a cookie.
  const match = window.location.pathname.match(/^\/(fr|en)\//);
  const locale = match ? match[1] : "fr";
  window.location.href = `/${locale}/login`;
}
