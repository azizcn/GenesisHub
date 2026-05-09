"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Volume2 } from "lucide-react";
import { useApp } from "../context/AppContext";

interface TTSButtonProps {
  size?: number;
  className?: string;
}

export default function TTSButton({ size = 16, className = "" }: TTSButtonProps) {
  const { t } = useApp();
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlay = useCallback(() => {
    if (isPlaying) return;
    setIsPlaying(true);
    // Simulate TTS playback for 3.5 seconds
    setTimeout(() => setIsPlaying(false), 3500);
  }, [isPlaying]);

  const barCount = 5;

  return (
    <button
      onClick={handlePlay}
      className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
        isPlaying
          ? "bg-neon-green/20 text-neon-green border border-neon-green/30"
          : "bg-surface hover:bg-surface-hover text-muted hover:text-neon-green border border-card-border"
      } ${className}`}
      title={isPlaying ? t("tts.playing") : t("tts.play")}
      aria-label={isPlaying ? t("tts.playing") : t("tts.play")}
    >
      <Volume2 size={size} />

      <AnimatePresence>
        {isPlaying && (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: "auto", opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="flex items-center gap-[2px] h-5 overflow-hidden"
          >
            {Array.from({ length: barCount }).map((_, i) => (
              <motion.div
                key={i}
                className="w-[3px] rounded-full bg-neon-green"
                animate={{
                  height: [4, 14 + Math.random() * 6, 6, 18, 4],
                }}
                transition={{
                  duration: 0.8 + i * 0.1,
                  repeat: Infinity,
                  repeatType: "reverse",
                  ease: "easeInOut",
                  delay: i * 0.08,
                }}
                style={{ minHeight: 4 }}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {!isPlaying && (
        <span className="hidden sm:inline">{t("tts.play")}</span>
      )}
    </button>
  );
}
