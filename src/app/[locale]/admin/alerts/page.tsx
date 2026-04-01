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
import { Bell, AlertTriangle, Clock, Shield } from "lucide-react";
import { useAlerts, useVilles } from "@/hooks/useData";
import KPICard from "@/components/ui/KPICard";
import SeverityBadge from "@/components/ui/SeverityBadge";
import { formatDate, timeAgo } from "@/lib/utils";

export default function AlertsPage() {
  const { data: alerts } = useAlerts();
  const { data: villes } = useVilles();
  const [filterSeverity, setFilterSeverity] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [page, setPage] = useState(0);
  const perPage = 10;

  const villeMap = useMemo(() => {
    const map = new Map<number, string>();
    if (villes) villes.forEach((v) => map.set(v.id, v.nom));
    return map;
  }, [villes]);

  const filtered = useMemo(() => {
    if (!alerts) return [];
    return alerts.filter((a) => {
      if (filterSeverity !== "all" && a.niveau_severite !== filterSeverity) return false;
      if (filterStatus === "active" && !a.est_active) return false;
      if (filterStatus === "resolved" && a.est_active) return false;
      return true;
    });
  }, [alerts, filterSeverity, filterStatus]);

  const paginated = filtered.slice(page * perPage, (page + 1) * perPage);
  const totalPages = Math.ceil(filtered.length / perPage);

  // Stats
  const activeCount = alerts?.filter((a) => a.est_active).length || 0;
  const criticalCount = alerts?.filter((a) => a.niveau_severite === "critique" && a.est_active).length || 0;
  const last24h = alerts?.filter((a) => {
    const diff = Date.now() - new Date(a.date_creation).getTime();
    return diff < 86400000;
  }).length || 0;

  // Timeline: alerts per day (last 30 days)
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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text">Alertes</h1>
        <p className="text-text-secondary text-sm mt-1">
          Gestion et historique des alertes qualité de l&apos;air
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <KPICard
          title="Alertes actives"
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
          title="Dernières 24h"
          value={last24h}
          icon={<Clock className="w-6 h-6" />}
          color="#3B82F6"
        />
      </div>

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
              <th className="px-4 py-3 text-left font-semibold text-xs uppercase tracking-wider">Message</th>
              <th className="px-4 py-3 text-left font-semibold text-xs uppercase tracking-wider">Date</th>
              <th className="px-4 py-3 text-left font-semibold text-xs uppercase tracking-wider">Statut</th>
            </tr>
          </thead>
          <tbody>
            {paginated.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-12 text-center text-text-secondary">
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
                      alert.est_active
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-500"
                    }`}>
                      {alert.est_active ? "Active" : "Résolue"}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Pagination */}
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

      {/* Timeline chart */}
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
              <Bar dataKey="critique" name="Critique" stackId="a" fill="#EF4444" radius={[0, 0, 0, 0]} />
              <Bar dataKey="grave" name="Grave" stackId="a" fill="#F97316" radius={[0, 0, 0, 0]} />
              <Bar dataKey="modere" name="Modéré" stackId="a" fill="#EAB308" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
