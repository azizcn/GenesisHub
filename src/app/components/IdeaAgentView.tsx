"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, Wand2, Loader2, Copy, Check, ArrowLeft, Rocket, RefreshCw, Sparkles, Terminal, ChevronDown, ChevronUp } from "lucide-react";
import { useApp } from "../context/AppContext";
import type { Language } from "../context/AppContext";
import TTSButton from "./TTSButton";

interface ProjectIdea {
  name: string;
  whatItDoes: string;
  steps: string[];
  stack: string[];
  difficulty: string;
}

const projectIdeas: Record<Language, ProjectIdea[]> = {
  javascript: [
    { name: "SolPay Tip Widget", whatItDoes: "A React-based tipping widget that any creator can embed on their website. Visitors connect their Solana wallet and send SOL tips with a fun animation. All tips are tracked on-chain with a public leaderboard.", steps: ["Set up a Next.js project with Solana Wallet Adapter", "Build the tip widget component with amount selector", "Integrate Solana Web3.js for transfer transactions", "Add confetti animation on successful tips", "Create a public leaderboard from on-chain data"], stack: ["React", "Next.js", "Solana Web3.js", "Wallet Adapter", "Tailwind CSS"], difficulty: "Intermediate" },
    { name: "NFT Mood Board", whatItDoes: "A visual workspace where users drag-and-drop their Solana NFTs into themed mood boards. Share your aesthetic with a unique link. Think Pinterest meets NFTs.", steps: ["Build drag-and-drop board interface", "Connect to Solana and fetch NFTs via Metaplex DAS API", "Display NFT metadata in draggable cards", "Implement board saving/sharing", "Add export as shareable image"], stack: ["React", "Metaplex API", "react-dnd", "HTML Canvas", "Tailwind CSS"], difficulty: "Intermediate" },
    { name: "Solana Gas Tracker", whatItDoes: "A real-time dashboard showing Solana network health, priority fees, and TPS. Helps developers decide the best time to deploy.", steps: ["Set up API routes to poll Solana RPC", "Build real-time TPS and fee charts", "Add priority fee estimation", "Create notification system for congestion", "Design dashboard with dark theme"], stack: ["Next.js", "Solana RPC", "Recharts", "WebSocket", "Tailwind CSS"], difficulty: "Intermediate" },
  ],
  python: [
    { name: "Solana Whale Watcher", whatItDoes: "A Python-powered analytics tool that monitors large Solana transactions in real-time. Sends alerts when whales move significant amounts.", steps: ["Set up FastAPI backend with WebSocket to Solana RPC", "Create transaction parser for large transfers", "Build React frontend with real-time charts", "Implement historical data storage with SQLite", "Add configurable alert thresholds"], stack: ["Python", "FastAPI", "Solana RPC", "Pandas", "React Dashboard"], difficulty: "Intermediate" },
    { name: "Smart Contract Auditor Lite", whatItDoes: "An AI-powered tool that analyzes Anchor/Rust code for common vulnerabilities. Upload code, get a security report.", steps: ["Build FastAPI backend with file upload", "Create rule-based analyzer for common vulnerabilities", "Integrate LLM API for explanations", "Design report UI with severity badges", "Add fix suggestion feature"], stack: ["Python", "FastAPI", "Gemini API", "React", "Rust Parser"], difficulty: "Advanced" },
  ],
  csharp: [
    { name: "Unity Solana Inventory", whatItDoes: "A Unity game inventory where in-game items are Solana NFTs. Players can view, trade, and equip items they truly own.", steps: ["Create Unity project with Solana.Unity SDK", "Design inventory UI with grid layout", "Implement wallet connection", "Build item fetching with Metaplex", "Add equip/unequip mechanics"], stack: ["C#", "Unity", "Solana.Unity SDK", "Metaplex", "Anchor"], difficulty: "Advanced" },
    { name: "Blazor DeFi Dashboard", whatItDoes: "A Blazor WebAssembly app connected to Solana displaying DeFi positions, token balances, and yield opportunities.", steps: ["Set up Blazor WASM with Solana.NET", "Build wallet connection component", "Create dashboard widgets for balances", "Integrate Jupiter API for price feeds", "Add portfolio tracking"], stack: ["C#", "Blazor WASM", "Solana.NET", "Jupiter API", "SignalR"], difficulty: "Intermediate" },
  ],
  none: [
    { name: "Web3 Learning Arcade", whatItDoes: "A gamified website where beginners learn blockchain through quizzes, visual metaphors, and mini-games. No coding required.", steps: ["Write 10 bite-sized blockchain lessons", "Design quiz questions in Typeform", "Build learning path website", "Add progress tracking with badges", "Create social media assets"], stack: ["Webflow/Carrd", "Typeform", "Canva", "Notion"], difficulty: "Beginner" },
    { name: "DAO Onboarding Experience", whatItDoes: "An interactive guide walking newcomers through joining their first Solana DAO. Jargon-free.", steps: ["Map the DAO onboarding journey", "Create step-by-step wallet guides", "Design FAQ section", "Build as interactive Notion site", "Test with real beginners"], stack: ["Notion", "Loom", "Canva", "Figma"], difficulty: "Beginner" },
  ],
};

