"use client";

import { motion } from "framer-motion";
import { AlertTriangle, TrendingDown, EyeOff } from "lucide-react";

const problems = [
  {
    icon: AlertTriangle,
    title: "12 000 décès par an",
    desc: "Liés à la pollution de l'air au Cameroun selon l'OMS",
  },
  {
    icon: TrendingDown,
    title: "Aucun outil de prédiction",
    desc: "Impossible d'anticiper les pics de pollution pour se protéger",
  },
  {
    icon: EyeOff,
    title: "Populations dans le flou",
    desc: "Les citoyens n'ont pas d'information sur la qualité de l'air",
  },
];

export default function Problem() {
  return (
    <section id="probleme" className="relative py-24 md:py-32 bg-gradient-to-b from-white to-[#F8FAFC] overflow-hidden">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <span className="inline-block px-4 py-1.5 bg-red-50 text-red-600 text-xs font-bold uppercase tracking-widest rounded-full mb-4">
            Le Problème
          </span>
          <h2 className="text-4xl md:text-6xl font-black text-[#134E4A] mb-6 leading-tight">
            Un enjeu de santé
            <br />
            <span className="text-red-500">publique majeur</span>
          </h2>
          <p className="text-gray-600 text-lg md:text-xl max-w-2xl mx-auto">
            La pollution de l&apos;air tue en silence au Cameroun. Sans outils de
            prévention, les citoyens sont exposés sans même le savoir.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 md:gap-8">
          {problems.map((p, i) => {
            const Icon = p.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.15 }}
                whileHover={{ y: -8 }}
                className="group relative bg-white rounded-3xl p-8 border border-gray-100 shadow-sm hover:shadow-2xl transition-all"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-red-50 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative">
                  <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <Icon className="w-7 h-7 text-red-500" />
                  </div>
                  <h3 className="text-2xl font-black text-[#134E4A] mb-3">{p.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{p.desc}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
