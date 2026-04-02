"use client";

import { useState } from "react";
import { FileText, Download, BarChart3, Cloud } from "lucide-react";
import { useTranslations } from "next-intl";
import { useVilles, useAirQuality, useMeteo } from "@/hooks/useData";
import { API_BASE_URL } from "@/lib/constants";
import { fetchWithAuth } from "@/lib/auth";
import { downloadCSV } from "@/lib/utils";

export default function ReportsPage() {
  const t = useTranslations("reports");
  const { data: villes } = useVilles();
  const { data: airQuality } = useAirQuality("est_prediction=false");
  const { data: meteo } = useMeteo();
  const [selectedVille, setSelectedVille] = useState<string>("");
  const [downloading, setDownloading] = useState<string | null>(null);

  const handleDownloadPDF = async () => {
    setDownloading("pdf");
    try {
      const res = await fetchWithAuth(`${API_BASE_URL}/air-quality/reports/pdf/`);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Rapport_AirGuard_National.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      // ignore
    }
    setDownloading(null);
  };

  const handleExportAQI = () => {
    if (!airQuality || !villes) return;
    setDownloading("aqi");
    const villeMap = new Map(villes.map((v) => [v.id, v]));
    let data = airQuality;
    if (selectedVille) {
      data = data.filter((aq) => {
        const v = villeMap.get(aq.ville);
        return v?.nom === selectedVille;
      });
    }
    const exportData = data.map((aq) => {
      const v = villeMap.get(aq.ville);
      return {
        ville: v?.nom || "",
        region: v?.region_nom || "",
        date: aq.date_cible,
        indice_aqi: aq.indice_aqi,
        pm25: aq.valeur_pm25,
        categorie: aq.categorie,
      };
    });
    const filename = selectedVille
      ? `airguard_aqi_${selectedVille}.csv`
      : "airguard_aqi_national.csv";
    downloadCSV(exportData, filename);
    setDownloading(null);
  };

  const handleExportMeteo = () => {
    if (!meteo || !villes) return;
    setDownloading("meteo");
    const villeMap = new Map(villes.map((v) => [v.id, v]));
    let data = meteo;
    if (selectedVille) {
      data = data.filter((m) => {
        const v = villeMap.get(m.ville);
        return v?.nom === selectedVille;
      });
    }
    const exportData = data.map((m) => {
      const v = villeMap.get(m.ville);
      return {
        ville: v?.nom || "",
        date: m.date,
        temp_max: m.temperature_2m_max,
        temp_min: m.temperature_2m_min,
        temp_mean: m.temperature_2m_mean,
        precipitation: m.precipitation_sum,
        vent_max: m.wind_speed_10m_max,
        radiation: m.shortwave_radiation_sum,
      };
    });
    const filename = selectedVille
      ? `airguard_meteo_${selectedVille}.csv`
      : "airguard_meteo_national.csv";
    downloadCSV(exportData, filename);
    setDownloading(null);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text">{t("title")}</h1>
        <p className="text-text-secondary text-sm mt-1">{t("subtitle")}</p>
      </div>

      {/* City filter */}
      <div className="bg-surface rounded-2xl border border-border p-6">
        <h3 className="text-sm font-semibold text-text mb-3">Filtrer par ville</h3>
        <select
          value={selectedVille}
          onChange={(e) => setSelectedVille(e.target.value)}
          className="w-full sm:w-80 px-4 py-2.5 rounded-xl border border-border bg-white text-sm text-text"
        >
          <option value="">Toutes les villes (national)</option>
          {villes?.map((v) => (
            <option key={v.id} value={v.nom}>
              {v.nom} — {v.region_nom}
            </option>
          ))}
        </select>
        {selectedVille && (
          <p className="text-primary text-sm mt-2 font-medium">
            Rapports filtrés pour : {selectedVille}
          </p>
        )}
      </div>

      {/* Report cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* PDF National */}
        <div className="bg-surface rounded-2xl border border-border p-6 sm:p-8 flex flex-col">
          <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center mb-4">
            <FileText className="w-6 h-6 text-red-500" />
          </div>
          <h3 className="font-semibold text-text">Rapport PDF</h3>
          <p className="text-text-secondary text-sm mt-1 flex-1">
            Rapport national complet avec KPIs, top 10 villes, distribution AQI et alertes actives.
          </p>
          <button
            onClick={handleDownloadPDF}
            disabled={downloading === "pdf"}
            className="mt-4 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-primary text-white rounded-xl text-sm font-medium hover:bg-primary-dark transition-colors disabled:opacity-50 w-full"
          >
            <Download className="w-4 h-4" />
            {downloading === "pdf" ? "Génération..." : "Télécharger PDF"}
          </button>
        </div>

        {/* CSV AQI */}
        <div className="bg-surface rounded-2xl border border-border p-6 sm:p-8 flex flex-col">
          <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center mb-4">
            <BarChart3 className="w-6 h-6 text-green-500" />
          </div>
          <h3 className="font-semibold text-text">Données qualité de l&apos;air</h3>
          <p className="text-text-secondary text-sm mt-1 flex-1">
            Export CSV : AQI, PM2.5, catégorie par ville et par date.
            {selectedVille ? ` Filtré pour ${selectedVille}.` : " Toutes les villes."}
          </p>
          <button
            onClick={handleExportAQI}
            disabled={downloading === "aqi" || !airQuality}
            className="mt-4 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-green-600 text-white rounded-xl text-sm font-medium hover:bg-green-700 transition-colors disabled:opacity-50 w-full"
          >
            <Download className="w-4 h-4" />
            {downloading === "aqi" ? "Export..." : "Exporter CSV"}
          </button>
        </div>

        {/* CSV Meteo */}
        <div className="bg-surface rounded-2xl border border-border p-6 sm:p-8 flex flex-col">
          <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-4">
            <Cloud className="w-6 h-6 text-blue-500" />
          </div>
          <h3 className="font-semibold text-text">Données météorologiques</h3>
          <p className="text-text-secondary text-sm mt-1 flex-1">
            Export CSV : température, précipitations, vent, radiation solaire.
            {selectedVille ? ` Filtré pour ${selectedVille}.` : " Toutes les villes."}
          </p>
          <button
            onClick={handleExportMeteo}
            disabled={downloading === "meteo" || !meteo}
            className="mt-4 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 w-full"
          >
            <Download className="w-4 h-4" />
            {downloading === "meteo" ? "Export..." : "Exporter CSV"}
          </button>
        </div>
      </div>
    </div>
  );
}
