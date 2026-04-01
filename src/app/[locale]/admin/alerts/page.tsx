"use client";

import { useState, useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Bell, AlertTriangle, Clock, Shield, Send, X, Pencil, BrainCircuit, Loader2 } from "lucide-react";
import { useAlerts, useVilles } from "@/hooks/useData";
import KPICard from "@/components/ui/KPICard";
import SeverityBadge from "@/components/ui/SeverityBadge";
import { formatDate, timeAgo } from "@/lib/utils";
import { fetchWithAuth } from "@/lib/auth";
import { API_BASE_URL } from "@/lib/constants";

export default function AlertsPage() {
  const { data: alerts, mutate: refreshAlerts } = useAlerts();
  const { data: villes } = useVilles();
  const [filterSeverity, setFilterSeverity] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [page, setPage] = useState(0);
  const [scanning, setScanning] = useState(false);
  const [scanResult, setScanResult] = useState<string>("");
  const [editingAlert, setEditingAlert] = useState<number | null>(null);
  const [editMessage, setEditMessage] = useState("");
  const [publishing, setPublishing] = useState<number | null>(null);
  const perPage = 10;

  const villeMap = useMemo(() => {
    const map = new Map<number, string>();
    if (villes) villes.forEach((v) => map.set(v.id, v.nom));
    return map;
  }, [villes]);

  // Separate drafts from published
  const drafts = useMemo(() => {
    if (!alerts) return [];
    return alerts.filter((a) => a.statut === "brouillon");
  }, [alerts]);

  const filtered = useMemo(() => {
    if (!alerts) return [];
    return alerts.filter((a) => {
      if (filterSeverity !== "all" && a.niveau_severite !== filterSeverity) return false;
      if (filterStatus === "active" && !a.est_active) return false;
      if (filterStatus === "resolved" && a.est_active) return false;
      if (filterStatus === "brouillon" && a.statut !== "brouillon") return false;
      if (filterStatus === "publiee" && a.statut !== "publiee") return false;
      return true;
    });
  }, [alerts, filterSeverity, filterStatus]);

  const paginated = filtered.slice(page * perPage, (page + 1) * perPage);
  const totalPages = Math.ceil(filtered.length / perPage);

  const activeCount = alerts?.filter((a) => a.est_active && a.statut === "publiee").length || 0;
  const criticalCount = alerts?.filter((a) => a.niveau_severite === "critique" && a.est_active).length || 0;
  const draftCount = drafts.length;

  // Timeline data
  const timelineData = useMemo(() => {
    if (!alerts) return [];
    const byDate = new Map<string, { modere: number; grave: number; critique: number }>();
    for (const a of alerts) {
      const date = a.date_creation.split("T")[0];
      const ex = byDate.get(date) || { modere: 0, grave: 0, critique: 0 };
      ex[a.niveau_severite]++;
      byDate.set(date, ex);
    }
    return Array.from(byDate.entries())
      .sort((a, b) => a[0].localeCompare(b[0]))
      .slice(-30)
      .map(([date, counts]) => ({
        date: new Date(date).toLocaleDateString("fr-FR", { day: "2-digit", month: "short" }),
        ...counts,
      }));
  }, [alerts]);

  const handleScan = async () => {
    setScanning(true);
    setScanResult("");
    try {
      const res = await fetchWithAuth(`${API_BASE_URL}/alerts/scan/`, { method: "POST" });
      const data = await res.json();
      if (res.ok) {
        setScanResult(data.message);
        refreshAlerts();
      } else {
        setScanResult(data.error || "Erreur lors du scan");
      }
    } catch {
      setScanResult("Impossible de contacter le serveur");
    }
    setScanning(false);
  };

  const handlePublish = async (alertId: number, modifications?: { message_fr?: string }) => {
    setPublishing(alertId);
    try {
      const res = await fetchWithAuth(`${API_BASE_URL}/alerts/${alertId}/publier/`, {
        method: "POST",
        body: JSON.stringify(modifications || {}),
      });
      if (res.ok) {
        refreshAlerts();
        setEditingAlert(null);
        setEditMessage("");
      }
    } catch { /* ignore */ }
    setPublishing(null);
  };

  const handleIgnore = async (alertId: number) => {
    try {
      await fetchWithAuth(`${API_BASE_URL}/alerts/${alertId}/ignorer/`, { method: "POST" });
      refreshAlerts();
    } catch { /* ignore */ }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text">Alertes</h1>
          <p className="text-text-secondary text-sm mt-1">
            Gestion et historique des alertes qualité de l&apos;air
          </p>
        </div>
        <button
          onClick={handleScan}
          disabled={scanning}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-xl font-medium hover:bg-primary-dark transition-colors disabled:opacity-50"
        >
          {scanning ? <Loader2 className="w-4 h-4 animate-spin" /> : <BrainCircuit className="w-4 h-4" />}
          Scanner les alertes ML
        </button>
      </div>

      {scanResult && (
        <div className="bg-primary-bg rounded-xl border border-primary/20 p-4 text-sm text-primary">
          {scanResult}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <KPICard
          title="Alertes publiées actives"
          value={activeCount}
          icon={<Bell className="w-6 h-6" />}
          color="#F59E0B"
        />
        <KPICard
          title="Alertes critiques"
          value={criticalCount}
          icon={<AlertTriangle className="w-6 h-6" />}
          color="#EF4444"
        />
        <KPICard
          title="Brouillons ML en attente"
          value={draftCount}
          icon={<BrainCircuit className="w-6 h-6" />}
          color="#8B5CF6"
        />
      </div>

      {/* ML Draft alerts */}
      {drafts.length > 0 && (
        <div className="bg-purple-50 rounded-2xl border border-purple-200 p-6">
          <h3 className="text-sm font-semibold text-purple-900 mb-4 flex items-center gap-2">
            <BrainCircuit className="w-4 h-4" />
            Alertes détectées par le modèle ML — En attente de validation
          </h3>
          <div className="space-y-3">
            {drafts.map((alert) => (
              <div key={alert.id} className="bg-white rounded-xl border border-purple-100 p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-text">
                        {villeMap.get(alert.ville) || `#${alert.ville}`}
                      </span>
                      <SeverityBadge niveau={alert.niveau_severite} />
                      <span className="text-xs text-purple-600 bg-purple-100 px-2 py-0.5 rounded-full">ML</span>
                    </div>
                    {editingAlert === alert.id ? (
                      <textarea
                        value={editMessage}
                        onChange={(e) => setEditMessage(e.target.value)}
                        className="w-full mt-2 p-3 rounded-lg border border-border text-sm resize-none"
                        rows={3}
                      />
                    ) : (
                      <p className="text-sm text-text-secondary mt-1">{alert.message_fr}</p>
                    )}
                    {alert.donnees_declencheur && (
                      <p className="text-xs text-purple-600 mt-1">
                        AQI: {alert.donnees_declencheur.aqi} — PM2.5: {alert.donnees_declencheur.pm25} — {alert.donnees_declencheur.date}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {editingAlert === alert.id ? (
                      <>
                        <button
                          onClick={() => handlePublish(alert.id, { message_fr: editMessage })}
                          disabled={publishing === alert.id}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary text-white rounded-lg text-xs font-medium hover:bg-primary-dark disabled:opacity-50"
                        >
                          {publishing === alert.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <Send className="w-3 h-3" />}
                          Publier
                        </button>
                        <button
                          onClick={() => { setEditingAlert(null); setEditMessage(""); }}
                          className="p-1.5 text-text-secondary hover:text-text rounded-lg"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => handlePublish(alert.id)}
                          disabled={publishing === alert.id}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary text-white rounded-lg text-xs font-medium hover:bg-primary-dark disabled:opacity-50"
                        >
                          {publishing === alert.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <Send className="w-3 h-3" />}
                          Publier
                        </button>
                        <button
                          onClick={() => { setEditingAlert(alert.id); setEditMessage(alert.message_fr); }}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-100 text-amber-700 rounded-lg text-xs font-medium hover:bg-amber-200"
                        >
                          <Pencil className="w-3 h-3" />
                          Modifier
                        </button>
                        <button
                          onClick={() => handleIgnore(alert.id)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 text-gray-600 rounded-lg text-xs font-medium hover:bg-gray-200"
                        >
                          <X className="w-3 h-3" />
                          Ignorer
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex items-center gap-4">
        <select
          value={filterSeverity}
          onChange={(e) => { setFilterSeverity(e.target.value); setPage(0); }}
          className="px-4 py-2 rounded-xl border border-border bg-surface text-sm text-text"
        >
          <option value="all">Toutes les sévérités</option>
          <option value="modere">Modéré</option>
          <option value="grave">Grave</option>
          <option value="critique">Critique</option>
        </select>
        <select
          value={filterStatus}
          onChange={(e) => { setFilterStatus(e.target.value); setPage(0); }}
          className="px-4 py-2 rounded-xl border border-border bg-surface text-sm text-text"
        >
          <option value="all">Tous les statuts</option>
          <option value="publiee">Publiées</option>
          <option value="brouillon">Brouillons</option>
          <option value="active">Actives</option>
          <option value="resolved">Résolues</option>
        </select>
        <span className="text-sm text-text-secondary ml-auto">
          {filtered.length} alerte{filtered.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Table */}
      <div className="bg-surface rounded-2xl border border-border overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-primary-dark text-white">
              <th className="px-4 py-3 text-left font-semibold text-xs uppercase tracking-wider">Ville</th>
              <th className="px-4 py-3 text-left font-semibold text-xs uppercase tracking-wider">Sévérité</th>
              <th className="px-4 py-3 text-left font-semibold text-xs uppercase tracking-wider">Source</th>
              <th className="px-4 py-3 text-left font-semibold text-xs uppercase tracking-wider">Message</th>
              <th className="px-4 py-3 text-left font-semibold text-xs uppercase tracking-wider">Date</th>
              <th className="px-4 py-3 text-left font-semibold text-xs uppercase tracking-wider">Statut</th>
            </tr>
          </thead>
          <tbody>
            {paginated.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-12 text-center text-text-secondary">
                  <Shield className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  Aucune alerte trouvée
                </td>
              </tr>
            ) : (
              paginated.map((alert, i) => (
                <tr key={alert.id} className={i % 2 === 0 ? "bg-white" : "bg-gray-50/50"}>
                  <td className="px-4 py-3 font-medium text-text">
                    {villeMap.get(alert.ville) || `#${alert.ville}`}
                  </td>
                  <td className="px-4 py-3">
                    <SeverityBadge niveau={alert.niveau_severite} />
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      alert.source === "ml" ? "bg-purple-100 text-purple-700" : "bg-blue-100 text-blue-700"
                    }`}>
                      {alert.source === "ml" ? "ML" : "Admin"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-text-secondary max-w-xs truncate">
                    {alert.message_fr}
                  </td>
                  <td className="px-4 py-3 text-text-secondary text-xs">
                    {formatDate(alert.date_creation)}
                    <br />
                    <span className="text-text-secondary/60">{timeAgo(alert.date_creation)}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                      alert.statut === "publiee"
                        ? "bg-green-100 text-green-700"
                        : alert.statut === "brouillon"
                        ? "bg-purple-100 text-purple-700"
                        : "bg-gray-100 text-gray-500"
                    }`}>
                      {alert.statut === "publiee" ? "Publiée" : alert.statut === "brouillon" ? "Brouillon" : "Ignorée"}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-border">
            <button
              onClick={() => setPage(Math.max(0, page - 1))}
              disabled={page === 0}
              className="px-3 py-1.5 text-sm rounded-lg border border-border disabled:opacity-40 hover:bg-gray-50"
            >
              Précédent
            </button>
            <span className="text-sm text-text-secondary">
              Page {page + 1} / {totalPages}
            </span>
            <button
              onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
              disabled={page >= totalPages - 1}
              className="px-3 py-1.5 text-sm rounded-lg border border-border disabled:opacity-40 hover:bg-gray-50"
            >
              Suivant
            </button>
          </div>
        )}
      </div>

      {/* Timeline */}
      {timelineData.length > 0 && (
        <div className="bg-surface rounded-2xl border border-border p-6">
          <h3 className="text-sm font-semibold text-text mb-4">
            Timeline des alertes — 30 derniers jours
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={timelineData} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#64748B" }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#64748B" }} tickLine={false} axisLine={false} allowDecimals={false} />
              <Tooltip contentStyle={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 12, fontSize: 13 }} />
              <Legend />
              <Bar dataKey="critique" name="Critique" stackId="a" fill="#EF4444" />
              <Bar dataKey="grave" name="Grave" stackId="a" fill="#F97316" />
              <Bar dataKey="modere" name="Modéré" stackId="a" fill="#EAB308" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
