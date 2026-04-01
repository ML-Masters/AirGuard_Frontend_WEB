"use client";

import { useTranslations } from "next-intl";
import { SEVERITY_COLORS } from "@/lib/constants";

interface SeverityBadgeProps {
  niveau: "modere" | "grave" | "critique";
}

export default function SeverityBadge({ niveau }: SeverityBadgeProps) {
  const t = useTranslations("severity");
  const color = SEVERITY_COLORS[niveau] || "#64748B";
  return (
    <span
      className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-semibold"
      style={{ backgroundColor: `${color}20`, color }}
    >
      {t(niveau)}
    </span>
  );
}
