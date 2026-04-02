"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";
import { Flame, MapPin } from "lucide-react";
import { useVilles, useAirQuality } from "@/hooks/useData";
import type { AQICategory, Ville } from "@/lib/types";

const DashboardMap = dynamic(() => import("@/components/map/DashboardMap"), {
  ssr: false,
  loading: () => <div className="h-[calc(100dvh-6rem)] sm:h-[calc(100dvh-8rem)] animate-pulse bg-surface rounded-2xl" />,
});

const HeatMap = dynamic(() => import("@/components/map/HeatMap"), {
  ssr: false,
  loading: () => <div className="h-[calc(100dvh-6rem)] sm:h-[calc(100dvh-8rem)] animate-pulse bg-surface rounded-2xl" />,
});

export default function MapPage() {
  const t = useTranslations("map");
  const [mode, setMode] = useState<"markers" | "heatmap">("markers");
  const { data: villes } = useVilles();
  const { data: airQuality } = useAirQuality("est_prediction=false");

  const latestByCity = new Map<number, { indice_aqi: number; categorie: AQICategory }>();
  if (airQuality) {
    for (const aq of airQuality) {
      const existing = latestByCity.get(aq.ville);
      if (!existing) latestByCity.set(aq.ville, aq);
    }
  }

  const villeMap = new Map<number, Ville>();
  if (villes) villes.forEach((v) => villeMap.set(v.id, v));

  const mapCities = Array.from(latestByCity.entries())
    .map(([villeId, aq]) => {
      const ville = villeMap.get(villeId);
      if (!ville) return null;
      return { ville, indice_aqi: aq.indice_aqi, categorie: aq.categorie };
    })
    .filter(Boolean) as { ville: Ville; indice_aqi: number; categorie: AQICategory }[];

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-text">{t("title")}</h1>
          <p className="text-text-secondary text-sm mt-1">{t("subtitle")}</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setMode("markers")}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
              mode === "markers"
                ? "bg-primary text-white"
                : "bg-surface border border-border text-text hover:bg-gray-50"
            }`}
          >
            <MapPin className="w-4 h-4" />
            {t("markers")}
          </button>
          <button
            onClick={() => setMode("heatmap")}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
              mode === "heatmap"
                ? "bg-primary text-white"
                : "bg-surface border border-border text-text hover:bg-gray-50"
            }`}
          >
            <Flame className="w-4 h-4" />
            {t("heatmap")}
          </button>
        </div>
      </div>

      {mode === "markers" ? (
        <DashboardMap cities={mapCities} height="calc(100dvh - 10rem)" />
      ) : (
        <HeatMap cities={mapCities} height="calc(100dvh - 10rem)" />
      )}
    </div>
  );
}
