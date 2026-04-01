"use client";

import type { ReactNode } from "react";

interface KPICardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  color?: string;
  subtitle?: string;
}

export default function KPICard({ title, value, icon, color = "#0F766E", subtitle }: KPICardProps) {
  return (
    <div className="bg-surface rounded-2xl border border-border p-6 flex items-start gap-4">
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
        style={{ backgroundColor: `${color}15`, color }}
      >
        {icon}
      </div>
      <div>
        <p className="text-sm text-text-secondary font-medium">{title}</p>
        <p className="text-2xl font-bold text-text mt-1">{value}</p>
        {subtitle && <p className="text-xs text-text-secondary mt-1">{subtitle}</p>}
      </div>
    </div>
  );
}
