"use client";

import { useState, useRef } from "react";
import { Upload, FileSpreadsheet, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { API_BASE_URL } from "@/lib/constants";
import { getAccessToken } from "@/lib/auth";

interface ImportProgress {
  progress: number;
  processed: number;
  total: number;
  meteo: number;
  aqi: number;
  skipped: number;
  done?: boolean;
}

export default function ImportPage() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState<ImportProgress | null>(null);
  const [error, setError] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (f: File) => {
    const name = f.name.toLowerCase();
    if (!name.endsWith(".xlsx") && !name.endsWith(".csv")) {
      setError("Format non supporté. Utilisez .xlsx ou .csv");
      return;
    }
    setFile(f);
    setError("");
    setProgress(null);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]);
  };

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    setError("");
    setProgress(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const token = getAccessToken();
      const res = await fetch(`${API_BASE_URL}/data/import/`, {
        method: "POST",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Erreur lors de l'import");
        setLoading(false);
        return;
      }

      // SSE streaming
      const reader = res.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) {
        setError("Streaming non supporté");
        setLoading(false);
        return;
      }

      let buffer = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            try {
              const data: ImportProgress = JSON.parse(line.slice(6));
              setProgress(data);
              if (data.done) {
                setLoading(false);
              }
            } catch {
              // skip malformed events
            }
          }
        }
      }
      setLoading(false);
    } catch {
      setError("Impossible de contacter le serveur");
      setLoading(false);
    }
  };

  const isDone = progress?.done;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text">Import de données</h1>
        <p className="text-text-secondary text-sm mt-1">
          Importez un fichier météorologique pour générer les indicateurs AQI
        </p>
      </div>

      {/* Drop zone */}
      {!loading && !isDone && (
        <div
          className={`bg-surface rounded-2xl border-2 border-dashed p-12 text-center cursor-pointer transition-colors ${
            dragOver ? "border-primary bg-primary-bg" : "border-border hover:border-primary/50"
          }`}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
        >
          <input
            ref={inputRef}
            type="file"
            accept=".xlsx,.csv"
            className="hidden"
            onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
          />
          <Upload className="w-12 h-12 text-primary mx-auto mb-4" />
          <p className="text-text font-medium">
            Glissez-déposez votre fichier ici
          </p>
          <p className="text-text-secondary text-sm mt-1">
            ou cliquez pour sélectionner — .xlsx ou .csv
          </p>
        </div>
      )}

      {/* Selected file + launch */}
      {file && !loading && !isDone && (
        <div className="bg-surface rounded-2xl border border-border p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FileSpreadsheet className="w-8 h-8 text-primary" />
            <div>
              <p className="font-medium text-text">{file.name}</p>
              <p className="text-xs text-text-secondary">
                {(file.size / 1024 / 1024).toFixed(1)} Mo
              </p>
            </div>
          </div>
          <button
            onClick={handleUpload}
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary-dark transition-colors"
          >
            <Upload className="w-4 h-4" />
            Lancer l&apos;import
          </button>
        </div>
      )}

      {/* Progress bar */}
      {(loading || progress) && !isDone && (
        <div className="bg-surface rounded-2xl border border-border p-6">
          <div className="flex items-center gap-3 mb-4">
            <Loader2 className="w-5 h-5 animate-spin text-primary" />
            <p className="font-medium text-text">Import en cours...</p>
          </div>

          {/* Bar */}
          <div className="w-full bg-gray-200 rounded-full h-4 mb-4 overflow-hidden">
            <div
              className="bg-primary h-4 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progress?.progress || 0}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-sm text-text-secondary">
            <span>{progress?.progress || 0}%</span>
            <span>
              {(progress?.processed || 0).toLocaleString()} / {(progress?.total || 0).toLocaleString()} lignes
            </span>
          </div>

          {progress && (
            <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-border">
              <div className="text-center">
                <p className="text-lg font-bold text-primary">{progress.meteo.toLocaleString()}</p>
                <p className="text-xs text-text-secondary">Relevés météo</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-primary">{progress.aqi.toLocaleString()}</p>
                <p className="text-xs text-text-secondary">Données AQI</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-text-secondary">{progress.skipped.toLocaleString()}</p>
                <p className="text-xs text-text-secondary">Ignorées</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="bg-red-50 rounded-2xl border border-red-200 p-6 flex items-center gap-3">
          <AlertCircle className="w-6 h-6 text-red-500 shrink-0" />
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      {/* Done */}
      {isDone && progress && (
        <div className="bg-green-50 rounded-2xl border border-green-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <CheckCircle className="w-6 h-6 text-green-600" />
            <p className="text-green-800 font-semibold">Import terminé avec succès !</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-800">{progress.total.toLocaleString()}</p>
              <p className="text-xs text-green-600">Lignes lues</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-800">{progress.meteo.toLocaleString()}</p>
              <p className="text-xs text-green-600">Relevés météo</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-800">{progress.aqi.toLocaleString()}</p>
              <p className="text-xs text-green-600">Données AQI</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-text-secondary">{progress.skipped.toLocaleString()}</p>
              <p className="text-xs text-text-secondary">Ignorées (doublons)</p>
            </div>
          </div>
          <button
            onClick={() => { setFile(null); setProgress(null); }}
            className="mt-4 px-4 py-2 text-sm text-primary font-medium hover:underline"
          >
            Importer un autre fichier
          </button>
        </div>
      )}

      {/* Info */}
      <div className="bg-surface rounded-2xl border border-border p-6">
        <h3 className="text-sm font-semibold text-text mb-3">Format attendu</h3>
        <p className="text-sm text-text-secondary mb-2">
          Le fichier doit contenir les colonnes du dataset météo Open-Meteo :
        </p>
        <div className="flex flex-wrap gap-2">
          {["city", "region", "time", "temperature_2m_mean", "precipitation_sum", "wind_speed_10m_max", "sunshine_duration", "shortwave_radiation_sum", "et0_fao_evapotranspiration"].map((col) => (
            <code key={col} className="text-xs bg-primary-bg text-primary px-2 py-1 rounded-md font-mono">
              {col}
            </code>
          ))}
        </div>
        <p className="text-xs text-text-secondary mt-3">
          Les doublons sont automatiquement ignorés — vous pouvez importer le même fichier plusieurs fois sans risque.
        </p>
      </div>
    </div>
  );
}
