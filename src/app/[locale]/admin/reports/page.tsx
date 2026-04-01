"use client";

import { useTranslations } from "next-intl";
import { FileText, Download } from "lucide-react";
import { API_BASE_URL } from "@/lib/constants";

export default function ReportsPage() {
  const t = useTranslations("reports");

  const handleDownloadPDF = async () => {
    const res = await fetch(`${API_BASE_URL}/air-quality/reports/pdf/`);
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "Rapport_AirGuard.pdf";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text">{t("title")}</h1>
        <p className="text-text-secondary text-sm mt-1">
          {t("subtitle")}
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="bg-surface rounded-2xl border border-border p-6 sm:p-8 text-center">
          <FileText className="w-12 h-12 text-primary mx-auto mb-4" />
          <h3 className="font-semibold text-text mb-2">{t("pdfReport")}</h3>
          <p className="text-text-secondary text-sm mb-6">
            {t("pdfDescription")}
          </p>
          <button
            onClick={handleDownloadPDF}
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary-dark transition-colors"
          >
            <Download className="w-4 h-4" />
            {t("downloadPDF")}
          </button>
        </div>
        <div className="bg-surface rounded-2xl border border-border p-6 sm:p-8 text-center opacity-60">
          <FileText className="w-12 h-12 text-text-secondary mx-auto mb-4" />
          <h3 className="font-semibold text-text mb-2">{t("csvExport")}</h3>
          <p className="text-text-secondary text-sm mb-6">
            {t("csvDescription")}
          </p>
          <span className="text-text-secondary text-sm">{t("comingSoon")}</span>
        </div>
      </div>
    </div>
  );
}
