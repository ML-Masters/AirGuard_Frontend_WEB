"use client";

import Image from "next/image";
import { Code2, Globe, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="relative bg-[#0A0F0E] text-white py-16 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-t from-black to-[#134E4A]/50" />

      <div className="relative max-w-6xl mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <Image src="/logo.png" alt="AirGuard" width={48} height={48} className="rounded-xl" />
              <span className="font-black text-xl">AirGuard</span>
            </div>
            <p className="text-white/60 text-sm leading-relaxed max-w-sm">
              Plateforme IA de surveillance et prédiction de la qualité de
              l&apos;air au Cameroun. Par l&apos;equipe ML Masters.
            </p>
          </div>

          {/* Liens */}
          <div>
            <h4 className="font-bold text-sm uppercase tracking-widest text-white/40 mb-4">
              Plateforme
            </h4>
            <ul className="space-y-2">
              <li>
                <a href="https://airguard-cm.duckdns.org" className="text-white/70 hover:text-white text-sm flex items-center gap-2">
                  <Globe className="w-4 h-4" /> Dashboard
                </a>
              </li>
              <li>
                <a href="https://api.airguard-cm.duckdns.org/api/docs/" className="text-white/70 hover:text-white text-sm flex items-center gap-2">
                  <Globe className="w-4 h-4" /> API Docs
                </a>
              </li>
            </ul>
          </div>

          {/* Github */}
          <div>
            <h4 className="font-bold text-sm uppercase tracking-widest text-white/40 mb-4">
              Code source
            </h4>
            <ul className="space-y-2">
              <li>
                <a href="https://github.com/ML-Masters/AirGuard_Backend" className="text-white/70 hover:text-white text-sm flex items-center gap-2">
                  <Code2 className="w-4 h-4" /> Backend
                </a>
              </li>
              <li>
                <a href="https://github.com/ML-Masters/AirGuard_Frontend_WEB" className="text-white/70 hover:text-white text-sm flex items-center gap-2">
                  <Code2 className="w-4 h-4" /> Dashboard
                </a>
              </li>
              <li>
                <a href="https://github.com/ML-Masters/AirGuard_Frontend_Mobile" className="text-white/70 hover:text-white text-sm flex items-center gap-2">
                  <Code2 className="w-4 h-4" /> Mobile
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-white/40 text-xs">
            © 2026 ML Masters. Tous droits reserves.
          </p>
          <div className="flex items-center gap-2 text-white/40 text-xs">
            <Mail className="w-3 h-3" />
            <span>Made with passion in Cameroon</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