function generateSystemPrompt(idea: ProjectIdea, langLabel: string): string {
  return `# System Prompt: ${idea.name} — Full-Stack AI Developer

You are an expert Solana/Web3 full-stack developer and architect. Your role is to act as the primary backend and smart contract developer for the project "${idea.name}".

## Project Overview
${idea.whatItDoes}

## Your Expertise
- Rust programming (ownership, borrowing, lifetimes, traits, generics)
- Solana program development with the Anchor framework
- ${idea.stack.join(", ")}
- The user's primary language background is ${langLabel}

## Your Responsibilities
1. Write production-ready Anchor smart contracts (Rust) for all on-chain logic
2. Design the program's account structure and PDA derivations
3. Implement all instruction handlers with proper validation and error handling
4. Create comprehensive TypeScript/Python client SDK for frontend integration
5. Write unit and integration tests using anchor-bankrun or solana-test-validator
6. Provide deployment scripts for devnet and mainnet

## Execution Plan
${idea.steps.map((s, i) => `${i + 1}. ${s}`).join("\n")}

## Tech Stack
${idea.stack.map((t) => `- ${t}`).join("\n")}

## Code Quality Standards
- All Solana programs must include proper access control (signer checks, owner checks)
- Use PDAs for deterministic account addresses
- Implement proper error handling with custom error enums
- Follow Anchor best practices for account validation
- Include inline documentation for all public functions
- Write idiomatic Rust — leverage the type system for safety

## Communication Style
- Explain complex concepts using analogies from ${langLabel}
- Break down implementations into small, testable increments
- Proactively identify security concerns and edge cases
- Provide complete, runnable code — never partial snippets
- Use code comments to explain "why", not just "what"

## First Task
Start by scaffolding the Anchor project structure and implementing the core program accounts and the first instruction handler. Provide the complete \`lib.rs\` and \`Anchor.toml\` files.`;
}

