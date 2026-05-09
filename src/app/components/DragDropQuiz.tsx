"use client";

import { useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy, RotateCcw, Lightbulb, CheckCircle2, XCircle } from "lucide-react";
import confetti from "canvas-confetti";
import { useApp } from "../context/AppContext";
import type { Language } from "../context/AppContext";
import TTSButton from "./TTSButton";

interface QuizQuestion {
  id: string;
  codeBefore: string;
  codeAfter: string;
  comment: string;
  correctAnswer: string;
  options: { id: string; label: string }[];
  successExplanation: Record<Language, string>;
  hintText: string;
}

const quizzes: QuizQuestion[] = [
  {
    id: "variables",
    codeBefore: "// Declare an immutable variable\n",
    codeAfter: " counter: u64 = 0;",
    comment: "// Just like declaring a variable in your language!",
    correctAnswer: "let",
    options: [{ id: "let", label: "let" }, { id: "var", label: "var" }, { id: "const", label: "const" }],
    successExplanation: {
      javascript: "In Rust, `let` declares variables — just like in JavaScript! But in Rust, variables are immutable by default.",
      python: "Rust uses `let` to declare variables. Unlike Python where you just write `x = 5`, Rust requires explicit declaration.",
      csharp: "Like C#'s `var`, Rust uses `let` for variable declaration. But Rust defaults to immutable (like `readonly`).",
      none: "The keyword `let` tells Rust: 'I want to create a new named box to store a value.'",
    },
    hintText: "Think about how you declare variables. In Rust, we need a keyword that creates a new binding.",
  },
  {
    id: "structs",
    codeBefore: "// Define a data structure\npub ",
    codeAfter: " Flipper {\n    value: bool,\n}",
    comment: "// The data our Solana program stores on-chain",
    correctAnswer: "struct",
    options: [{ id: "struct", label: "struct" }, { id: "mod", label: "mod" }, { id: "fn", label: "fn" }],
    successExplanation: {
      javascript: "A `struct` in Rust is like a JavaScript object shape — but defined at compile time.",
      python: "Think of a Rust `struct` like a Python `@dataclass`. In Solana, structs hold your on-chain state!",
      csharp: "A Rust `struct` is very similar to a C# `record` — custom data type with named fields.",
      none: "A `struct` is like a recipe card — it defines what information a thing should contain.",
    },
    hintText: "We're defining a custom data type with named fields. What Rust keyword creates structured data?",
  },
  {
    id: "ownership",
    codeBefore: "fn calculate_length(s: ",
    codeAfter: "String) -> usize {\n    s.len()\n}",
    comment: "// Borrow the string without taking ownership",
    correctAnswer: "&",
    options: [{ id: "&", label: "&" }, { id: "*", label: "*" }, { id: "mut", label: "mut" }],
    successExplanation: {
      javascript: "The `&` symbol creates a reference — like reading from a shared variable without cloning it. Zero-cost abstraction!",
      python: "In Rust, `&` borrows a value — the function can use it without taking ownership. Like passing by reference!",
      csharp: "The `&` is like C#'s `ref` keyword — the function reads the data without copying or taking ownership.",
      none: "The `&` means 'borrow' — you lend the value to the function, and it gives it back when done!",
    },
    hintText: "We want to use the string without taking ownership. What symbol lets us borrow a value?",
  },
  {
    id: "traits",
    codeBefore: "// Define shared behavior\npub ",
    codeAfter: " Stakeable {\n    fn stake(&mut self, amount: u64);\n    fn rewards(&self) -> u64;\n}",
    comment: "// Like an interface — defines what types must do",
    correctAnswer: "trait",
    options: [{ id: "trait", label: "trait" }, { id: "impl", label: "impl" }, { id: "type", label: "type" }],
    successExplanation: {
      javascript: "A `trait` defines shared behavior — like a TypeScript interface that types must implement!",
      python: "Traits are like Python's Abstract Base Classes — they define methods a type must implement.",
      csharp: "Rust `trait` is almost exactly like C# `interface` — defining method signatures types must implement.",
      none: "A `trait` is like a job description — it says what abilities a type must have.",
    },
    hintText: "We need a keyword that defines shared behavior for different types. Think: interfaces or contracts.",
  },
  {
    id: "programs",
    codeBefore: "use anchor_lang::prelude::*;\n\n",
    codeAfter: "\npub mod my_program {\n    use super::*;\n\n    pub fn initialize(ctx: Context<Init>) -> Result<()> {\n        Ok(())\n    }\n}",
    comment: "// This is the entry point for our Solana app",
    correctAnswer: "#[program]",
    options: [{ id: "#[program]", label: "#[program]" }, { id: "#[account]", label: "#[account]" }, { id: "#[derive]", label: "#[derive]" }],
    successExplanation: {
      javascript: "The `#[program]` macro tells Anchor: 'These are my endpoints.' Each function becomes an RPC call!",
      python: "Think of `#[program]` like Flask's `@app.route()`. It marks your module as the Solana program entry point.",
      csharp: "The `#[program]` attribute is like `[ApiController]` — marks a module as the Solana program entry point.",
      none: "The `#[program]` tag tells Solana: 'This is the brain of my app!' Everything inside defines your app's actions.",
    },
    hintText: "We need an Anchor framework macro that marks a module as a Solana program entry point.",
  },
];

