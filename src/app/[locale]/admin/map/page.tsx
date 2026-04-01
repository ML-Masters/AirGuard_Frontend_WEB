"use client";

import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";
import { useVilles, useAirQuality } from "@/hooks/useData";
import type { AQICategory, Ville } from "@/lib/types";

const DashboardMap = dynamic(() => import("@/components/map/DashboardMap"), {
  ssr: false,
  loading: () => <div className="h-[calc(100dvh-6rem)] sm:h-[calc(100dvh-8rem)] animate-pulse bg-surface rounded-2xl" />,
});

export default function MapPage() {
  const t = useTranslations("map");
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
      <div>
        <h1 className="text-2xl font-bold text-text">{t("title")}</h1>
        <p className="text-text-secondary text-sm mt-1">
          {t("subtitle")}
        </p>
      </div>
      <DashboardMap cities={mapCities} height="calc(100dvh - 10rem)" />
    </div>
  );
}
