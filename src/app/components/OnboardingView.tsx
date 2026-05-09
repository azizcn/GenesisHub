"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Code2, Braces, Hash, Globe, ChevronRight, Zap } from "lucide-react";
import { useApp, type Language } from "../context/AppContext";

export default function OnboardingView() {
  const { setLanguage, setView, t } = useApp();
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<Language | null>(null);

  const languages: { id: Language; label: string; icon: React.ElementType; color: string; desc: string }[] = [
    {
      id: "javascript",
      label: t("onboarding.lang.javascript"),
      icon: Braces,
      color: "from-yellow-400 to-amber-500",
      desc: t("onboarding.desc.javascript"),
    },
    {
      id: "python",
      label: t("onboarding.lang.python"),
      icon: Code2,
      color: "from-blue-400 to-cyan-500",
      desc: t("onboarding.desc.python"),
    },
    {
      id: "csharp",
      label: t("onboarding.lang.csharp"),
      icon: Hash,
      color: "from-violet-400 to-purple-500",
      desc: t("onboarding.desc.csharp"),
    },
    {
      id: "none",
      label: t("onboarding.lang.none"),
      icon: Globe,
      color: "from-emerald-400 to-green-500",
      desc: t("onboarding.desc.none"),
    },
  ];

  const handleSelect = (lang: Language) => {
    setSelectedId(lang);
    setTimeout(() => {
      setLanguage(lang);
      setView("hub");
    }, 600);
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center hero-glow grid-bg overflow-hidden">
      {/* Ambient glow orbs */}
      <div className="absolute top-20 left-10 w-80 h-80 bg-neon-green/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-neon-purple/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-neon-purple/3 rounded-full blur-[200px] pointer-events-none" />

      {/* Floating particles */}
      {[
        { x: 5, y: 12, d: 3.2, dl: 0.1 }, { x: 15, y: 78, d: 5.1, dl: 1.2 },
        { x: 25, y: 34, d: 4.0, dl: 0.5 }, { x: 35, y: 91, d: 6.3, dl: 2.1 },
        { x: 45, y: 8,  d: 3.8, dl: 0.8 }, { x: 55, y: 62, d: 5.5, dl: 1.5 },
        { x: 65, y: 45, d: 4.2, dl: 2.8 }, { x: 75, y: 23, d: 6.0, dl: 0.3 },
        { x: 85, y: 56, d: 3.5, dl: 1.9 }, { x: 95, y: 87, d: 5.8, dl: 0.7 },
        { x: 10, y: 50, d: 4.5, dl: 2.4 }, { x: 20, y: 17, d: 3.9, dl: 1.1 },
        { x: 30, y: 70, d: 5.3, dl: 0.4 }, { x: 40, y: 3,  d: 6.1, dl: 2.6 },
        { x: 50, y: 40, d: 4.7, dl: 1.7 }, { x: 60, y: 95, d: 3.3, dl: 0.9 },
        { x: 70, y: 28, d: 5.0, dl: 2.3 }, { x: 80, y: 65, d: 4.4, dl: 1.4 },
        { x: 90, y: 15, d: 6.5, dl: 0.6 }, { x: 8,  y: 82, d: 3.7, dl: 2.0 },
      ].map((p, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full bg-neon-green/30"
          style={{ left: `${p.x}%`, top: `${p.y}%` }}
          animate={{
            y: [0, -30, 0],
            opacity: [0.2, 0.6, 0.2],
          }}
          transition={{
            duration: p.d,
            repeat: Infinity,
            delay: p.dl,
          }}
        />
      ))}

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-neon-green/10 border border-neon-green/20 text-neon-green text-sm font-medium mb-8"
          >
            <Sparkles size={16} />
            {t("onboarding.badge")}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex items-center justify-center gap-3 mb-6"
          >
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-neon-green to-neon-purple flex items-center justify-center shadow-lg shadow-neon-green/20">
              <Zap size={24} className="text-background" />
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight">
              {t("onboarding.title")}
              <span className="gradient-text">{t("onboarding.titleAccent")}</span>
            </h1>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.7 }}
            className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight mb-4"
          >
            {t("onboarding.heading")}
            <span className="gradient-text">{t("onboarding.headingAccent")}</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="text-lg text-muted max-w-xl mx-auto"
          >
            {t("onboarding.subtitle")}
          </motion.p>
        </motion.div>

        {/* Language Cards */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.6 }}
          className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto"
        >
          {languages.map((lang, i) => (
            <motion.button
              key={lang.id}
              id={`lang-${lang.id}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 + i * 0.1 }}
              whileHover={{ scale: 1.03, y: -4 }}
              whileTap={{ scale: 0.97 }}
              onHoverStart={() => setHoveredId(lang.id)}
              onHoverEnd={() => setHoveredId(null)}
              onClick={() => handleSelect(lang.id)}
              className={`relative group p-6 rounded-2xl text-left transition-all duration-300 border overflow-hidden ${
                selectedId === lang.id
                  ? "border-neon-green bg-neon-green/10 shadow-lg shadow-neon-green/20"
                  : "border-card-border bg-card-bg hover:border-muted-dim/50"
              }`}
            >
              {/* Gradient glow on hover */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${lang.color} opacity-0 group-hover:opacity-[0.05] transition-opacity duration-300`}
              />

              <div className="relative z-10">
                <div
                  className={`w-12 h-12 rounded-xl bg-gradient-to-br ${lang.color} flex items-center justify-center mb-4 shadow-lg`}
                >
                  <lang.icon size={22} className="text-white" />
                </div>

                <h3 className="text-lg font-bold mb-1 flex items-center gap-2">
                  {lang.label}
                  <AnimatePresence>
                    {hoveredId === lang.id && (
                      <motion.span
                        initial={{ opacity: 0, x: -5 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -5 }}
                      >
                        <ChevronRight size={16} className="text-neon-green" />
                      </motion.span>
                    )}
                  </AnimatePresence>
                </h3>

                <p className="text-sm text-muted leading-relaxed">{lang.desc}</p>
              </div>

              {/* Selection indicator */}
              <AnimatePresence>
                {selectedId === lang.id && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute top-3 right-3 w-6 h-6 rounded-full bg-neon-green flex items-center justify-center"
                  >
                    <motion.svg
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 0.3 }}
                      width="12"
                      height="12"
                      viewBox="0 0 12 12"
                    >
                      <motion.path
                        d="M2 6 L5 9 L10 3"
                        fill="none"
                        stroke="#0f172a"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </motion.svg>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          ))}
        </motion.div>

        {/* Bottom hint */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.6 }}
          className="text-center text-sm text-muted-dim mt-8"
        >
          {t("onboarding.hint")}
        </motion.p>
      </div>
    </section>
  );
}
