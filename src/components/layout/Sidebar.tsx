"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Map,
  BarChart3,
  BrainCircuit,
  Bell,
  FileText,
  Code2,
  Upload,
  Wind,
} from "lucide-react";

const NAV_ITEMS = [
  { href: "/fr/admin", label: "Tableau de bord", icon: LayoutDashboard },
  { href: "/fr/admin/map", label: "Carte", icon: Map },
  { href: "/fr/admin/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/fr/admin/predictions", label: "Prédictions", icon: BrainCircuit },
  { href: "/fr/admin/alerts", label: "Alertes", icon: Bell },
  { href: "/fr/admin/reports", label: "Rapports", icon: FileText },
  { href: "/fr/admin/import", label: "Import données", icon: Upload },
  { href: "/fr/admin/api-docs", label: "API Docs", icon: Code2 },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-[280px] bg-primary-dark h-screen fixed left-0 top-0 flex flex-col z-50">
      <div className="p-6 flex items-center gap-3">
        <div className="w-10 h-10 bg-white/15 rounded-xl flex items-center justify-center">
          <Wind className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-white font-bold text-lg leading-tight">AirGuard</h1>
          <p className="text-white/60 text-xs">Cameroun</p>
        </div>
      </div>

      <nav className="flex-1 px-3 mt-4 space-y-1">
        {NAV_ITEMS.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/fr/admin" && pathname.startsWith(item.href));
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                isActive
                  ? "bg-white/15 text-white"
                  : "text-white/60 hover:text-white hover:bg-white/10"
              }`}
            >
              <Icon className="w-5 h-5" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-white/10">
        <p className="text-white/40 text-xs text-center">
          IndabaX Cameroon 2026
        </p>
      </div>
    </aside>
  );
}
