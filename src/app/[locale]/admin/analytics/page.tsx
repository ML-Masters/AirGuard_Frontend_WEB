"use client";

import { useState, useMemo } from "react";
import { useTranslations, useLocale } from "next-intl";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ComposedChart,
  Area,
  Legend,
} from "recharts";
import { useAirQuality, useMeteo, useVilles } from "@/hooks/useData";
import KPICard from "@/components/ui/KPICard";
import { TrendingUp, TrendingDown, ThermometerSun, Droplets } from "lucide-react";
import type { AQICategory } from "@/lib/types";
import { getAQIColor } from "@/lib/utils";
import ExportButton from "@/components/ui/ExportButton";

export default function AnalyticsPage() {
  const t = useTranslations("analytics");
  const locale = useLocale();
  const { data: airQuality } = useAirQuality("est_prediction=false");
  const { data: meteo } = useMeteo();
  const { data: villes } = useVilles();
  const [selectedRegion, setSelectedRegion] = useState<string>("all");

  const dateLocale = locale === "en" ? "en-GB" : "fr-FR";

  const villeMap = useMemo(() => {
    const map = new Map<number, { nom: string; region_nom: string }>();
    if (villes) villes.forEach((v) => map.set(v.id, v));
    return map;
  }, [villes]);

  const regions = useMemo(() => {
    if (!villes) return [];
    return [...new Set(villes.map((v) => v.region_nom))].sort();
  }, [villes]);

  // Top 10 cities by AQI
  const top10 = useMemo(() => {
    if (!airQuality) return [];
    const latest = new Map<number, { indice_aqi: number; categorie: AQICategory; date: string }>();
    for (const aq of airQuality) {
      const ex = latest.get(aq.ville);
      if (!ex || aq.date_cible > ex.date) {
        latest.set(aq.ville, { indice_aqi: aq.indice_aqi, categorie: aq.categorie, date: aq.date_cible });
      }
    }
    return Array.from(latest.entries())
      .map(([villeId, data]) => ({
        nom: villeMap.get(villeId)?.nom || `Ville ${villeId}`,
        region: villeMap.get(villeId)?.region_nom || "",
        ...data,
      }))
      .filter((c) => selectedRegion === "all" || c.region === selectedRegion)
      .sort((a, b) => b.indice_aqi - a.indice_aqi)
      .slice(0, 10);
  }, [airQuality, villeMap, selectedRegion]);

  // Climate vs AQI data (joined by date)
  const climateVsAQI = useMemo(() => {
    if (!airQuality || !meteo) return [];
    const aqByDate = new Map<string, number[]>();
    for (const aq of airQuality) {
      const arr = aqByDate.get(aq.date_cible) || [];
      arr.push(aq.indice_aqi);
      aqByDate.set(aq.date_cible, arr);
    }
    const meteoByDate = new Map<string, { temp: number[]; wind: number[]; precip: number[] }>();
    for (const m of meteo) {
      const ex = meteoByDate.get(m.date) || { temp: [], wind: [], precip: [] };
      if (m.temperature_2m_mean != null) ex.temp.push(m.temperature_2m_mean);
      if (m.wind_speed_10m_max != null) ex.wind.push(m.wind_speed_10m_max);
      if (m.precipitation_sum != null) ex.precip.push(m.precipitation_sum);
      meteoByDate.set(m.date, ex);
    }
    const dates = Array.from(aqByDate.keys()).sort().slice(-30);
    return dates.map((date) => {
      const aqVals = aqByDate.get(date) || [];
      const mt = meteoByDate.get(date);
      const avg = (arr: number[]) => arr.length > 0 ? Math.round(arr.reduce((s, v) => s + v, 0) / arr.length * 10) / 10 : 0;
      return {
        date: new Date(date).toLocaleDateString(dateLocale, { day: "2-digit", month: "short" }),
        aqi: avg(aqVals),
        temperature: mt ? avg(mt.temp) : 0,
        vent: mt ? avg(mt.wind) : 0,
        precipitation: mt ? avg(mt.precip) : 0,
      };
    });
  }, [airQuality, meteo, dateLocale]);

  // Monthly averages for seasonal analysis
  const seasonalData = useMemo(() => {
    if (!airQuality) return [];
    const byMonth = new Map<number, number[]>();
    for (const aq of airQuality) {
      const month = new Date(aq.date_cible).getMonth();
      const arr = byMonth.get(month) || [];
      arr.push(aq.indice_aqi);
      byMonth.set(month, arr);
    }
    const monthNames = locale === "en"
      ? ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
      : ["Jan", "F\u00e9v", "Mar", "Avr", "Mai", "Jun", "Jul", "Ao\u00fb", "Sep", "Oct", "Nov", "D\u00e9c"];
    return Array.from(byMonth.entries())
      .sort((a, b) => a[0] - b[0])
      .map(([month, vals]) => ({
        mois: monthNames[month],
        aqi: Math.round(vals.reduce((s, v) => s + v, 0) / vals.length),
        saison: month >= 10 || month <= 2 ? "dry" : "rainy",
      }));
  }, [airQuality, locale]);

  // KPI stats
  const stats = useMemo(() => {
    if (top10.length === 0) return { worst: "\u2014", best: "\u2014", avgTemp: "\u2014" };
    return {
      worst: top10[0]?.nom || "\u2014",
      best: top10[top10.length - 1]?.nom || "\u2014",
      avgTemp: climateVsAQI.length > 0
        ? `${Math.round(climateVsAQI.reduce((s, d) => s + d.temperature, 0) / climateVsAQI.length)}\u00b0C`
        : "\u2014",
    };
  }, [top10, climateVsAQI]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text">{t("title")}</h1>
          <p className="text-text-secondary text-sm mt-1">
            {t("subtitle")}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <ExportButton
            data={top10.map((c) => ({
              ville: c.nom,
              region: c.region,
              indice_aqi: c.indice_aqi,
              categorie: c.categorie,
              date: c.date,
            }))}
            filename="airguard_analytics_export.csv"
          />
          <select
            value={selectedRegion}
            onChange={(e) => setSelectedRegion(e.target.value)}
            className="px-4 py-2 rounded-xl border border-border bg-surface text-sm text-text"
          >
            <option value="all">{t("allRegions")}</option>
            {regions.map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <KPICard
          title={t("mostPolluted")}
          value={stats.worst}
          icon={<TrendingUp className="w-6 h-6" />}
          color="#EF4444"
        />
        <KPICard
          title={t("leastPolluted")}
          value={stats.best}
          icon={<TrendingDown className="w-6 h-6" />}
          color="#22C55E"
        />
        <KPICard
          title={t("avgTemperature")}
          value={stats.avgTemp}
          icon={<ThermometerSun className="w-6 h-6" />}
          color="#F97316"
        />
      </div>

      {/* Climate vs AQI */}
      <div className="bg-surface rounded-2xl border border-border p-6">
        <h3 className="text-sm font-semibold text-text mb-4">
          {t("climateVsAir")}
        </h3>
        <ResponsiveContainer width="100%" height={250}>
          <ComposedChart data={climateVsAQI} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
            <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#64748B" }} tickLine={false} axisLine={false} />
            <YAxis yAxisId="left" tick={{ fontSize: 11, fill: "#64748B" }} tickLine={false} axisLine={false} />
            <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11, fill: "#64748B" }} tickLine={false} axisLine={false} />
            <Tooltip contentStyle={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 12, fontSize: 13 }} />
            <Legend />
            <Area yAxisId="left" type="monotone" dataKey="aqi" name="AQI" fill="#0F766E20" stroke="#0F766E" strokeWidth={2} />
            <Bar yAxisId="right" dataKey="temperature" name={`${t("temperature")} (\u00b0C)`} fill="#F9731660" radius={[4, 4, 0, 0]} />
            <Line yAxisId="right" type="monotone" dataKey="vent" name={`${t("wind")} (km/h)`} stroke="#3B82F6" strokeWidth={1.5} dot={false} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Top 10 Cities */}
        <div className="bg-surface rounded-2xl border border-border p-6">
          <h3 className="text-sm font-semibold text-text mb-4">
            {t("top10")}
          </h3>
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={top10} layout="vertical" margin={{ top: 0, right: 10, left: 60, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 11, fill: "#64748B" }} tickLine={false} axisLine={false} />
              <YAxis type="category" dataKey="nom" tick={{ fontSize: 12, fill: "#1E293B" }} tickLine={false} axisLine={false} width={80} />
              <Tooltip contentStyle={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 12, fontSize: 13 }} />
              <Bar dataKey="indice_aqi" name="AQI" radius={[0, 6, 6, 0]}>
                {top10.map((entry, i) => (
                  <rect key={i} fill={getAQIColor(entry.categorie)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Seasonal Analysis */}
        <div className="bg-surface rounded-2xl border border-border p-6">
          <h3 className="text-sm font-semibold text-text mb-4">
            {t("seasonal")}
          </h3>
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={seasonalData} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis dataKey="mois" tick={{ fontSize: 11, fill: "#64748B" }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#64748B" }} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 12, fontSize: 13 }} />
              <Bar dataKey="aqi" name={t("avgAqi")} radius={[6, 6, 0, 0]}>
                {seasonalData.map((entry, i) => (
                  <rect key={i} fill={entry.saison === "dry" ? "#F59E0B" : "#3B82F6"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <div className="flex items-center gap-4 mt-3 justify-center text-xs text-text-secondary">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-[#F59E0B]" /> {t("drySeason")}
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-[#3B82F6]" /> {t("rainySeason")}
            </span>
          </div>
        </div>
      </div>

      {/* Correlation Matrix */}
      <div className="bg-surface rounded-2xl border border-border p-6">
        <h3 className="text-sm font-semibold text-text mb-4">
          {t("correlation")}
        </h3>
        <CorrelationMatrix data={climateVsAQI} labels={{ aqi: "AQI", temperature: t("temperature"), vent: t("wind"), precipitation: t("precipitation") }} />
      </div>
    </div>
  );
}

function CorrelationMatrix({ data, labels }: { data: { aqi: number; temperature: number; vent: number; precipitation: number }[]; labels: Record<string, string> }) {
  const vars = ["aqi", "temperature", "vent", "precipitation"] as const;

  function pearson(a: number[], b: number[]): number {
    const n = a.length;
    if (n === 0) return 0;
    const avgA = a.reduce((s, v) => s + v, 0) / n;
    const avgB = b.reduce((s, v) => s + v, 0) / n;
    let num = 0, denA = 0, denB = 0;
    for (let i = 0; i < n; i++) {
      const da = a[i] - avgA;
      const db = b[i] - avgB;
      num += da * db;
      denA += da * da;
      denB += db * db;
    }
    const den = Math.sqrt(denA * denB);
    return den === 0 ? 0 : num / den;
  }

  const matrix = vars.map((v1) =>
    vars.map((v2) => {
      const a = data.map((d) => d[v1]);
      const b = data.map((d) => d[v2]);
      return Math.round(pearson(a, b) * 100) / 100;
    })
  );

  function getCellColor(val: number): string {
    if (val >= 0.7) return "#EF444440";
    if (val >= 0.4) return "#F9731630";
    if (val >= 0.1) return "#EAB30820";
    if (val <= -0.7) return "#22C55E40";
    if (val <= -0.4) return "#14B8A630";
    if (val <= -0.1) return "#0F766E20";
    return "#F1F5F9";
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr>
            <th className="p-3 text-left text-text-secondary font-medium" />
            {vars.map((v) => (
              <th key={v} className="p-3 text-center text-text-secondary font-medium">{labels[v]}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {vars.map((v1, i) => (
            <tr key={v1}>
              <td className="p-3 font-medium text-text">{labels[v1]}</td>
              {vars.map((v2, j) => (
                <td
                  key={v2}
                  className="p-3 text-center font-semibold rounded-lg"
                  style={{ backgroundColor: getCellColor(matrix[i][j]), color: "#1E293B" }}
                >
                  {matrix[i][j].toFixed(2)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
