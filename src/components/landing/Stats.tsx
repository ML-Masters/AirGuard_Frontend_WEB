"use client";

import { motion, useInView, useMotionValue, useTransform, animate } from "framer-motion";
import { useEffect, useRef } from "react";

function Counter({ value, suffix = "", label }: { value: number; suffix?: string; label: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const count = useMotionValue(0);
  const rounded = useTransform(count, (v) => Math.round(v).toLocaleString("fr-FR"));

  useEffect(() => {
    if (inView) {
      const controls = animate(count, value, { duration: 2, ease: "easeOut" });
      return controls.stop;
    }
  }, [inView, count, value]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6 }}
      className="text-center"
    >
      <div className="flex items-baseline justify-center gap-1">
        <motion.span className="text-5xl md:text-7xl font-black bg-gradient-to-br from-[#0F766E] to-[#14B8A6] bg-clip-text text-transparent">
          {rounded}
        </motion.span>
        {suffix && (
          <span className="text-3xl md:text-5xl font-black text-[#0F766E]">{suffix}</span>
        )}
      </div>
      <p className="text-gray-600 text-sm md:text-base font-medium mt-2">{label}</p>
    </motion.div>
  );
}

export default function Stats() {
  return (
    <section className="relative py-24 md:py-32 bg-white overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-white via-[#F0FDFA]/30 to-white pointer-events-none" />
      <div className="relative max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-black text-[#134E4A] mb-3">
            Des chiffres qui parlent
          </h2>
          <p className="text-gray-600 text-lg">Notre impact en quelques données</p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          <Counter value={40} label="Villes surveillées" />
          <Counter value={91} suffix="K+" label="Observations météo" />
          <Counter value={5} label="Modèles IA" />
          <Counter value={27} suffix="M" label="Camerounais protégés" />
        </div>
      </div>
    </section>
  );
}
