"use client";

import { create } from "zustand";

// ── Types ───────────────────────────────────────────────────────────────
export type TutorialLevel = 0 | 1 | 2 | 3 | 4;
export type NodePlacementState = "ghost" | "placed" | "error";
export type EdgeConnectionState = "pending" | "connected" | "error";
export type SenseiMood = "neutral" | "happy" | "angry" | "excited";

export interface TutorialState {
  // Level & step tracking
  currentLevel: TutorialLevel;
  currentStep: number;
  totalSteps: number;
  completedLevels: number[];
  levelCompleted: boolean;
  isSignerToggled: boolean;
  codeOverrideString: string;

  // Node / edge validation states
  nodeStates: Record<string, NodePlacementState>;
  edgeStates: Record<string, EdgeConnectionState>;

  // Sensei
  senseiMessage: string;
  senseiMood: SenseiMood;
  activeSenseiTopic: string | null;

  // Actions
  startLevel: (level: TutorialLevel, totalSteps: number) => void;
  advanceStep: () => void;
  setIsSignerToggled: (val: boolean) => void;
  setCodeOverrideString: (val: string) => void;
  placeNode: (ghostId: string) => void;
  triggerNodeError: (ghostId: string) => void;
  clearNodeError: (ghostId: string) => void;
  connectEdge: (edgeId: string) => void;
  triggerEdgeError: (edgeId: string) => void;
  setSenseiMessage: (text: string, mood: SenseiMood) => void;
  triggerSenseiHelp: (topicKey: string) => void;
  clearSenseiHelp: () => void;
  resetLevel: () => void;
  completeLevel: () => void;
}

// ── Placeholder for ElevenLabs TTS API ──────────────────────────────────
export function triggerSenseiVoice(text: string): void {
  // TODO: Hook up to ElevenLabs TTS API
  // For now, use Web Speech API as fallback
  if (typeof window !== "undefined" && window.speechSynthesis) {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.rate = 0.95;
    utterance.pitch = 1.05;
    window.speechSynthesis.speak(utterance);
  }
  console.log("[Solana Sensei TTS]:", text);
}

// ── Store ───────────────────────────────────────────────────────────────
export const useTutorialStore = create<TutorialState>((set, get) => ({
  currentLevel: 0,
  currentStep: 0,
  totalSteps: 0,
  completedLevels: [],
  levelCompleted: false,
  isSignerToggled: false,
  codeOverrideString: "",

  nodeStates: {},
  edgeStates: {},

  senseiMessage: "dojo.welcome",
  senseiMood: "neutral",
  activeSenseiTopic: null,

  startLevel: (level, totalSteps) =>
    set({
      currentLevel: level,
      currentStep: 0,
      totalSteps,
      levelCompleted: false,
      isSignerToggled: false,
      codeOverrideString: "",
      nodeStates: {},
      edgeStates: {},
      senseiMessage: level === 0 
        ? "dojo.level0.intro"
        : level === 1
        ? "dojo.level1.intro"
        : level === 2
          ? "dojo.level2.intro"
          : level === 3
            ? "dojo.level3.intro"
            : "dojo.level4.intro",
      senseiMood: "excited",
      activeSenseiTopic: null,
    }),

  advanceStep: () => {
    const { currentStep, totalSteps } = get();
    const nextStep = currentStep + 1;
    if (nextStep >= totalSteps) {
      set({
        currentStep: nextStep,
        levelCompleted: true,
        senseiMessage: "dojo.levelMastered",
        senseiMood: "excited",
      });
    } else {
      set({
        currentStep: nextStep,
        senseiMood: "happy",
      });
    }
  },

  setIsSignerToggled: (val) => set({ isSignerToggled: val }),
  setCodeOverrideString: (val) => set({ codeOverrideString: val }),

  placeNode: (ghostId) =>
    set((state) => ({
      nodeStates: { ...state.nodeStates, [ghostId]: "placed" },
    })),

  triggerNodeError: (ghostId) =>
    set((state) => ({
      nodeStates: { ...state.nodeStates, [ghostId]: "error" },
    })),

  clearNodeError: (ghostId) =>
    set((state) => ({
      nodeStates: { ...state.nodeStates, [ghostId]: "ghost" },
    })),

  connectEdge: (edgeId) =>
    set((state) => ({
      edgeStates: { ...state.edgeStates, [edgeId]: "connected" },
    })),

  triggerEdgeError: (edgeId) =>
    set((state) => ({
      edgeStates: { ...state.edgeStates, [edgeId]: "error" },
    })),

  setSenseiMessage: (text, mood) =>
    set({ senseiMessage: text, senseiMood: mood }),

  triggerSenseiHelp: (topicKey) => set({ activeSenseiTopic: topicKey }),
  clearSenseiHelp: () => set({ activeSenseiTopic: null }),

  resetLevel: () => {
    const { currentLevel, totalSteps } = get();
    set({
      currentStep: 0,
      levelCompleted: false,
      nodeStates: {},
      edgeStates: {},
      senseiMessage: "dojo.tryAgain",
      senseiMood: "neutral",
    });
    // Re-trigger startLevel to reset dialogue
    get().startLevel(currentLevel, totalSteps);
  },

  completeLevel: () =>
    set((state) => ({
      completedLevels: state.completedLevels.includes(state.currentLevel)
        ? state.completedLevels
        : [...state.completedLevels, state.currentLevel],
      levelCompleted: true,
      senseiMessage: "dojo.levelComplete",
      senseiMood: "excited",
    })),
}));
