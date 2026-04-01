"use client";

import { useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { BrainCircuit, Droplets, Flame, CloudRain } from "lucide-react";
import { useVilles, useAirQuality } from "@/hooks/useData";
import { api } from "@/lib/api";
import KPICard from "@/components/ui/KPICard";
import AQIBadge from "@/components/ui/AQIBadge";
import type { PredictionResult, AQICategory } from "@/lib/types";
import { getAQIColor } from "@/lib/utils";

export default function PredictionsPage() {
  const { data: villes } = useVilles();
  const [selectedCity, setSelectedCity] = useState<string>("");
  const [prediction, setPrediction] = useState<PredictionResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");

  const { data: cityAQ } = useAirQuality(
    selectedCity ? `ville__nom=${encodeURIComponent(selectedCity)}&est_prediction=false` : ""
  );
  const { data: cityPredictions } = useAirQuality(
    selectedCity ? `ville__nom=${encodeURIComponent(selectedCity)}&est_prediction=true` : ""
  );

  const handlePredict = async () => {
    if (!selectedCity) return;
    setLoading(true);
    setError("");
    try {
      const result = await api.predict(selectedCity);
      if ("error" in result) {
        setError((result as unknown as { error: string }).error);
      } else {
        setPrediction(result);
      }
    } catch (e) {
      setError("Erreur lors de la prédiction. Vérifiez que la ville est reconnue par le modèle.");
    } finally {
      setLoading(false);
    }
  };

  // Chart: historical + predictions
  const chartData = (() => {
    const data: { date: string; aqi: number; type: string }[] = [];
    if (cityAQ) {
      const sorted = [...cityAQ].sort((a, b) => a.date_cible.localeCompare(b.date_cible)).slice(-14);
      for (const aq of sorted) {
        data.push({
          date: new Date(aq.date_cible).toLocaleDateString("fr-FR", { day: "2-digit", month: "short" }),
          aqi: aq.indice_aqi,
          type: "historique",
        });
      }
    }
    if (cityPredictions) {
      const sorted = [...cityPredictions].sort((a, b) => a.date_cible.localeCompare(b.date_cible)).slice(0, 7);
      for (const aq of sorted) {
        data.push({
          date: new Date(aq.date_cible).toLocaleDateString("fr-FR", { day: "2-digit", month: "short" }),
          aqi: aq.indice_aqi,
          type: "prediction",
        });
      }
    }
    return data;
  })();

  const todayIndex = cityAQ ? Math.min(cityAQ.length, 14) - 1 : -1;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text">Prédictions ML</h1>
        <p className="text-text-secondary text-sm mt-1">
          Prédictions multi-risques par ville
        </p>
      </div>

      {/* City selector */}
      <div className="bg-surface rounded-2xl border border-border p-6">
        <div className="flex items-end gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-text mb-2">
              Sélectionner une ville
            </label>
            <select
              value={selectedCity}
              onChange={(e) => {
                setSelectedCity(e.target.value);
                setPrediction(null);
                setError("");
              }}
              className="w-full px-4 py-3 rounded-xl border border-border bg-white text-text"
            >
              <option value="">— Choisir une ville —</option>
              {villes?.map((v) => (
                <option key={v.id} value={v.nom}>
                  {v.nom} ({v.region_nom})
                </option>
              ))}
            </select>
          </div>
          <button
            onClick={handlePredict}
            disabled={!selectedCity || loading}
            className="px-6 py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary-dark transition-colors disabled:opacity-50"
          >
            {loading ? "Analyse..." : "Lancer la prédiction"}
          </button>
        </div>
        {error && (
          <p className="mt-3 text-sm text-red-500">{error}</p>
        )}
      </div>

      {/* Prediction results */}
      {prediction && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-surface rounded-2xl border border-border p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${getAQIColor(prediction.predictions.qualite_air.categorie as AQICategory)}20` }}>
                  <BrainCircuit className="w-5 h-5" style={{ color: getAQIColor(prediction.predictions.qualite_air.categorie as AQICategory) }} />
                </div>
                <div>
                  <p className="text-xs text-text-secondary">Qualité de l&apos;air</p>
                  <p className="text-lg font-bold text-text">AQI {prediction.predictions.qualite_air.aqi_estime}</p>
                </div>
              </div>
              <AQIBadge categorie={prediction.predictions.qualite_air.categorie as AQICategory} />
              <p className="text-xs text-text-secondary mt-2">
                PM2.5 : {prediction.predictions.qualite_air.pm25_proxy_ugm3} µg/m³
              </p>
            </div>

            <div className="bg-surface rounded-2xl border border-border p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center">
                  <Flame className="w-5 h-5 text-orange-500" />
                </div>
                <div>
                  <p className="text-xs text-text-secondary">Risque thermique</p>
                  <p className="text-lg font-bold text-text">
                    {prediction.predictions.chaleur_sante.heat_index_ressenti}°C
                  </p>
                </div>
              </div>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-semibold ${
                prediction.predictions.chaleur_sante.avertissement === "Danger"
                  ? "bg-red-100 text-red-700"
                  : "bg-green-100 text-green-700"
              }`}>
                {prediction.predictions.chaleur_sante.avertissement}
              </span>
              <p className="text-xs text-text-secondary mt-2">
                Chaleur extrême : {prediction.predictions.chaleur_sante.chaleur_extreme_0_10}/10
              </p>
            </div>

            <div className="bg-surface rounded-2xl border border-border p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                  <CloudRain className="w-5 h-5 text-blue-500" />
                </div>
                <div>
                  <p className="text-xs text-text-secondary">Risques naturels</p>
                  <p className="text-lg font-bold text-text">
                    {prediction.predictions.risques_naturels.categorie_inondation}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Droplets className="w-4 h-4 text-blue-400" />
                <span className="text-xs text-text-secondary">
                  Stress hydrique : {prediction.predictions.risques_naturels.stress_hydrique_agricole}
                </span>
              </div>
              <p className="text-xs text-text-secondary mt-1">
                Inondation : {prediction.predictions.risques_naturels.risque_inondation_0_10}/10
              </p>
            </div>
          </div>
        </>
      )}

      {/* Historical + Prediction chart */}
      {chartData.length > 0 && (
        <div className="bg-surface rounded-2xl border border-border p-6">
          <h3 className="text-sm font-semibold text-text mb-4">
            Historique et prédictions — {selectedCity}
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={chartData} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="histGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0F766E" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#0F766E" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#64748B" }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#64748B" }} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 12, fontSize: 13 }} />
              {todayIndex >= 0 && (
                <ReferenceLine
                  x={chartData[todayIndex]?.date}
                  stroke="#64748B"
                  strokeDasharray="4 4"
                  label={{ value: "Aujourd'hui", position: "top", fontSize: 11, fill: "#64748B" }}
                />
              )}
              <Area
                type="monotone"
                dataKey="aqi"
                stroke="#0F766E"
                strokeWidth={2}
                fill="url(#histGrad)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}

      {!selectedCity && (
        <div className="bg-surface rounded-2xl border border-border p-12 text-center">
          <BrainCircuit className="w-12 h-12 text-text-secondary mx-auto mb-4" />
          <p className="text-text-secondary">Sélectionnez une ville pour voir les prédictions</p>
        </div>
      )}
    </div>
  );
}
