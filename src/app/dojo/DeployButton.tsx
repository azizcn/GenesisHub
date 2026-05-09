"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Rocket, ExternalLink } from "lucide-react";
import { useTutorialStore } from "./useTutorialStore";
import { useApp } from "../context/AppContext";
import confetti from "canvas-confetti";
import { useCallback, useRef, useState } from "react";
import type { Node, Edge } from "@xyflow/react";
import { generateAnchorCode } from "../builder/codegen";
import DeployGuideModal from "../builder/DeployGuideModal";

import { useReactFlow } from "@xyflow/react";

// ── Generate Anchor Rust code from completed tutorial nodes ─────────────
export function generateAnchorRustCode(
  nodes: Node[],
  edges: Edge[]
): string {
  return generateAnchorCode(nodes, edges);
}

// ── Encode code to solana.new URL ───────────────────────────────────────
// We no longer auto-import. We just open solana.new so the user can paste.
function getSolanaNewURL(): string {
  return `https://beta.solpg.io`;
}

export default function DeployButton() {
  const { t } = useApp();
  const { levelCompleted, currentLevel, currentStep } = useTutorialStore();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const { getNodes, getEdges } = useReactFlow();
  const [modalOpen, setModalOpen] = useState(false);

  const handleDeployClick = useCallback(() => {
    // Fire confetti
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const x = (rect.left + rect.width / 2) / window.innerWidth;
      const y = (rect.top + rect.height / 2) / window.innerHeight;
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { x, y },
        colors: ["#14f195", "#9945ff", "#f0f056"],
      });
    }

    // Open Modal instead of deploying directly
    setModalOpen(true);

    const store = useTutorialStore.getState();
    if (store.currentLevel === 0 && store.currentStep === 5) {
      store.advanceStep();
      store.completeLevel();
      // To get the t() function and config safely without hooks inside the callback:
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
  }, [t]);

  const handleConfirmDeploy = useCallback(() => {
    // Generate code and copy to clipboard
    const code = generateAnchorRustCode(getNodes(), getEdges());
    navigator.clipboard.writeText(code);
    setModalOpen(false);

    // Open solpg
    setTimeout(() => {
      window.open(getSolanaNewURL(), "_blank");
    }, 500);
  }, [getNodes, getEdges]);

  return (
    <>
      <AnimatePresence>
      {(levelCompleted || (currentLevel === 0 && currentStep === 5)) && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.8 }}
          transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.3 }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40"
        >
          <motion.button
            ref={buttonRef}
            onClick={handleDeployClick}
            className="deploy-button-glow relative px-8 py-4 rounded-2xl font-bold text-sm
                       flex items-center gap-3 text-background cursor-pointer overflow-hidden"
            style={{
              background: "linear-gradient(135deg, #14f195, #9945ff, #14f195)",
              backgroundSize: "200% 200%",
            }}
            animate={{
              backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
            }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            whileHover={{ scale: 1.05, boxShadow: "0 0 40px rgba(20,241,149,0.5)" }}
            whileTap={{ scale: 0.97 }}
          >
            {/* Particle shimmer overlay */}
            <motion.div className="absolute inset-0 opacity-30"
              style={{
                background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)",
                backgroundSize: "200% 100%",
              }}
              animate={{ backgroundPosition: ["-200% 0%", "200% 0%"] }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }} />

            <Rocket size={18} className="relative z-10" />
            <span className="relative z-10">{t("builder.deployButton")}</span>
            <ExternalLink size={14} className="relative z-10 opacity-70" />

            {/* Pulsing ring */}
            <motion.div className="absolute inset-0 rounded-2xl"
              style={{ border: "2px solid rgba(20,241,149,0.6)" }}
              animate={{ scale: [1, 1.08, 1], opacity: [0.6, 0, 0.6] }}
              transition={{ duration: 2, repeat: Infinity }} />
          </motion.button>

          <div className="text-center mt-2">
            <span className="text-[10px] text-muted">Level {currentLevel} Complete — Anchor code generated ✨</span>
          </div>
        </motion.div>
      )}
      </AnimatePresence>
      <DeployGuideModal isOpen={modalOpen} onClose={() => setModalOpen(false)} onDeploy={handleConfirmDeploy} />
    </>
  );
}
