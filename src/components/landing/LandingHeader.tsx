"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

export default function LandingHeader() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <motion.header
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/90 backdrop-blur-xl border-b border-gray-200/50 shadow-sm"
          : "bg-transparent"
      }`}
    >
      <nav className="max-w-7xl mx-auto px-6 lg:px-12 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Image src="/logo.png" alt="AirGuard" width={40} height={40} className="rounded-xl" />
          <span className={`font-bold text-lg transition-colors ${scrolled ? "text-[#134E4A]" : "text-white"}`}>
            AirGuard
          </span>
        </div>

        <div className="hidden md:flex items-center gap-8">
          {["Problème", "Solution", "Plateforme", "Télécharger"].map((item, i) => (
            <a
              key={i}
              href={`#${["probleme", "solution", "plateforme", "telecharger"][i]}`}
              className={`text-sm font-medium transition-colors ${
                scrolled ? "text-gray-700 hover:text-[#0F766E]" : "text-white/80 hover:text-white"
              }`}
            >
              {item}
            </a>
          ))}
        </div>

        <a
          href="/fr/login"
          className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all ${
            scrolled
              ? "bg-[#0F766E] text-white hover:bg-[#134E4A] shadow-md hover:shadow-lg"
              : "bg-white text-[#0F766E] hover:bg-white/90"
          }`}
        >
          Se connecter
        </a>
      </nav>
    </motion.header>
  );
}
