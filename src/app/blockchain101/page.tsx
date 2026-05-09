"use client";

import { motion } from "framer-motion";
import { Wallet, Network, Users, Fuel, Sparkles, ArrowLeft } from "lucide-react";
import { useApp } from "../context/AppContext";
import TTSButton from "../components/TTSButton";
import Link from "next/link";

export default function Blockchain101Page() {
  const { t } = useApp();

  const concepts = [
    {
      id: "wallets",
      icon: Wallet,
      color: "neon-purple",
      titleKey: "bc101.wallets.title",
      textKey: "bc101.wallets.text",
    },
    {
      id: "nodes",
      icon: Network,
      color: "neon-green",
      titleKey: "bc101.nodes.title",
      textKey: "bc101.nodes.text",
    },
    {
      id: "consensus",
      icon: Users,
      color: "neon-yellow",
      titleKey: "bc101.consensus.title",
      textKey: "bc101.consensus.text",
    },
    {
      id: "gas",
      icon: Fuel,
      color: "neon-purple",
      titleKey: "bc101.gas.title",
      textKey: "bc101.gas.text",
    },
  ];

  const colorMap: Record<string, { bg: string; text: string; shadow: string }> = {
    "neon-green": { bg: "bg-neon-green/10", text: "text-neon-green", shadow: "shadow-neon-green/20" },
    "neon-purple": { bg: "bg-neon-purple/10", text: "text-neon-purple", shadow: "shadow-neon-purple/20" },
    "neon-yellow": { bg: "bg-neon-yellow/10", text: "text-neon-yellow", shadow: "shadow-neon-yellow/20" },
  };

  return (
    <section className="min-h-screen relative overflow-hidden pb-20">
      <div className="absolute top-0 right-0 w-[500px] h-[400px] bg-neon-purple/5 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-neon-green/5 rounded-full blur-[150px] pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <Link href="/" className="p-2 rounded-lg bg-card-bg border border-card-border text-muted hover:text-foreground transition-colors inline-flex">
              <ArrowLeft size={16} />
            </Link>
          </div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl sm:text-4xl font-bold flex items-center gap-3">
              <span className="gradient-text">{t("bc101.title")}</span>
              <Sparkles size={24} className="text-neon-yellow" />
            </h1>
          </div>
          <p className="text-muted mt-3 text-lg">
            {t("bc101.subtitle")}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {concepts.map((concept, i) => (
            <motion.div
              key={concept.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="glass-card rounded-2xl p-6 flex flex-col h-full hover:border-muted-dim/50 transition-all"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-xl ${colorMap[concept.color].bg} flex items-center justify-center ${colorMap[concept.color].shadow} shadow-lg`}>
                    <concept.icon size={24} className={colorMap[concept.color].text} />
                  </div>
                  <h2 className="text-xl font-bold">{t(concept.titleKey)}</h2>
                </div>
                <TTSButton size={16} text={t(concept.textKey)} />
              </div>
              <p className="text-foreground/80 leading-relaxed flex-1">
                {t(concept.textKey)}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
