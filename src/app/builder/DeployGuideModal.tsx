import { motion, AnimatePresence } from "framer-motion";
import { X, Wallet, Droplets, Hammer, Rocket, ExternalLink, Copy } from "lucide-react";
import { useApp } from "../context/AppContext";

interface DeployGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDeploy: () => void;
}

export default function DeployGuideModal({ isOpen, onClose, onDeploy }: DeployGuideModalProps) {
  const { t } = useApp();

  if (!isOpen) return null;

  const steps = [
    { icon: Copy, color: "text-purple-400", bg: "bg-purple-400/20", title: t("deploy.guide.step1") },
    { icon: Wallet, color: "text-blue-400", bg: "bg-blue-400/20", title: t("deploy.guide.step2") },
    { icon: Droplets, color: "text-cyan-400", bg: "bg-cyan-400/20", title: t("deploy.guide.step3") },
    { icon: Droplets, color: "text-red-400", bg: "bg-red-400/20", title: t("deploy.guide.step4"), isPlanB: true },
    { icon: Hammer, color: "text-yellow-400", bg: "bg-yellow-400/20", title: t("deploy.guide.step5") },
    { icon: Rocket, color: "text-neon-green", bg: "bg-neon-green/20", title: t("deploy.guide.step6") },
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-2xl overflow-hidden bg-card-bg border border-card-border rounded-2xl shadow-2xl"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-card-border">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-neon-green to-neon-purple flex items-center justify-center">
                <Rocket size={20} className="text-background" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-foreground">{t("deploy.guide.title")}</h2>
                <p className="text-xs text-muted">{t("deploy.guide.subtitle")}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-muted hover:text-foreground hover:bg-surface rounded-xl transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Steps */}
          <div className="p-6 space-y-4 max-h-[65vh] overflow-y-auto custom-scrollbar">
            {steps.map((step, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className={`flex flex-col gap-3 p-4 rounded-xl border ${step.isPlanB ? "bg-red-500/5 border-red-500/30" : "bg-surface border-card-border"}`}
              >
                <div className="flex items-start gap-4">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${step.bg}`}>
                    <step.icon size={20} className={step.color} />
                  </div>
                  <div className="pt-1.5 flex-1 space-y-1">
                    <p className={`text-xs font-bold ${step.isPlanB ? "text-red-400 uppercase tracking-widest" : "text-muted-dim"}`}>
                      {step.isPlanB ? "PLAN B: FAUCET IS DRY" : `STEP ${idx + 1}`}
                    </p>
                    <div className="text-sm font-medium text-foreground leading-relaxed">
                      {step.title.split('\n').map((line, i) => (
                        <p key={i} className={i > 0 ? "text-muted mt-1 ml-4 list-decimal" : ""}>
                          {line}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Footer Action */}
          <div className="p-6 pt-2">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onDeploy}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm text-background overflow-hidden relative"
              style={{ background: "linear-gradient(135deg, #14f195, #00d4aa, #9945ff)" }}
            >
              <Rocket size={18} className="relative z-10" />
              <span className="relative z-10">{t("deploy.guide.button")}</span>
              <ExternalLink size={14} className="relative z-10 opacity-80" />
            </motion.button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
