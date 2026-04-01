"use client";

import type { AQICategory } from "@/lib/types";
import { getAQIColor, getAQILabel } from "@/lib/utils";

interface AQIBadgeProps {
  categorie: AQICategory;
  locale?: string;
}

export default function AQIBadge({ categorie, locale = "fr" }: AQIBadgeProps) {
  const color = getAQIColor(categorie);
  return (
    <span
      className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-semibold"
      style={{ backgroundColor: `${color}20`, color }}
    >
      {getAQILabel(categorie, locale)}
    </span>
  );
}
