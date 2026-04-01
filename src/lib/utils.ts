import type { AQICategory } from "./types";
import { AQI_COLORS, AQI_LABELS_FR, AQI_LABELS_EN } from "./constants";

export function getAQIColor(categorie: AQICategory): string {
  return AQI_COLORS[categorie] || "#64748B";
}

export function getAQILabel(categorie: AQICategory, locale: string = "fr"): string {
  const labels = locale === "en" ? AQI_LABELS_EN : AQI_LABELS_FR;
  return labels[categorie] || categorie;
}

export function formatDate(dateStr: string, locale: string = "fr"): string {
  return new Date(dateStr).toLocaleDateString(locale === "fr" ? "fr-FR" : "en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function timeAgo(dateStr: string): string {
  const now = new Date();
  const date = new Date(dateStr);
  const diff = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diff < 60) return "à l'instant";
  if (diff < 3600) return `il y a ${Math.floor(diff / 60)}min`;
  if (diff < 86400) return `il y a ${Math.floor(diff / 3600)}h`;
  return `il y a ${Math.floor(diff / 86400)}j`;
}

export function downloadCSV(data: Record<string, unknown>[], filename: string) {
  if (!data.length) return;
  const headers = Object.keys(data[0]);
  const csvRows = [
    headers.join(','),
    ...data.map(row =>
      headers.map(h => {
        const val = row[h];
        const str = val === null || val === undefined ? '' : String(val);
        return str.includes(',') || str.includes('"') || str.includes('\n')
          ? `"${str.replace(/"/g, '""')}"`
          : str;
      }).join(',')
    ),
  ];
  const blob = new Blob(['\uFEFF' + csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
