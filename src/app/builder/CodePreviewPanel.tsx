"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PanelRightClose, Copy, Check, Sparkles, Rocket, ExternalLink, Lock, Unlock } from "lucide-react";
import { useApp } from "../context/AppContext";
import { useBuilderStore } from "./useBuilderStore";
import { useTutorialStore } from "../dojo/useTutorialStore";
import DeployGuideModal from "./DeployGuideModal";

interface CodePreviewPanelProps {
  code: string;
  isOpen: boolean;
  onToggle: () => void;
  onOpenAIModal?: () => void; // Make optional for Dojo
  onChangeCodeOverride?: (code: string) => void;
}

function highlightRust(code: string): string {
  let result = code;
  result = result.replace(/(\/\/.*)$/gm, '<span class="text-muted-dim italic">$1</span>');
  result = result.replace(/("(?:[^"\\]|\\.)*")/g, '<span class="text-neon-yellow">$1</span>');
  result = result.replace(
    /\b(use|pub|fn|struct|mod|let|mut|impl|return|if|else|match|for|while|loop|break|continue|type|enum|trait|where|self|super|crate|as|in|ref|move)\b/g,
    '<span class="text-neon-purple font-semibold">$1</span>'
  );
  result = result.replace(
    /\b(declare_id|msg|require|anchor_lang|solana_program|token)\b/g,
    '<span class="text-neon-green">$1</span>'
  );
  result = result.replace(/(#\[[\w(),:_\s]*\])/g, '<span class="text-neon-yellow/80">$1</span>');
  result = result.replace(
    /\b(u8|u16|u32|u64|u128|i8|i16|i32|i64|i128|bool|String|Pubkey|Result|Ok|Err|Context|Signer|Account|Program|SystemProgram|CpiContext|AccountInfo)\b/g,
    '<span class="text-sky-400">$1</span>'
  );
  return result;
}

export default function CodePreviewPanel({ code, isOpen, onToggle, onOpenAIModal, onChangeCodeOverride }: CodePreviewPanelProps) {
  const { t } = useApp();
  const { customCodeOverride, setCustomCodeOverride } = useBuilderStore();
  const [copied, setCopied] = useState(false);
  const [deployToast, setDeployToast] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [deployModalOpen, setDeployModalOpen] = useState(false);

  const displayCode = customCodeOverride !== null ? customCodeOverride : code;

  const handleCopy = () => {
    navigator.clipboard.writeText(displayCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDeploy = () => {
    setDeployModalOpen(true);

    const store = useTutorialStore.getState();
    if (store.currentLevel === 0 && store.currentStep === 5) {
      store.advanceStep();
      store.completeLevel();
      import("../dojo/levelConfigs").then(({ getLevelConfig }) => {
        const config = getLevelConfig(0);
        const dialogue = config.dialogue[5];
        if (dialogue) {
          store.setSenseiMessage(dialogue.successMessage, "happy");
          import("../dojo/useTutorialStore").then(({ triggerSenseiVoice }) => {
            triggerSenseiVoice(t(dialogue.successMessage));
          });
        }
      });
    }
  };

  const handleConfirmDeploy = () => {
    navigator.clipboard.writeText(displayCode);
    setDeployModalOpen(false);
    setDeployToast(true);
    setTimeout(() => setDeployToast(false), 4000);
    setTimeout(() => {
      window.open("https://beta.solpg.io", "_blank");
    }, 1500);
  };

  if (!isOpen) return null;

  return (
    <div className="h-full flex flex-col overflow-hidden" style={{ background: "var(--glass-bg)", borderTop: "1px solid var(--card-border)" }}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-card-border shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-neon-green animate-pulse" />
          <span className="text-sm font-bold text-foreground">{t("builder.codePreview")}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setIsEditing(!isEditing)}
            className={`p-1.5 rounded-lg flex items-center gap-1 text-xs font-semibold transition-colors ${isEditing ? "bg-neon-purple/20 text-neon-purple" : "bg-surface text-muted hover:text-foreground"}`} title={isEditing ? t("code.preview.lock") : t("code.preview.unlock")}>
            {isEditing ? <Unlock size={14} /> : <Lock size={14} />}
          </motion.button>
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={handleCopy}
            className="p-1.5 rounded-lg bg-surface text-muted hover:text-neon-green transition-colors" title="Copy">
            {copied ? <Check size={14} className="text-neon-green" /> : <Copy size={14} />}
          </motion.button>
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={onToggle}
            className="p-1.5 rounded-lg bg-surface text-muted hover:text-foreground transition-colors">
            <PanelRightClose size={14} />
          </motion.button>
        </div>
      </div>

      {/* Code Body */}
      <div className="flex-1 overflow-y-auto p-4 relative group" onDoubleClick={() => !isEditing && setIsEditing(true)}>
        {!isEditing && (
          <div className="absolute top-2 right-4 opacity-0 group-hover:opacity-100 transition-opacity bg-background/80 backdrop-blur text-[10px] text-muted-dim px-2 py-1 rounded">
            {t("code.preview.lockedMessage")}
          </div>
        )}
        
        {isEditing ? (
          <textarea
            value={displayCode}
            onChange={(e) => {
              setCustomCodeOverride(e.target.value);
              if (onChangeCodeOverride) onChangeCodeOverride(e.target.value);
            }}
            className="w-full h-full bg-surface border-none rounded-lg p-3 text-xs font-mono text-foreground focus:outline-none focus:ring-1 focus:ring-neon-purple resize-none"
            spellCheck={false}
          />
        ) : displayCode.trim() ? (
          <pre className="text-xs font-mono leading-relaxed whitespace-pre-wrap break-words cursor-text">
            <code dangerouslySetInnerHTML={{ __html: highlightRust(displayCode) }} />
          </pre>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center text-muted-dim px-6">
            <div className="w-12 h-12 rounded-2xl bg-surface flex items-center justify-center mb-3">
              <Sparkles size={20} className="text-muted" />
            </div>
            <p className="text-sm font-medium mb-1">{t("builder.noCode")}</p>
            <p className="text-xs">{t("builder.noCodeHint")}</p>
          </div>
        )}
      </div>

      {/* Footer: AI Import + Deploy to Devnet */}
      <div className="p-3 border-t border-card-border shrink-0 space-y-2">
        {/* AI Import (Hidden in Dojo if no handler provided) */}
        {onOpenAIModal && (
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={onOpenAIModal}
            className="w-full flex items-center justify-center gap-2 py-2 rounded-xl bg-surface border border-card-border text-muted hover:text-neon-purple hover:border-neon-purple/30 font-semibold text-xs transition-all">
            <Sparkles size={13} />
            {t("builder.aiImport")}
          </motion.button>
        )}

        {/* Deploy to Devnet Button — highly visible gradient */}
        <motion.button whileHover={{ scale: 1.02, boxShadow: "0 0 30px rgba(20,241,149,0.3), 0 0 60px rgba(153,69,255,0.15)" }}
          whileTap={{ scale: 0.98 }} onClick={handleDeploy} disabled={!code.trim()}
          className="w-full relative flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm text-background disabled:opacity-40 disabled:cursor-not-allowed overflow-hidden"
          style={{ background: "linear-gradient(135deg, #14f195, #00d4aa, #9945ff)" }}>
          {/* Animated gradient border */}
          <motion.div className="absolute inset-0 opacity-40" style={{ background: "linear-gradient(135deg, #14f195, #9945ff, #14f195)", backgroundSize: "200% 200%" }}
            animate={{ backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"] }} transition={{ duration: 3, repeat: Infinity }} />
          <Rocket size={16} className="relative z-10" />
          <span className="relative z-10">{t("builder.deployButton")}</span>
          <ExternalLink size={12} className="relative z-10 opacity-70" />
        </motion.button>
      </div>

      {/* Deploy Toast */}
      <AnimatePresence>
        {deployToast && (
          <motion.div initial={{ opacity: 0, y: 20, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 right-6 z-50 max-w-sm px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3"
            style={{ background: "linear-gradient(135deg, rgba(20,241,149,0.15), rgba(153,69,255,0.15))", border: "1px solid rgba(20,241,149,0.3)", backdropFilter: "blur(20px)" }}>
            <div className="w-8 h-8 rounded-lg bg-neon-green/20 flex items-center justify-center shrink-0">
              <Check size={16} className="text-neon-green" />
            </div>
            <div>
              <p className="text-xs font-bold text-foreground">{t("builder.deployToast")}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Deploy Guide Modal */}
      <DeployGuideModal 
        isOpen={deployModalOpen} 
        onClose={() => setDeployModalOpen(false)} 
        onDeploy={handleConfirmDeploy} 
      />
    </div>
  );
}
