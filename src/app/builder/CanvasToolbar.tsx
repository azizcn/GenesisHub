"use client";

import { motion } from "framer-motion";
import { ZoomIn, ZoomOut, Maximize, Lock, Unlock, Download } from "lucide-react";
import { useApp } from "../context/AppContext";

interface CanvasToolbarProps {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onFitView: () => void;
  locked: boolean;
  onToggleLock: () => void;
  onExport: () => void;
}

export default function CanvasToolbar({
  onZoomIn,
  onZoomOut,
  onFitView,
  locked,
  onToggleLock,
  onExport,
}: CanvasToolbarProps) {
  const { t } = useApp();

  const buttons = [
    { icon: ZoomIn, action: onZoomIn, tip: t("builder.zoomIn") },
    { icon: ZoomOut, action: onZoomOut, tip: t("builder.zoomOut") },
    { icon: Maximize, action: onFitView, tip: t("builder.fitView") },
    { icon: locked ? Lock : Unlock, action: onToggleLock, tip: t("builder.lock"), active: locked },
    { icon: Download, action: onExport, tip: t("builder.export") },
  ];

  return (
    <motion.div
      initial={{ y: 30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.5, duration: 0.4 }}
      className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex items-center gap-1 px-2 py-1.5
                 rounded-2xl backdrop-blur-xl"
      style={{
        background: "var(--card-bg)",
        border: "1px solid var(--card-border)",
        boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
      }}
    >
      {buttons.map((btn, i) => (
        <motion.button
          key={i}
          whileHover={{ scale: 1.15 }}
          whileTap={{ scale: 0.9 }}
          onClick={btn.action}
          title={btn.tip}
          className={`p-2.5 rounded-xl transition-colors ${
            btn.active
              ? "bg-neon-green/20 text-neon-green"
              : "text-muted hover:text-foreground hover:bg-surface"
          }`}
        >
          <btn.icon size={16} />
        </motion.button>
      ))}
    </motion.div>
  );
}
