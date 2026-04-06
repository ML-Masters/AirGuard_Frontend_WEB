"use client";

import { motion } from "framer-motion";
import { Eye, Brain, Bell, Cloud, Smartphone, Globe2, FileText, MessageCircle } from "lucide-react";

const features = [
  { icon: Eye, title: "Surveillance temps réel", desc: "Données météo et AQI actualisées en continu via Open-Meteo" },
  { icon: Brain, title: "Intelligence artificielle", desc: "5 modèles ML entraînés sur 91K+ observations (R² jusqu'à 0.99)" },
  { icon: Bell, title: "Alertes préventives", desc: "Notifications push quotidiennes personnalisées par ville" },
  { icon: Cloud, title: "Prédictions avancées", desc: "Qualité de l'air prévue sur 7 jours + risques climatiques" },
  { icon: Globe2, title: "Carte interactive", desc: "Heatmap des 40 villes avec légende claire et codes couleur" },
  { icon: MessageCircle, title: "Chatbot intégré", desc: "Assistant IA multilingue pour répondre à vos questions santé" },
  { icon: FileText, title: "Rapports sur mesure", desc: "Export PDF et CSV filtrable par ville et par période" },
  { icon: Smartphone, title: "Multi-plateforme", desc: "Dashboard web + App mobile Android/iOS (Kotlin KMP)" },
];

export default function Solution() {
  return (
    <section id="solution" className="relative py-24 md:py-32 bg-[#F8FAFC] overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,_#14B8A620_0%,_transparent_50%)]" />

      <div className="relative max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <span className="inline-block px-4 py-1.5 bg-[#F0FDFA] text-[#0F766E] text-xs font-bold uppercase tracking-widest rounded-full mb-4">
            Notre Solution
          </span>
          <h2 className="text-4xl md:text-6xl font-black text-[#134E4A] mb-6 leading-tight">
            Une plateforme complète,
            <br />
            <span className="bg-gradient-to-r from-[#0F766E] to-[#14B8A6] bg-clip-text text-transparent">
              pensée pour les citoyens
            </span>
          </h2>
          <p className="text-gray-600 text-lg md:text-xl max-w-2xl mx-auto">
            AirGuard combine IA, données satellites et notifications push pour
            protéger la santé des Camerounais en temps réel.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                whileHover={{ y: -6, scale: 1.02 }}
                className="group relative bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-xl transition-all overflow-hidden"
              >
                <div className="absolute -top-8 -right-8 w-32 h-32 bg-gradient-to-br from-[#F0FDFA] to-transparent rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
                <div className="relative">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#0F766E] to-[#14B8A6] rounded-xl flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-transform">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-black text-[#134E4A] mb-2">{f.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{f.desc}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
