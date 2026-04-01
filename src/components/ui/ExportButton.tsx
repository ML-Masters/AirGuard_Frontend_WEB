"use client";

import { useTranslations } from "next-intl";
import { Download } from "lucide-react";
import { downloadCSV } from "@/lib/utils";

interface ExportButtonProps {
  data: Record<string, unknown>[];
  filename: string;
  label?: string;
}

export default function ExportButton({ data, filename, label }: ExportButtonProps) {
  const t = useTranslations("common");
  const displayLabel = label || t("exportCSV");
  return (
    <button
      onClick={() => downloadCSV(data, filename)}
      disabled={!data.length}
      className="inline-flex items-center gap-2 px-4 py-2 bg-surface border border-border rounded-xl text-sm font-medium text-text hover:bg-gray-50 transition-colors disabled:opacity-50"
    >
      <Download className="w-4 h-4" />
      {displayLabel}
    </button>
  );
}
