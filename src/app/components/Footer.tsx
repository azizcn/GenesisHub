"use client";

import { Zap, Heart, ExternalLink, Globe } from "lucide-react";
import { useApp } from "../context/AppContext";

export default function Footer() {
  const { t } = useApp();

  return (
    <footer className="border-t border-card-border bg-footer-bg backdrop-blur-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-neon-green to-neon-purple flex items-center justify-center">
              <Zap size={18} className="text-background" />
            </div>
            <span className="text-lg font-bold tracking-tight">
              {t("footer.brand")}
              <span className="text-neon-green">{t("footer.brandAccent")}</span>
            </span>
          </div>

          <div className="flex items-center gap-6">
            <a href="https://github.com/azizcn/HackAssist" target="_blank" rel="noopener noreferrer"
              className="text-muted-dim hover:text-neon-green transition-colors flex items-center gap-1 text-sm">
              <ExternalLink size={16} /> GitHub
            </a>
            <a href="https://solana.com" target="_blank" rel="noopener noreferrer"
              className="text-muted-dim hover:text-neon-green transition-colors flex items-center gap-1 text-sm">
              <Globe size={16} /> Solana
            </a>
          </div>

          <p className="text-sm text-muted-dim flex items-center gap-1">
            {t("footer.builtWith")} <Heart size={14} className="text-red-400" /> {t("footer.forBuilders")}
          </p>
        </div>
      </div>
    </footer>
  );
}
