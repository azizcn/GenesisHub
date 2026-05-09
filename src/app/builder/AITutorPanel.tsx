"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  GraduationCap,
  BookOpen,
  Link2,
  Pencil,
  Volume2,
  VolumeX,
  ChevronDown,
  ChevronRight,
  Sparkles,
  X,
} from "lucide-react";
import { useApp } from "../context/AppContext";
import { getTutorGuidance, type TutorGuidance } from "./tutorData";
import type { Node } from "@xyflow/react";

interface AITutorPanelProps {
  selectedNode: Node | null;
  isOpen: boolean;
  onToggle: () => void;
}

type SectionKey = "whatItDoes" | "howToUse" | "whatToModify";

const SECTIONS: { key: SectionKey; icon: React.ElementType; color: string }[] = [
  { key: "whatItDoes", icon: BookOpen, color: "#14f195" },
  { key: "howToUse", icon: Link2, color: "#9945ff" },
  { key: "whatToModify", icon: Pencil, color: "#f0f056" },
];

function getNodeDisplayName(node: Node): string {
  const data = node.data as Record<string, unknown>;
  if (node.type === "structNode") {
    const cat = data.nodeCategory as string;
    const name = (data.structName as string) || "Struct";
    return cat === "context" ? `Context: ${name}` : `State: ${name}`;
  }
  if (node.type === "functionNode") {
    return `fn ${(data.functionName as string) || "function"}`;
  }
  if (node.type === "actionNode") {
    return (data.actionType as string) === "transfer" ? "Transfer SOL" : "Mint Token";
  }
  if (node.type === "templateNode") {
    return (data.templateType as string) === "basic_coin" ? "Basic Coin Template" : "Basic NFT Template";
  }
  return "Node";
}

function getNodeAccentColor(node: Node): string {
  const data = node.data as Record<string, unknown>;
  if (node.type === "structNode") {
    return (data.nodeCategory as string) === "context" ? "#9945ff" : "#14f195";
  }
  if (node.type === "functionNode") return "#f0f056";
  if (node.type === "actionNode") {
    return (data.actionType as string) === "transfer" ? "#38bdf8" : "#fb923c";
  }
  if (node.type === "templateNode") {
    return (data.templateType as string) === "basic_coin" ? "#14f195" : "#9945ff";
  }
  return "#94a3b8";
}

