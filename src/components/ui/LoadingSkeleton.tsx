"use client";

export function KPISkeleton() {
  return (
    <div className="bg-surface rounded-2xl border border-border p-6 flex items-start gap-4 animate-pulse">
      <div className="w-12 h-12 rounded-xl bg-gray-200" />
      <div className="flex-1">
        <div className="h-3 bg-gray-200 rounded w-24 mb-3" />
        <div className="h-6 bg-gray-200 rounded w-16" />
      </div>
    </div>
  );
}

export function ChartSkeleton({ height = 280 }: { height?: number }) {
  return (
    <div className="bg-surface rounded-2xl border border-border p-6 animate-pulse">
      <div className="h-4 bg-gray-200 rounded w-48 mb-4" />
      <div className="rounded-lg bg-gray-100" style={{ height }} />
    </div>
  );
}

export function MapSkeleton({ height = "400px" }: { height?: string }) {
  return (
    <div
      className="bg-surface rounded-2xl border border-border animate-pulse"
      style={{ height }}
    >
      <div className="w-full h-full bg-gray-100 rounded-2xl flex items-center justify-center">
        <span className="text-gray-300 text-sm">Chargement de la carte...</span>
      </div>
    </div>
  );
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="bg-surface rounded-2xl border border-border p-6 animate-pulse space-y-3">
      <div className="h-4 bg-gray-200 rounded w-40 mb-4" />
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-4">
          <div className="h-3 bg-gray-200 rounded flex-1" />
          <div className="h-3 bg-gray-200 rounded w-20" />
          <div className="h-3 bg-gray-200 rounded w-16" />
        </div>
      ))}
    </div>
  );
}
