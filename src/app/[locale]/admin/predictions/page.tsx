"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Thermometer, Droplets, Wind, Calendar, ChevronRight } from "lucide-react";
import { useVilles } from "@/hooks/useData";
import { api } from "@/lib/api";
import { getAQIColor } from "@/lib/utils";

interface TomorrowPrediction {
  ville: string;
  date: string;
  aqi: number;
  pm25: number;
  categorie: string;
  label: string;
  conseil: string;
  chaleur: { heat_index: number; extreme: number; avertissement: string };
  risques: { inondation: number; secheresse: number; categorie_inondation: string };
}

interface WeekPrediction {
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
}

export default function PredictionsPage() {
  const t = useTranslations("predictions");
  const { data: villes } = useVilles();
  const [selectedVille, setSelectedVille] = useState("");
  const [mode, setMode] = useState<"tomorrow" | "week">("tomorrow");
  const [tomorrow, setTomorrow] = useState<TomorrowPrediction | null>(null);
  const [week, setWeek] = useState<WeekPrediction | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  useEffect(() => {
    if (!selectedVille) return;
    setLoading(true);
    setError("");
    setTomorrow(null);
    setWeek(null);
    setSelectedDay(null);

    if (mode === "tomorrow") {
      api.getPredictionTomorrow(selectedVille)
        .then(setTomorrow)
        .catch((e) => setError(e.message))
        .finally(() => setLoading(false));
    } else {
      api.getPredictionWeek(selectedVille)
        .then(setWeek)
        .catch((e) => setError(e.message))
        .finally(() => setLoading(false));
    }
  }, [selectedVille, mode]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text">{t("title")}</h1>
        <p className="text-text-secondary text-sm mt-1">{t("subtitle")}</p>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4">
        <select
          value={selectedVille}
          onChange={(e) => setSelectedVille(e.target.value)}
          className="flex-1 sm:max-w-xs px-4 py-2.5 rounded-xl border border-border bg-surface text-sm text-text"
        >
          <option value="">{t("chooseCity")}</option>
          {villes?.map((v) => (
            <option key={v.id} value={v.nom}>{v.nom} — {v.region_nom}</option>
          ))}
        </select>

        <div className="flex gap-2">
          <button
            onClick={() => setMode("tomorrow")}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
              mode === "tomorrow" ? "bg-primary text-white" : "bg-surface border border-border text-text"
            }`}
          >
            {t("tomorrow")}
          </button>
          <button
            onClick={() => setMode("week")}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
              mode === "week" ? "bg-primary text-white" : "bg-surface border border-border text-text"
            }`}
          >
            {t("thisWeek")}
          </button>
        </div>
      </div>

      {!selectedVille && (
        <div className="bg-surface rounded-2xl border border-border p-12 text-center">
          <Calendar className="w-12 h-12 text-text-secondary/30 mx-auto mb-3" />
          <p className="text-text-secondary">{t("selectCityPrompt")}</p>
        </div>
      )}

      {loading && (
        <div className="bg-surface rounded-2xl border border-border p-12 text-center">
          <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-3" />
          <p className="text-text-secondary text-sm">{t("calculating")}</p>
        </div>
      )}

      {error && (
        <div className="bg-red-50 rounded-xl border border-red-200 p-4">
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      {/* Tomorrow view */}
      {mode === "tomorrow" && tomorrow && !loading && (
        <div className="space-y-4">
          {/* Main AQI card */}
          <div className="bg-surface rounded-2xl border border-border p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row sm:items-center gap-6">
              <div
                className="w-20 h-20 rounded-2xl flex items-center justify-center text-white text-2xl font-bold shrink-0"
                style={{ backgroundColor: getAQIColor(tomorrow.categorie as never) }}
              >
                {tomorrow.aqi}
              </div>
              <div className="flex-1">
                <p className="text-text-secondary text-sm">{tomorrow.date}</p>
                <h2 className="text-xl font-bold text-text">{tomorrow.label}</h2>
                <p className="text-text-secondary mt-1">{tomorrow.conseil}</p>
                <p className="text-text-secondary text-xs mt-2">
                  PM2.5 : {tomorrow.pm25} µg/m³ · Indice AQI : {tomorrow.aqi}
                </p>
              </div>
            </div>
          </div>

          {/* Detail cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-surface rounded-2xl border border-border p-5">
              <div className="flex items-center gap-2 mb-3">
                <Thermometer className="w-5 h-5 text-orange-500" />
                <span className="text-sm font-semibold text-text">{t("heat")}</span>
              </div>
              <p className="text-2xl font-bold text-text">{tomorrow.chaleur.heat_index}°C</p>
              <p className="text-text-secondary text-sm">{t("feelsLike")}</p>
              <p className="text-xs mt-2" style={{ color: tomorrow.chaleur.avertissement === "Danger" ? "#EF4444" : "#22C55E" }}>
                {tomorrow.chaleur.avertissement === "Danger" ? t("extremeHeatRisk") : t("normalTemp")}
              </p>
            </div>
            <div className="bg-surface rounded-2xl border border-border p-5">
              <div className="flex items-center gap-2 mb-3">
                <Droplets className="w-5 h-5 text-blue-500" />
                <span className="text-sm font-semibold text-text">{t("flooding")}</span>
              </div>
              <p className="text-2xl font-bold text-text">{tomorrow.risques.inondation}/10</p>
              <p className="text-text-secondary text-sm">{tomorrow.risques.categorie_inondation}</p>
            </div>
            <div className="bg-surface rounded-2xl border border-border p-5">
              <div className="flex items-center gap-2 mb-3">
                <Wind className="w-5 h-5 text-amber-500" />
                <span className="text-sm font-semibold text-text">{t("drought")}</span>
              </div>
              <p className="text-2xl font-bold text-text">{tomorrow.risques.secheresse.toFixed(1)}</p>
              <p className="text-text-secondary text-sm">{t("waterStressLabel")}</p>
            </div>
          </div>
        </div>
      )}

      {/* Week view */}
      {mode === "week" && week && !loading && (
        <div className="space-y-4">
          <div className="bg-surface rounded-2xl border border-border p-5">
            <p className="text-text-secondary text-sm">{t("weekOf")} {week.semaine}</p>
            <p className="text-text font-semibold mt-1">{week.resume}</p>
          </div>

          <div className="space-y-3">
            {week.jours.map((jour, i) => (
              <div
                key={jour.date}
                className="bg-surface rounded-xl border border-border overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => setSelectedDay(selectedDay === i ? null : i)}
              >
                <div className="flex items-center gap-4 p-4">
                  <div
                    className="w-1.5 h-12 rounded-full shrink-0"
                    style={{ backgroundColor: getAQIColor(jour.categorie as never) }}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-text">{jour.jour}</span>
                      <span className="text-text-secondary text-xs">{jour.date}</span>
                    </div>
                    <p className="text-sm mt-0.5" style={{ color: getAQIColor(jour.categorie as never) }}>
                      {jour.label} — AQI {jour.aqi}
                    </p>
                  </div>
                  <ChevronRight className={`w-4 h-4 text-text-secondary transition-transform ${selectedDay === i ? "rotate-90" : ""}`} />
                </div>
                {selectedDay === i && (
                  <div className="px-4 pb-4 pt-0 border-t border-border">
                    <p className="text-sm text-text-secondary mt-3">{jour.conseil}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
