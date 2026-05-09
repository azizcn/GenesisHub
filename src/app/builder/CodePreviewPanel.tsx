"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { PanelRightClose, Copy, Check, Sparkles } from "lucide-react";
import { useApp } from "../context/AppContext";

interface CodePreviewPanelProps {
  code: string;
  isOpen: boolean;
  onToggle: () => void;
  onOpenAIModal: () => void;
}

// Basic Rust syntax highlighting via regex
function highlightRust(code: string): string {
  let result = code;
  // Comments
  result = result.replace(/(\/\/.*)$/gm, '<span class="text-muted-dim italic">$1</span>');
  // Strings
  result = result.replace(/("(?:[^"\\]|\\.)*")/g, '<span class="text-neon-yellow">$1</span>');
  // Keywords
  result = result.replace(
    /\b(use|pub|fn|struct|mod|let|mut|impl|return|if|else|match|for|while|loop|break|continue|type|enum|trait|where|self|super|crate|as|in|ref|move)\b/g,
    '<span class="text-neon-purple font-semibold">$1</span>'
  );
  // Macros
  result = result.replace(
    /\b(declare_id|msg|require|anchor_lang|solana_program|token)\b/g,
    '<span class="text-neon-green">$1</span>'
  );
  // Attributes
  result = result.replace(/(#\[[\w(),:_\s]*\])/g, '<span class="text-neon-yellow/80">$1</span>');
  // Types
  result = result.replace(
    /\b(u8|u16|u32|u64|u128|i8|i16|i32|i64|i128|bool|String|Pubkey|Result|Ok|Err|Context|Signer|Account|Program|SystemProgram|CpiContext)\b/g,
    '<span class="text-sky-400">$1</span>'
  );
  return result;
}

export default function CodePreviewPanel({ code, isOpen, onToggle, onOpenAIModal }: CodePreviewPanelProps) {
  const { t } = useApp();
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isOpen) return null;

  return (
    <div
      className="h-full flex flex-col overflow-hidden"
      style={{
        background: "var(--glass-bg)",
        borderTop: "1px solid var(--card-border)",
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-card-border shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-neon-green animate-pulse" />
          <span className="text-sm font-bold text-foreground">{t("builder.codePreview")}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleCopy}
            className="p-1.5 rounded-lg bg-surface text-muted hover:text-neon-green transition-colors"
            title="Copy"
          >
            {copied ? <Check size={14} className="text-neon-green" /> : <Copy size={14} />}
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onToggle}
            className="p-1.5 rounded-lg bg-surface text-muted hover:text-foreground transition-colors"
          >
            <PanelRightClose size={14} />
          </motion.button>
        </div>
      </div>

      {/* Code Body */}
      <div className="flex-1 overflow-y-auto p-4">
        {code.trim() ? (
          <pre className="text-xs font-mono leading-relaxed whitespace-pre-wrap break-words">
            <code dangerouslySetInnerHTML={{ __html: highlightRust(code) }} />
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

      {/* AI Import Button */}
      <div className="p-3 border-t border-card-border shrink-0">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onOpenAIModal}
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl
                     bg-gradient-to-r from-neon-purple/20 to-neon-green/20
                     border border-neon-purple/30 text-neon-purple
                     hover:from-neon-purple/30 hover:to-neon-green/30
                     font-semibold text-xs transition-all"
        >
          <Sparkles size={14} />
          {t("builder.aiImport")}
        </motion.button>
      </div>
    </div>
  );
}
