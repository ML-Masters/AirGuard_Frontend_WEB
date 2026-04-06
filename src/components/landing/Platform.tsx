"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { Monitor, Smartphone, ArrowRight, Download } from "lucide-react";

export default function Platform() {
  const [tab, setTab] = useState<"web" | "mobile">("web");

  return (
    <section id="plateforme" className="relative py-24 md:py-32 bg-gradient-to-b from-[#134E4A] to-[#0F766E] overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-0 w-96 h-96 bg-[#14B8A6] rounded-full blur-[140px] opacity-30" />
        <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-white rounded-full blur-[140px] opacity-10" />
      </div>

      <div className="relative max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 bg-white/10 backdrop-blur-md text-white text-xs font-bold uppercase tracking-widest rounded-full mb-4 border border-white/20">
            La Plateforme
          </span>
          <h2 className="text-4xl md:text-6xl font-black text-white mb-6 leading-tight">
            Web et mobile,
            <br />
            <span className="bg-gradient-to-r from-[#99F6E4] to-white bg-clip-text text-transparent">
              toujours synchronisés
            </span>
          </h2>
        </motion.div>

        {/* Tab selector */}
        <div className="flex justify-center mb-12">
          <div className="inline-flex bg-white/10 backdrop-blur-md rounded-full p-1.5 border border-white/20">
            <button
              onClick={() => setTab("web")}
              className={`px-6 py-3 rounded-full text-sm font-bold transition-all flex items-center gap-2 ${
                tab === "web" ? "bg-white text-[#0F766E] shadow-lg" : "text-white/80 hover:text-white"
              }`}
            >
              <Monitor className="w-4 h-4" />
              Dashboard Web
            </button>
            <button
              onClick={() => setTab("mobile")}
              className={`px-6 py-3 rounded-full text-sm font-bold transition-all flex items-center gap-2 ${
                tab === "mobile" ? "bg-white text-[#0F766E] shadow-lg" : "text-white/80 hover:text-white"
              }`}
            >
              <Smartphone className="w-4 h-4" />
              App Mobile
            </button>
          </div>
        </div>

        {/* Content */}
        <motion.div
          key={tab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="grid md:grid-cols-2 gap-12 items-center"
        >
          <div className="order-2 md:order-1">
            {tab === "web" ? (
              <>
                <h3 className="text-3xl md:text-4xl font-black text-white mb-4">
                  Dashboard web complet
                </h3>
                <p className="text-white/80 text-lg mb-6 leading-relaxed">
                  Interface admin puissante : cartes de chaleur, analytics,
                  prédictions ML, gestion des alertes, rapports PDF/CSV par ville.
                </p>
                <ul className="space-y-3 mb-8">
                  {[
                    "Carte interactive avec heatmap",
                    "Prédictions demain + semaine",
                    "Export PDF/CSV filtrable",
                    "Bilingue FR/EN",
                  ].map((f, i) => (
                    <li key={i} className="flex items-center gap-3 text-white/90">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#99F6E4]" />
                      {f}
                    </li>
                  ))}
                </ul>
                <a
                  href="https://airguard-cm.duckdns.org/fr/login"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-white text-[#0F766E] rounded-full font-bold hover:scale-105 transition-transform shadow-2xl"
                >
                  Ouvrir le dashboard
                  <ArrowRight className="w-4 h-4" />
                </a>
              </>
            ) : (
              <>
                <h3 className="text-3xl md:text-4xl font-black text-white mb-4">
                  App mobile citoyenne
                </h3>
                <p className="text-white/80 text-lg mb-6 leading-relaxed">
                  Conçue pour les citoyens : langage clair, conseils santé,
                  notifications push quotidiennes pour votre ville de résidence.
                </p>
                <ul className="space-y-3 mb-8">
                  {[
                    "Google Sign-In en un clic",
                    "Notifications push personnalisées",
                    "Prédictions sur 7 jours",
                    "Chatbot IA intégré",
                  ].map((f, i) => (
                    <li key={i} className="flex items-center gap-3 text-white/90">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#99F6E4]" />
                      {f}
                    </li>
                  ))}
                </ul>
                <a
                  href="#telecharger"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-white text-[#0F766E] rounded-full font-bold hover:scale-105 transition-transform shadow-2xl"
                >
                  <Download className="w-4 h-4" />
                  Télécharger l&apos;APK
                </a>
              </>
            )}
          </div>

          <div className="order-1 md:order-2">
            <div className="relative">
              {tab === "web" ? (
                // Browser mockup
                <div className="relative bg-white rounded-2xl shadow-2xl overflow-hidden border border-white/20">
                  <div className="h-10 bg-gray-100 flex items-center gap-2 px-4 border-b border-gray-200">
                    <div className="flex gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-red-400" />
                      <div className="w-3 h-3 rounded-full bg-yellow-400" />
                      <div className="w-3 h-3 rounded-full bg-green-400" />
                    </div>
                    <div className="ml-4 px-3 py-1 bg-white rounded-md text-xs text-gray-500 flex-1 max-w-[300px]">
                      airguard-cm.duckdns.org
                    </div>
                  </div>
                  <div className="bg-gradient-to-br from-[#F0FDFA] to-[#F8FAFC] aspect-video flex items-center justify-center p-8">
                    <div className="text-center">
                      <div className="w-20 h-20 mx-auto bg-gradient-to-br from-[#0F766E] to-[#14B8A6] rounded-3xl flex items-center justify-center text-white text-3xl font-black shadow-xl mb-4">
                        AG
                      </div>
                      <p className="text-[#134E4A] font-bold">AirGuard Dashboard</p>
                      <p className="text-gray-500 text-sm mt-1">Web admin interface</p>
                    </div>
                  </div>
                </div>
              ) : (
                // Phone mockup
                <div className="relative mx-auto w-[260px]">
                  <div className="bg-black rounded-[3rem] p-3 shadow-2xl border border-gray-800">
                    <div className="bg-gradient-to-br from-[#0F766E] to-[#14B8A6] rounded-[2.5rem] aspect-[9/19] relative overflow-hidden">
                      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-6 bg-black rounded-b-2xl" />
                      <div className="flex flex-col items-center justify-center h-full text-center p-6">
                        <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center text-[#0F766E] text-3xl font-black shadow-xl mb-4">
                          AG
                        </div>
                        <p className="text-white font-bold text-lg">AirGuard Mobile</p>
                        <p className="text-white/80 text-xs mt-1">Android &amp; iOS</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
