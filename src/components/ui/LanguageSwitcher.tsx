"use client";

import { useLocale } from "next-intl";
import { useRouter, usePathname } from "@/i18n/navigation";
import { Globe } from "lucide-react";

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const toggleLocale = () => {
    const newLocale = locale === "fr" ? "en" : "fr";
    router.replace(pathname, { locale: newLocale });
  };

  return (
    <button
      onClick={toggleLocale}
      className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium text-white/60 hover:text-white hover:bg-white/10 transition-colors"
    >
      <Globe className="w-4 h-4" />
      {locale === "fr" ? "EN" : "FR"}
    </button>
  );
}