export default function AITutorPanel({ selectedNode, isOpen, onToggle }: AITutorPanelProps) {
  const { locale, t } = useApp();
  const [openSections, setOpenSections] = useState<Record<SectionKey, boolean>>({
    whatItDoes: true,
    howToUse: true,
    whatToModify: true,
  });
  const [speakingSection, setSpeakingSection] = useState<SectionKey | null>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      synthRef.current = window.speechSynthesis;
    }
    return () => {
      synthRef.current?.cancel();
    };
  }, []);

  // Stop speaking when node changes
  useEffect(() => {
    synthRef.current?.cancel();
    setSpeakingSection(null);
  }, [selectedNode?.id]);

  const toggleSection = useCallback((key: SectionKey) => {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  }, []);

  const handleSpeak = useCallback(
    (key: SectionKey, text: string) => {
      if (!synthRef.current) return;

      if (speakingSection === key) {
        synthRef.current.cancel();
        setSpeakingSection(null);
        return;
      }

      synthRef.current.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = locale === "tr" ? "tr-TR" : "en-US";
      utterance.rate = 0.95;
      utterance.pitch = 1;
      utterance.onend = () => setSpeakingSection(null);
      utterance.onerror = () => setSpeakingSection(null);
      synthRef.current.speak(utterance);
      setSpeakingSection(key);
    },
    [speakingSection, locale]
  );

  const guidance: TutorGuidance | null = selectedNode
    ? getTutorGuidance(
        selectedNode.type || "",
        selectedNode.data as Record<string, unknown>
      )
    : null;

  const sectionLabels: Record<SectionKey, string> = {
    whatItDoes: t("builder.tutor.whatItDoes"),
    howToUse: t("builder.tutor.howToUse"),
    whatToModify: t("builder.tutor.whatToModify"),
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: "auto", opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="flex flex-col overflow-hidden shrink-0"
      style={{
        background: "var(--glass-bg)",
        borderBottom: "1px solid var(--card-border)",
        maxHeight: "45vh",
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-card-border">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-neon-purple to-neon-green flex items-center justify-center">
            <GraduationCap size={14} className="text-background" />
          </div>
          <div>
            <div className="text-sm font-bold text-foreground">{t("builder.tutor.title")}</div>
            {selectedNode && (
              <div
                className="text-[10px] font-mono font-semibold"
                style={{ color: getNodeAccentColor(selectedNode) }}
              >
                {getNodeDisplayName(selectedNode)}
              </div>
            )}
          </div>
        </div>
        <button
          onClick={onToggle}
          className="p-1.5 rounded-lg text-muted hover:text-foreground hover:bg-surface transition-colors"
        >
          <X size={14} />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-3 py-2 space-y-1.5">
        <AnimatePresence mode="wait">
          {selectedNode && guidance ? (
            <motion.div
              key={selectedNode.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="space-y-1.5"
            >
              {SECTIONS.map((section) => {
                const text = guidance[section.key][locale === "tr" ? "tr" : "en"];
                const isSpeaking = speakingSection === section.key;

                return (
                  <div
                    key={section.key}
                    className="rounded-lg overflow-hidden"
                    style={{
                      background: "var(--surface)",
                      border: "1px solid var(--card-border)",
                    }}
                  >
                    {/* Section Header */}
                    <button
                      onClick={() => toggleSection(section.key)}
                      className="w-full flex items-center gap-2 px-3 py-2 text-left hover:bg-surface-hover transition-colors"
                    >
                      <div
                        className="w-5 h-5 rounded flex items-center justify-center shrink-0"
                        style={{ backgroundColor: `${section.color}20` }}
                      >
                        <section.icon size={11} style={{ color: section.color }} />
                      </div>
                      <span className="text-xs font-semibold text-foreground flex-1">
                        {sectionLabels[section.key]}
                      </span>
                      {openSections[section.key] ? (
                        <ChevronDown size={12} className="text-muted" />
                      ) : (
                        <ChevronRight size={12} className="text-muted" />
                      )}
                    </button>

                    {/* Section Body */}
                    <AnimatePresence>
                      {openSections[section.key] && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.15 }}
                        >
                          <div className="px-3 pb-2.5">
                            <p className="text-xs text-muted leading-relaxed mb-2">
                              {text}
                            </p>
                            {/* TTS Button */}
                            <motion.button
                              whileHover={{ scale: 1.03 }}
                              whileTap={{ scale: 0.97 }}
                              onClick={() => handleSpeak(section.key, text)}
                              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[10px] font-semibold transition-all ${
                                isSpeaking
                                  ? "bg-neon-purple/20 text-neon-purple"
                                  : "bg-surface text-muted hover:text-foreground border border-card-border hover:border-muted"
                              }`}
                            >
                              {isSpeaking ? (
                                <>
                                  <VolumeX size={11} />
                                  <span>{t("builder.tutor.playing")}</span>
                                  {/* Animated waveform bars */}
                                  <div className="flex items-end gap-[2px] ml-1 h-3">
                                    {[0, 1, 2, 3].map((i) => (
                                      <motion.div
                                        key={i}
                                        animate={{ height: [3, 10, 3] }}
                                        transition={{
                                          duration: 0.6,
                                          repeat: Infinity,
                                          delay: i * 0.15,
                                        }}
                                        className="w-[2px] rounded-full bg-neon-purple"
                                      />
                                    ))}
                                  </div>
                                </>
                              ) : (
                                <>
                                  <Volume2 size={11} />
                                  <span>{t("builder.tutor.playAudio")}</span>
                                </>
                              )}
                            </motion.button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </motion.div>
          ) : (
            <motion.div
              key="welcome"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-6 px-4 text-center"
            >
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-neon-purple/20 to-neon-green/20 flex items-center justify-center mb-3">
                <Sparkles size={18} className="text-neon-purple" />
              </div>
              <p className="text-xs font-semibold text-foreground mb-1">
                {t("builder.tutor.title")}
              </p>
              <p className="text-[11px] text-muted-dim leading-relaxed">
                {t("builder.tutor.welcome")}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
