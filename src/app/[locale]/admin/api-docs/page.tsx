"use client";

import { useTranslations } from "next-intl";

export default function ApiDocsPage() {
  const t = useTranslations("apiDocs");

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-text">{t("title")}</h1>
        <p className="text-text-secondary text-sm mt-1">
          {t("subtitle")}
        </p>
      </div>
      <div className="bg-surface rounded-2xl border border-border overflow-hidden" style={{ height: "calc(100dvh - 10rem)" }}>
        <iframe
          src="https://api.airguard-cm.duckdns.org/api/docs/"
          className="w-full h-full border-0"
          title="AirGuard API Documentation"
        />
      </div>
    </div>
  );
}