export default function IdeaAgentView() {
  const { selectedLanguage, languageLabel, setView, completedModules, t, locale } = useApp();
  const lang = selectedLanguage || "none";

  const [loading, setLoading] = useState(false);
  const [idea, setIdea] = useState<ProjectIdea | null>(null);
  const [ideaIndex, setIdeaIndex] = useState(0);
  const [copied, setCopied] = useState(false);
  const [promptExpanded, setPromptExpanded] = useState(false);
  const [promptCopied, setPromptCopied] = useState(false);

  const modulesText = completedModules.length > 0
    ? t("copilot.welcomeModules", { count: String(completedModules.length), plural: completedModules.length > 1 ? "s" : "" })
    : "";

  const [chatMessages, setChatMessages] = useState<{ role: "bot" | "user"; text: string }[]>([
    { role: "bot", text: t("copilot.welcome", { lang: languageLabel, modules: modulesText }) },
  ]);

  const generate = () => {
    setChatMessages((prev) => [...prev, { role: "user", text: t("copilot.userGenerate") }]);
    setLoading(true);
    setTimeout(() => {
      const ideas = projectIdeas[lang];
      const idx = ideaIndex % ideas.length;
      setIdea(ideas[idx]);
      setIdeaIndex((prev) => prev + 1);
      setChatMessages((prev) => [...prev, { role: "bot", text: t("copilot.botResult", { lang: languageLabel }) }]);
      setLoading(false);
      setPromptExpanded(false);
    }, 2500);
  };

  const regenerate = () => {
    setIdea(null);
    setPromptExpanded(false);
    setChatMessages((prev) => [...prev, { role: "user", text: t("copilot.userAnother") }]);
    setLoading(true);
    setTimeout(() => {
      const ideas = projectIdeas[lang];
      const idx = ideaIndex % ideas.length;
      setIdea(ideas[idx]);
      setIdeaIndex((prev) => prev + 1);
      setChatMessages((prev) => [...prev, { role: "bot", text: t("copilot.botAnother") }]);
      setLoading(false);
    }, 2000);
  };

  const copyIdea = () => {
    if (!idea) return;
    const text = `🚀 ${idea.name}\n\n${idea.whatItDoes}\n\nStack: ${idea.stack.join(", ")}\nDifficulty: ${idea.difficulty}\n\n${idea.steps.map((s, i) => `${i + 1}. ${s}`).join("\n")}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const copyPrompt = () => {
    if (!idea) return;
    navigator.clipboard.writeText(generateSystemPrompt(idea, languageLabel));
    setPromptCopied(true);
    setTimeout(() => setPromptCopied(false), 2000);
  };

  return (
    <section className="min-h-screen relative">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-neon-purple/5 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[400px] bg-neon-green/5 rounded-full blur-[150px] pointer-events-none" />

      <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <button onClick={() => setView("hub")} className="p-2 rounded-lg bg-card-bg border border-card-border text-muted hover:text-foreground transition-colors"><ArrowLeft size={16} /></button>
            <div>
              <h1 className="text-xl font-bold flex items-center gap-2">
                <span className="gradient-text">{t("copilot.title")}</span>
                <Sparkles size={18} className="text-neon-yellow" />
              </h1>
              <p className="text-xs text-muted-dim">{t("copilot.subtitle")} {languageLabel}</p>
            </div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card rounded-2xl overflow-hidden">
          {/* Terminal header */}
          <div className="flex items-center gap-3 px-5 py-3 bg-surface border-b border-card-border">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500/80" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
              <div className="w-3 h-3 rounded-full bg-green-500/80" />
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-dim font-mono">
              <Terminal size={12} />
              {t("copilot.terminal")}
            </div>
          </div>

          {/* Chat area */}
          <div className="p-5 space-y-4 max-h-[60vh] overflow-y-auto">
            {chatMessages.map((msg, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i === chatMessages.length - 1 ? 0.1 : 0 }}>
                {msg.role === "bot" ? (
                  <div className="flex gap-3">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-neon-green to-neon-purple flex items-center justify-center shrink-0 shadow-lg shadow-neon-green/10"><Bot size={18} className="text-background" /></div>
                    <div className="glass-card rounded-2xl rounded-tl-sm px-4 py-3 max-w-md">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-semibold text-neon-green">Copilot</span>
                        <TTSButton size={12} />
                      </div>
                      <p className="text-sm text-foreground/80 whitespace-pre-line leading-relaxed">{msg.text}</p>
                    </div>
                  </div>
                ) : (
                  <div className="flex justify-end">
                    <div className="px-4 py-3 rounded-2xl rounded-br-sm bg-neon-green/10 border border-neon-green/20 max-w-md">
                      <p className="text-sm text-neon-green">{msg.text}</p>
                    </div>
                  </div>
                )}
              </motion.div>
            ))}

            <AnimatePresence>
              {loading && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex gap-3">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-neon-green to-neon-purple flex items-center justify-center shrink-0"><Bot size={18} className="text-background" /></div>
                  <div className="glass-card rounded-2xl rounded-tl-sm px-4 py-3">
                    <div className="flex items-center gap-2 text-sm text-muted">
                      <Loader2 size={14} className="animate-spin" />
                      <span className="typing-cursor">{t("copilot.botAnalyzing")}</span>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Project Idea Card */}
            <AnimatePresence>
              {idea && !loading && (
                <motion.div initial={{ opacity: 0, scale: 0.95, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ type: "spring", damping: 20 }} className="ml-12">
                  <div className="rounded-2xl border-2 border-neon-green/30 bg-neon-green/5 p-6 relative overflow-hidden">
                    <div className="absolute top-0 right-0 px-3 py-1 bg-neon-green/20 text-neon-green text-xs font-bold rounded-bl-xl">{idea.difficulty}</div>

                    <div className="flex items-center gap-2 mb-3">
                      <Rocket size={20} className="text-neon-green" />
                      <h3 className="text-xl font-bold text-neon-green">{idea.name}</h3>
                    </div>

                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-xs font-semibold text-muted-dim uppercase tracking-wider">{t("copilot.whatItDoes")}</p>
                        <TTSButton size={12} />
                      </div>
                      <p className="text-sm text-foreground/80 leading-relaxed">{idea.whatItDoes}</p>
                    </div>

                    <div className="mb-4">
                      <p className="text-xs font-semibold text-muted-dim uppercase tracking-wider mb-2">{t("copilot.steps")}</p>
                      <div className="space-y-2">
                        {idea.steps.map((step, i) => (
                          <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 + i * 0.1 }} className="flex gap-3 items-start">
                            <div className="w-6 h-6 rounded-full bg-neon-purple/20 text-neon-purple flex items-center justify-center shrink-0 text-xs font-bold mt-0.5">{i + 1}</div>
                            <p className="text-sm text-foreground/80 leading-relaxed">{step}</p>
                          </motion.div>
                        ))}
                      </div>
                    </div>

                    <div className="mb-4">
                      <p className="text-xs font-semibold text-muted-dim uppercase tracking-wider mb-2">{t("copilot.stack")}</p>
                      <div className="flex flex-wrap gap-2">
                        {idea.stack.map((tech) => (
                          <span key={tech} className="px-3 py-1 rounded-full bg-neon-purple/10 border border-neon-purple/20 text-neon-purple text-xs font-medium">{tech}</span>
                        ))}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-wrap gap-2 pt-2">
                      <button onClick={copyIdea} className="px-4 py-2 rounded-lg bg-card-bg border border-card-border text-sm text-foreground/70 hover:text-neon-green transition-colors flex items-center gap-2">
                        {copied ? <Check size={14} /> : <Copy size={14} />}
                        {copied ? t("copilot.copied") : t("copilot.copyIdea")}
                      </button>
                      <button onClick={regenerate} className="px-4 py-2 rounded-lg bg-card-bg border border-card-border text-sm text-foreground/70 hover:text-neon-purple transition-colors flex items-center gap-2">
                        <RefreshCw size={14} /> {t("copilot.tryAnother")}
                      </button>
                    </div>

                    {/* Get Prompt Button */}
                    <div className="mt-4 pt-4 border-t border-card-border">
                      <motion.button
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        onClick={() => setPromptExpanded(!promptExpanded)}
                        className="w-full px-4 py-3 rounded-xl font-semibold bg-gradient-to-r from-neon-purple to-neon-green text-background flex items-center justify-center gap-2 text-sm hover:brightness-110 transition-all"
                      >
                        <Wand2 size={16} />
                        {locale === "tr" ? t("copilot.getPromptTr") : t("copilot.getPrompt")}
                        {promptExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      </motion.button>

                      <AnimatePresence>
                        {promptExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="overflow-hidden"
                          >
                            <div className="mt-3 relative">
                              <button
                                onClick={copyPrompt}
                                className="absolute top-3 right-3 px-3 py-1.5 rounded-lg bg-neon-purple/20 text-neon-purple text-xs font-medium hover:bg-neon-purple/30 transition-colors flex items-center gap-1.5 z-10"
                              >
                                {promptCopied ? <Check size={12} /> : <Copy size={12} />}
                                {promptCopied ? t("copilot.promptCopied") : t("copilot.copyPrompt")}
                              </button>
                              <div className="code-block rounded-xl p-5 pt-12 max-h-80 overflow-y-auto">
                                <pre className="text-xs leading-relaxed text-foreground/70 whitespace-pre-wrap font-mono">
                                  {generateSystemPrompt(idea, languageLabel)}
                                </pre>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Bottom action bar */}
          <div className="px-5 py-4 border-t border-card-border bg-surface">
            {!idea && !loading ? (
              <motion.button id="generate-idea-btn" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={generate} className="w-full px-6 py-3.5 rounded-xl font-semibold bg-gradient-to-r from-neon-green to-neon-purple text-background flex items-center justify-center gap-2 hover:brightness-110 transition-all shadow-lg shadow-neon-green/10">
                <Wand2 size={18} /> {t("copilot.generate")}
              </motion.button>
            ) : idea && !loading ? (
              <div className="flex gap-3">
                <button onClick={() => setView("hub")} className="flex-1 px-4 py-3 rounded-xl font-medium border border-card-border text-muted hover:text-foreground transition-colors text-sm">{t("copilot.backToLearning")}</button>
                <button onClick={regenerate} className="flex-1 px-4 py-3 rounded-xl font-semibold bg-gradient-to-r from-neon-green to-neon-purple text-background hover:brightness-110 transition-all text-sm flex items-center justify-center gap-2">
                  <Wand2 size={16} /> {t("copilot.generateAnother")}
                </button>
              </div>
            ) : null}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
