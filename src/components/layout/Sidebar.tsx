"use client";

import { useState } from "react";
import { Link, usePathname } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import {
  LayoutDashboard,
  Map,
  BarChart3,
  BrainCircuit,
  Bell,
  FileText,
  Wind,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { logout } from "@/lib/auth";
import LanguageSwitcher from "@/components/ui/LanguageSwitcher";

const NAV_KEYS = [
  { path: "admin", key: "dashboard", icon: LayoutDashboard },
  { path: "admin/map", key: "map", icon: Map },
  { path: "admin/analytics", key: "analytics", icon: BarChart3 },
  { path: "admin/predictions", key: "predictions", icon: BrainCircuit },
  { path: "admin/alerts", key: "alerts", icon: Bell },
  { path: "admin/reports", key: "reports", icon: FileText },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const t = useTranslations();

  const navItems = NAV_KEYS.map((item) => ({
    href: `/${item.path}`,
    label: t(`nav.${item.key}`),
    icon: item.icon,
  }));

  const adminBase = "/admin";

  const navContent = (
    <>
      <div className="p-6 flex items-center gap-3">
        <div className="w-10 h-10 bg-white/15 rounded-xl flex items-center justify-center">
          <Wind className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-white font-bold text-lg leading-tight">AirGuard</h1>
          <p className="text-white/60 text-xs">Cameroun</p>
        </div>
        <button
          onClick={() => setOpen(false)}
          className="ml-auto lg:hidden text-white/60 hover:text-white"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      <nav className="flex-1 px-3 mt-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== adminBase && pathname.startsWith(item.href));
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
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

      <div className="p-4 border-t border-white/10 space-y-3">
        <LanguageSwitcher />
        <button
          onClick={logout}
          className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-white/60 hover:text-white hover:bg-white/10 transition-colors w-full"
        >
          <LogOut className="w-5 h-5" />
          {t("common.logout")}
        </button>
        <p className="text-white/40 text-xs text-center">
          {t("common.footer")}
        </p>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile hamburger */}
      <button
        onClick={() => setOpen(true)}
        className="fixed top-4 left-4 z-50 lg:hidden w-10 h-10 bg-primary-dark rounded-xl flex items-center justify-center shadow-lg"
      >
        <Menu className="w-5 h-5 text-white" />
      </button>

      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Mobile drawer */}
      <aside
        className={`fixed left-0 top-0 h-screen w-[280px] bg-primary-dark flex flex-col z-50 transition-transform duration-300 lg:hidden ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {navContent}
      </aside>

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-[280px] bg-primary-dark h-screen fixed left-0 top-0 flex-col z-50">
        {navContent}
      </aside>
    </>
  );
}
