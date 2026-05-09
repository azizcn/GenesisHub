"use client";

import { useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Volume2, VolumeX } from "lucide-react";
import { useApp } from "../context/AppContext";

interface TTSButtonProps {
  text?: string;
  size?: number;
  className?: string;
}

export default function TTSButton({ text = "", size = 16, className = "" }: TTSButtonProps) {
  const { t, locale } = useApp();
  const [isPlaying, setIsPlaying] = useState(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  const handlePlay = useCallback(() => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;

    // If already playing, stop
    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      return;
    }

    // Clean text: remove markdown bold, backticks, etc.
    const cleanText = text
      .replace(/\*\*(.*?)\*\*/g, "$1")
      .replace(/`(.*?)`/g, "$1")
      .replace(/#{1,6}\s/g, "")
      .trim();

    if (!cleanText) {
      // No text provided — just show waveform animation as mockup
      setIsPlaying(true);
      setTimeout(() => setIsPlaying(false), 3500);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = locale === "tr" ? "tr-TR" : "en-US";
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    utterance.onend = () => setIsPlaying(false);
    utterance.onerror = () => setIsPlaying(false);

    utteranceRef.current = utterance;
    setIsPlaying(true);
    window.speechSynthesis.speak(utterance);
  }, [isPlaying, text, locale]);

  const barCount = 5;

  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        handlePlay();
      }}
      className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
        isPlaying
          ? "bg-neon-green/20 text-neon-green border border-neon-green/30"
          : "bg-surface hover:bg-surface-hover text-muted hover:text-neon-green border border-card-border"
      } ${className}`}
      title={isPlaying ? t("tts.playing") : t("tts.play")}
      aria-label={isPlaying ? t("tts.playing") : t("tts.play")}
    >
      {isPlaying ? <VolumeX size={size} /> : <Volume2 size={size} />}

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
                  height: [4, 14 + (i % 3) * 2, 6, 18, 4],
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
