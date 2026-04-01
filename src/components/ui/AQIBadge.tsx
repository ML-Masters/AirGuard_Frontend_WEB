"use client";

import { useTranslations } from "next-intl";
import type { AQICategory } from "@/lib/types";
import { getAQIColor } from "@/lib/utils";

interface AQIBadgeProps {
  categorie: AQICategory;
}

export default function AQIBadge({ categorie }: AQIBadgeProps) {
  const t = useTranslations("aqi");
  const color = getAQIColor(categorie);
  return (
    <span
      className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-semibold"
      style={{ backgroundColor: `${color}20`, color }}
    >
      {t(categorie)}
    </span>
  );
}
