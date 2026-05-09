"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles, Loader2, AlertCircle } from "lucide-react";
import { parseRustToNodes } from "./codegen";
import { useApp } from "../context/AppContext";
import type { Node, Edge } from "@xyflow/react";

interface AIImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (nodes: Node[], edges: Edge[]) => void;
}

const SAMPLE_CODE = `use anchor_lang::prelude::*;

declare_id!("YOUR_PROGRAM_ID_HERE");

#[account]
pub struct UserProfile {
    pub authority: Pubkey,
    pub name: String,
    pub score: u64,
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(mut)]
    pub user: Signer<'info>,
    #[account(init, payer = user, space = 8 + 32 + 64 + 8)]
    pub profile: Account<'info, UserProfile>,
    pub system_program: Program<'info, System>,
}

#[program]
pub mod my_program {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        let profile = &mut ctx.accounts.profile;
        profile.authority = ctx.accounts.user.key();
        profile.name = String::new();
        profile.score = 0;
        Ok(())
    }
}`;

export default function AIImportModal({ isOpen, onClose, onImport }: AIImportModalProps) {
  const { t } = useApp();
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleParse = async () => {
    if (!code.trim()) {
      setError(t("builder.aiNoCode"));
      return;
    }

    setLoading(true);
    setError("");

    // Simulate AI API call delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    try {
      const { nodes, edges } = parseRustToNodes(code);
      if (nodes.length === 0) {
        setError(t("builder.aiNoStructs"));
        setLoading(false);
        return;
      }
      onImport(nodes, edges);
      setCode("");
      onClose();
    } catch {
      setError(t("builder.aiError"));
    }

    setLoading(false);
  };

  const handleInsertSample = () => {
    setCode(SAMPLE_CODE);
    setError("");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

          {/* Modal */}
          <motion.div
            initial={{ scale: 0.9, y: 30 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 30 }}
            transition={{ type: "spring", damping: 25 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-2xl rounded-2xl overflow-hidden"
            style={{
              background: "var(--glass-bg)",
              border: "1px solid var(--card-border)",
              boxShadow: "0 24px 80px rgba(0,0,0,0.5)",
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-card-border">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-neon-purple to-neon-green flex items-center justify-center">
                  <Sparkles size={18} className="text-background" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-foreground">{t("builder.aiImport")}</h3>
                  <p className="text-xs text-muted-dim">{t("builder.aiDesc")}</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-lg text-muted hover:text-foreground hover:bg-surface transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Body */}
            <div className="px-6 py-4">
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-semibold text-muted uppercase tracking-wider">
                  {t("builder.pasteCode")}
                </label>
                <button
                  onClick={handleInsertSample}
                  className="text-[10px] text-neon-purple hover:text-neon-green transition-colors font-medium"
                >
                  {t("builder.insertSample")}
                </button>
              </div>

              <textarea
                value={code}
                onChange={(e) => {
                  setCode(e.target.value);
                  setError("");
                }}
                placeholder={t("builder.pastePlaceholder")}
                rows={14}
                className="w-full bg-code-bg border border-code-border rounded-xl px-4 py-3
                           font-mono text-xs text-foreground resize-none
                           focus:outline-none focus:ring-2 focus:ring-neon-purple/40
                           placeholder:text-muted-dim"
              />

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2 mt-2 text-xs text-red-400"
                >
                  <AlertCircle size={14} />
                  {error}
                </motion.div>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-card-border">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-sm text-muted hover:text-foreground
                           border border-card-border hover:border-muted transition-colors"
              >
                {t("builder.cancel")}
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleParse}
                disabled={loading}
                className="px-5 py-2 rounded-xl text-sm font-semibold
                           bg-gradient-to-r from-neon-purple to-neon-green text-background
                           disabled:opacity-50 disabled:cursor-not-allowed
                           flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    {t("builder.parsing")}
                  </>
                ) : (
                  <>
                    <Sparkles size={14} />
                    {t("builder.parseAI")}
                  </>
                )}
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
