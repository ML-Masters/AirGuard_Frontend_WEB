"use client";

import dynamic from "next/dynamic";
import { Wind, AlertTriangle, MapPin, Activity } from "lucide-react";
import KPICard from "@/components/ui/KPICard";
import SeverityBadge from "@/components/ui/SeverityBadge";
import AQIBadge from "@/components/ui/AQIBadge";
import AQIAreaChart from "@/components/charts/AQIAreaChart";
import { KPISkeleton, ChartSkeleton, TableSkeleton } from "@/components/ui/LoadingSkeleton";
import { useVilles, useActiveAlerts, useAirQuality } from "@/hooks/useData";
import { timeAgo } from "@/lib/utils";
import type { AQICategory, Ville } from "@/lib/types";

const DashboardMap = dynamic(() => import("@/components/map/DashboardMap"), {
  ssr: false,
  loading: () => (
    <div className="bg-surface rounded-2xl border border-border h-[400px] animate-pulse" />
  ),
});

export default function DashboardHome() {
  const { data: villes, isLoading: loadingVilles } = useVilles();
  const { data: alerts, isLoading: loadingAlerts } = useActiveAlerts();
  const { data: airQuality, isLoading: loadingAQ } = useAirQuality("est_prediction=false");

  const isLoading = loadingVilles || loadingAlerts || loadingAQ;

  // Compute KPIs from air quality data
  const latestByCity = new Map<number, { indice_aqi: number; categorie: AQICategory; date_cible: string }>();
  if (airQuality) {
    for (const aq of airQuality) {
      const existing = latestByCity.get(aq.ville);
      if (!existing || aq.date_cible > existing.date_cible) {
        latestByCity.set(aq.ville, aq);
      }
    }
  }

  const cityAQIs = Array.from(latestByCity.values());
  const avgAQI =
    cityAQIs.length > 0
      ? Math.round(cityAQIs.reduce((s, c) => s + c.indice_aqi, 0) / cityAQIs.length)
      : 0;
  const criticalCities = cityAQIs.filter((c) =>
    ["Malsain", "Tres_malsain", "Dangereux"].includes(c.categorie)
  ).length;

  // Map data: join villes with their latest AQI
  const villeMap = new Map<number, Ville>();
  if (villes) villes.forEach((v) => villeMap.set(v.id, v));

  const mapCities = Array.from(latestByCity.entries())
    .map(([villeId, aq]) => {
      const ville = villeMap.get(villeId);
      if (!ville) return null;
      return { ville, indice_aqi: aq.indice_aqi, categorie: aq.categorie };
    })
    .filter(Boolean) as { ville: Ville; indice_aqi: number; categorie: AQICategory }[];

  // 30-day chart data
  const chartData: { date: string; aqi: number }[] = [];
  if (airQuality) {
    const byDate = new Map<string, number[]>();
    for (const aq of airQuality) {
      const arr = byDate.get(aq.date_cible) || [];
      arr.push(aq.indice_aqi);
      byDate.set(aq.date_cible, arr);
    }
    const sorted = Array.from(byDate.entries()).sort((a, b) => a[0].localeCompare(b[0]));
    for (const [date, vals] of sorted.slice(-30)) {
      chartData.push({
        date: new Date(date).toLocaleDateString("fr-FR", { day: "2-digit", month: "short" }),
        aqi: Math.round(vals.reduce((s, v) => s + v, 0) / vals.length),
      });
    }
  }

  // Recent alerts (top 5)
  const recentAlerts = alerts?.slice(0, 5) || [];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-text">Tableau de bord</h1>
        <p className="text-text-secondary text-sm mt-1">
          Vue d&apos;ensemble de la qualité de l&apos;air au Cameroun
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="AQI moyen national"
          value={avgAQI || "—"}
          icon={<Wind className="w-6 h-6" />}
          color="#0F766E"
          subtitle={cityAQIs.length > 0 ? `sur ${cityAQIs.length} villes` : undefined}
        />
        <KPICard
          title="Villes en zone critique"
          value={criticalCities}
          icon={<AlertTriangle className="w-6 h-6" />}
          color="#EF4444"
          subtitle="Malsain ou pire"
        />
        <KPICard
          title="Villes surveillées"
          value={villes?.length || 0}
          icon={<MapPin className="w-6 h-6" />}
          color="#3B82F6"
          subtitle="10 régions"
        />
        <KPICard
          title="Alertes actives"
          value={alerts?.length || 0}
          icon={<Activity className="w-6 h-6" />}
          color="#F59E0B"
        />
      </div>

      {/* Map + Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <DashboardMap cities={mapCities} height="420px" />
        </div>
        <div className="bg-surface rounded-2xl border border-border p-6">
          <h3 className="text-sm font-semibold text-text mb-4">Alertes récentes</h3>
          {recentAlerts.length === 0 ? (
            <p className="text-text-secondary text-sm">Aucune alerte active</p>
          ) : (
            <div className="space-y-3">
              {recentAlerts.map((alert) => {
                const ville = villeMap.get(alert.ville);
                return (
                  <div
                    key={alert.id}
                    className="flex items-start gap-3 p-3 rounded-xl bg-primary-bg/50"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium text-text truncate">
                          {ville?.nom || `Ville #${alert.ville}`}
                        </span>
                        <SeverityBadge niveau={alert.niveau_severite} />
                      </div>
                      <p className="text-xs text-text-secondary line-clamp-2">
                        {alert.message_fr}
                      </p>
                      <p className="text-xs text-text-secondary mt-1">
                        {timeAgo(alert.date_creation)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Chart */}
      {chartData.length > 0 && <AQIAreaChart data={chartData} />}
    </div>
  );
}
