"use client";

import { SEVERITY_COLORS } from "@/lib/constants";

interface SeverityBadgeProps {
  niveau: "modere" | "grave" | "critique";
}

const LABELS: Record<string, string> = {
  modere: "Modéré",
  grave: "Grave",
  critique: "Critique",
};

export default function SeverityBadge({ niveau }: SeverityBadgeProps) {
  const color = SEVERITY_COLORS[niveau] || "#64748B";
  return (
    <span
      className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-semibold"
      style={{ backgroundColor: `${color}20`, color }}
    >
      {LABELS[niveau] || niveau}
    </span>
  );
}
