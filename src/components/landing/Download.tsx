"use client";

import { motion } from "framer-motion";
import { Globe, Smartphone, ArrowRight, Download as DownloadIcon } from "lucide-react";

export default function Download() {
  return (
    <section id="telecharger" className="relative py-24 md:py-32 bg-white overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_#F0FDFA_0%,_transparent_70%)]" />

      <div className="relative max-w-5xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 bg-[#F0FDFA] text-[#0F766E] text-xs font-bold uppercase tracking-widest rounded-full mb-4">
            Commencer maintenant
          </span>
          <h2 className="text-4xl md:text-6xl font-black text-[#134E4A] mb-6 leading-tight">
            Accédez à AirGuard
            <br />
            <span className="bg-gradient-to-r from-[#0F766E] to-[#14B8A6] bg-clip-text text-transparent">
              gratuitement
            </span>
          </h2>
          <p className="text-gray-600 text-lg md:text-xl max-w-2xl mx-auto">
            Choisissez votre plateforme préférée et commencez à surveiller la
            qualité de l&apos;air dès aujourd&apos;hui.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Web card */}
          <motion.a
            href="https://airguard-cm.duckdns.org/fr/login"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            whileHover={{ y: -8 }}
            className="group relative block overflow-hidden rounded-3xl p-10 bg-gradient-to-br from-[#0F766E] to-[#134E4A] text-white shadow-2xl"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#14B8A6] rounded-full blur-3xl opacity-30 group-hover:scale-125 transition-transform duration-700" />
            <div className="relative">
              <div className="w-16 h-16 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-6 border border-white/20">
                <Globe className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-3xl font-black mb-3">Dashboard Web</h3>
              <p className="text-white/80 mb-6 leading-relaxed">
                Interface admin complète dans votre navigateur. Aucune
                installation requise.
              </p>
              <div className="inline-flex items-center gap-2 px-6 py-3 bg-white text-[#0F766E] rounded-full font-bold group-hover:scale-105 transition-transform">
                Ouvrir le dashboard
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
              <p className="text-white/60 text-xs mt-4">airguard-cm.duckdns.org</p>
            </div>
          </motion.a>

          {/* Mobile card */}
          <motion.a
            href="https://github.com/ML-Masters/AirGuard_Frontend_Mobile/raw/main/composeApp/release/AirGuard.apk"
            download="AirGuard.apk"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            whileHover={{ y: -8 }}
            className="group relative block overflow-hidden rounded-3xl p-10 bg-white border-2 border-gray-100 hover:border-[#0F766E]/30 shadow-2xl transition-colors"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#F0FDFA] rounded-full blur-3xl opacity-70 group-hover:scale-125 transition-transform duration-700" />
            <div className="relative">
              <div className="w-16 h-16 bg-gradient-to-br from-[#0F766E] to-[#14B8A6] rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                <Smartphone className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-3xl font-black text-[#134E4A] mb-3">
                App Android
              </h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                APK signé et prêt à installer. Notifications push, chatbot et UX
                citoyenne.
              </p>
              <div className="inline-flex items-center gap-2 px-6 py-3 bg-[#0F766E] text-white rounded-full font-bold group-hover:scale-105 transition-transform shadow-lg">
                <DownloadIcon className="w-4 h-4" />
                Télécharger l&apos;APK
              </div>
              <p className="text-gray-400 text-xs mt-4">Kotlin Multiplatform · v1.0</p>
            </div>
          </motion.a>
        </div>
      </div>
    </section>
  );
}