interface DragDropQuizProps {
  moduleIndex: number;
  onComplete: () => void;
}

export default function DragDropQuiz({ moduleIndex, onComplete }: DragDropQuizProps) {
  const { selectedLanguage, t } = useApp();
  const lang = selectedLanguage || "none";
  const quiz = quizzes[moduleIndex];

  const [selected, setSelected] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "correct" | "wrong">("idle");
  const [shake, setShake] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [dragOverActive, setDragOverActive] = useState(false);
  const dropZoneRef = useRef<HTMLSpanElement>(null);

  const fireConfetti = useCallback(() => {
    const defaults = { startVelocity: 30, spread: 360, ticks: 80, zIndex: 100 };
    confetti({ ...defaults, particleCount: 60, origin: { x: 0.3, y: 0.6 } });
    confetti({ ...defaults, particleCount: 60, origin: { x: 0.7, y: 0.6 } });
  }, []);

  const checkAnswer = (answerId: string) => {
    if (status === "correct") return;
    setSelected(answerId);
    setAttempts((a) => a + 1);
    if (answerId === quiz.correctAnswer) {
      setStatus("correct");
      fireConfetti();
      setTimeout(() => onComplete(), 1500);
    } else {
      setStatus("wrong");
      setShake(true);
      setTimeout(() => setShake(false), 500);
      setTimeout(() => { setStatus("idle"); setSelected(null); }, 2000);
    }
  };

  const handleDragStart = (e: React.DragEvent, id: string) => {
    e.dataTransfer.setData("text/plain", id);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDragOverActive(true);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOverActive(false);
    const id = e.dataTransfer.getData("text/plain");
    if (id) checkAnswer(id);
  };

  const reset = () => { setSelected(null); setStatus("idle"); setAttempts(0); };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="mt-8">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-lg bg-neon-yellow/10 flex items-center justify-center">
          <span className="text-neon-yellow text-sm font-bold">?</span>
        </div>
        <h4 className="text-lg font-bold">{t("quiz.title")}</h4>
      </div>

      <div className={`glass-card rounded-2xl p-6 transition-all duration-500 ${status === "correct" ? "border-2 !border-neon-green glow-green-strong" : status === "wrong" ? "border-2 !border-red-500" : ""} ${shake ? "shake" : ""}`}>
        {/* Code block with drop zone */}
        <div className="code-block rounded-xl p-5 mb-5 relative overflow-hidden">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-3 h-3 rounded-full bg-red-500/80" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
            <div className="w-3 h-3 rounded-full bg-green-500/80" />
            <span className="ml-2 text-xs text-muted-dim font-mono">lib.rs</span>
          </div>
          <pre className="text-sm leading-relaxed font-mono">
            <code>
              <span className="text-muted-dim">{quiz.comment}</span>
              {"\n"}
              <span className="text-foreground/80">{quiz.codeBefore}</span>
              <span
                ref={dropZoneRef}
                onDragOver={handleDragOver}
                onDragLeave={() => setDragOverActive(false)}
                onDrop={handleDrop}
                className={`drop-zone ${dragOverActive ? "drag-hover" : ""} ${status === "correct" ? "success" : status === "wrong" ? "error" : selected ? "filled" : ""}`}
              >
                {selected ? (
                  <span className={`px-2 font-bold ${status === "correct" ? "text-neon-green" : status === "wrong" ? "text-red-400" : "text-neon-yellow"}`}>{selected}</span>
                ) : (
                  <span className="text-muted-dim text-xs tracking-wider">{t("quiz.dropHere")}</span>
                )}
              </span>
              <span className="text-foreground/80">{quiz.codeAfter}</span>
            </code>
          </pre>
        </div>

        {/* Bullet-shaped draggable options */}
        <div className="mb-5">
          <p className="text-sm text-muted mb-3 font-medium">{t("quiz.instruction")}</p>
          <div className="flex flex-wrap gap-3">
            {quiz.options.map((opt) => (
              <motion.button
                key={opt.id}
                id={`quiz-option-${opt.id}`}
                draggable={status !== "correct"}
                onDragStart={(e) => handleDragStart(e as unknown as React.DragEvent, opt.id)}
                whileHover={{ scale: status === "correct" ? 1 : 1.05 }}
                whileTap={{ scale: status === "correct" ? 1 : 0.95 }}
                onClick={() => checkAnswer(opt.id)}
                disabled={status === "correct"}
                className={`quiz-option font-mono font-semibold text-sm transition-all duration-200 border-2 flex items-center gap-2 select-none
                  ${status === "correct" && opt.id === quiz.correctAnswer
                    ? "border-neon-green bg-neon-green/20 text-neon-green"
                    : status === "wrong" && selected === opt.id
                    ? "border-red-500 bg-red-500/10 text-red-400"
                    : "border-neon-green/30 bg-neon-green/5 text-neon-green hover:bg-neon-green/10 hover:border-neon-green/60 cursor-grab active:cursor-grabbing"
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                style={{
                  borderRadius: "20px 6px 6px 20px",
                  padding: "10px 18px 10px 22px",
                }}
              >
                <svg width="8" height="14" viewBox="0 0 8 14" className="opacity-40 shrink-0">
                  <path d="M4 0L8 7L4 14L0 7Z" fill="currentColor" />
                </svg>
                {opt.label}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Feedback */}
        <AnimatePresence mode="wait">
          {status === "correct" && (
            <motion.div key="correct" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex items-start gap-3 p-4 rounded-xl bg-neon-green/10 border border-neon-green/30">
              <Trophy size={24} className="text-neon-green shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-bold text-neon-green flex items-center gap-2"><CheckCircle2 size={16} /> {t("quiz.correct")}</p>
                <p className="text-sm text-foreground/80 mt-1 leading-relaxed">{quiz.successExplanation[lang]}</p>
                <div className="mt-2"><TTSButton size={14} text={quiz.successExplanation[lang]} /></div>
              </div>
            </motion.div>
          )}
          {status === "wrong" && (
            <motion.div key="wrong" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex items-start gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/30">
              <XCircle size={24} className="text-red-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-red-400">{t("quiz.notQuite")}</p>
                <p className="text-sm text-foreground/80 mt-1"><Lightbulb size={14} className="inline mr-1 text-neon-yellow" />{quiz.hintText}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {(status === "correct" || attempts > 2) && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4 flex justify-center">
            <button onClick={reset} className="px-4 py-2 rounded-lg bg-card-bg border border-card-border text-sm text-muted hover:text-foreground transition-colors flex items-center gap-2">
              <RotateCcw size={14} /> {t("quiz.tryAgain")}
            </button>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
