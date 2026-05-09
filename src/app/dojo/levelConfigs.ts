// ── Level configurations for Genesis Dojo ───────────────────────────────
// Each level defines ghost nodes, expected edges, sidebar palette, and
// Sensei dialogue per step.

import type { TutorialLevel } from "./useTutorialStore";

// ── Types ───────────────────────────────────────────────────────────────
export interface GhostNodeConfig {
  id: string;
  /** The step at which this ghost appears (0-indexed) */
  step: number;
  /** Expected React Flow node type */
  expectedType: string;
  /** Expected data properties for validation */
  expectedData: Record<string, unknown>;
  /** Display label on the ghost placeholder */
  label: string;
  /** Position on canvas */
  position: { x: number; y: number };
  /** Category color for the ghost outline */
  accentColor: string;
}

export interface GhostEdgeConfig {
  id: string;
  /** The step at which this connection should be made */
  step: number;
  /** Expected source ghost node id */
  sourceGhostId: string;
  /** Expected target ghost node id */
  targetGhostId: string;
}

export interface SidebarItem {
  type: string;
  label: string;
  icon: string; // lucide icon name
  color: string;
  defaultData: Record<string, unknown>;
  /** Only available at this step (-1 = always available) */
  availableAtStep: number;
}

export interface StepDialogue {
  /** Step index (0-based) */
  step: number;
  /** Sensei instruction for the step */
  instruction: string;
  /** On success */
  successMessage: string;
  /** On error */
  errorMessage: string;
}

export interface LevelConfig {
  level: TutorialLevel;
  title: string;
  subtitle: string;
  description: string;
  totalSteps: number;
  ghostNodes: GhostNodeConfig[];
  ghostEdges: GhostEdgeConfig[];
  sidebarItems: SidebarItem[];
  dialogue: StepDialogue[];
}

// ── Level 0: Prologue ───────────────────────────────────────────────────
const level0: LevelConfig = {
  level: 0,
  title: "Prologue",
  subtitle: "The UI Basics",
  description: "Learn how to use the Genesis Dojo interface.",
  totalSteps: 6,
  ghostNodes: [
    {
      id: "ghost-l0-fn",
      step: 0,
      expectedType: "functionNode",
      expectedData: {},
      label: "Drop Instruction here",
      position: { x: 300, y: 150 },
      accentColor: "#f0f056",
    },
  ],
  ghostEdges: [],
  sidebarItems: [
    {
      type: "functionNode",
      label: "Instruction",
      icon: "Code2",
      color: "#f0f056",
      defaultData: {
        label: "fn initialize",
        functionName: "initialize",
        body: 'msg!("Ready!");\nOk(())',
      },
      availableAtStep: 0,
    },
  ],
  dialogue: [
    { step: 0, instruction: "dojo.level0.step0.inst", successMessage: "dojo.level0.step0.success", errorMessage: "dojo.level0.step0.err" },
    { step: 1, instruction: "dojo.level0.step1.inst", successMessage: "dojo.level0.step1.success", errorMessage: "dojo.level0.step1.err" },
    { step: 2, instruction: "dojo.level0.step2.inst", successMessage: "dojo.level0.step2.success", errorMessage: "dojo.level0.step2.err" },
    { step: 3, instruction: "dojo.level0.step3.inst", successMessage: "dojo.level0.step3.success", errorMessage: "dojo.level0.step3.err" },
    { step: 4, instruction: "dojo.level0.step4.inst", successMessage: "dojo.level0.step4.success", errorMessage: "dojo.level0.step4.err" },
    { step: 5, instruction: "dojo.level0.step5.inst", successMessage: "dojo.level0.step5.success", errorMessage: "dojo.level0.step5.err" },
  ],
};

// ── Level 1: The Vault - Accounts ────────────────────────────────────────
const level1: LevelConfig = {
  level: 1,
  title: "The Vault",
  subtitle: "Accounts",
  description: "Learn how to create a data account on Solana.",
  totalSteps: 4,
  ghostNodes: [
    { id: "ghost-l1-fn", step: 0, expectedType: "functionNode", expectedData: {}, label: "Drop Instruction here", position: { x: 300, y: 350 }, accentColor: "#f0f056" },
    { id: "ghost-l1-state", step: 1, expectedType: "structNode", expectedData: { nodeCategory: "state" }, label: "Drop State Account here", position: { x: 300, y: 150 }, accentColor: "#14f195" },
  ],
  ghostEdges: [
    { id: "ghost-edge-l1", step: 2, sourceGhostId: "ghost-l1-state", targetGhostId: "ghost-l1-fn" },
  ],
  sidebarItems: [
    { type: "functionNode", label: "Instruction", icon: "Code2", color: "#f0f056", defaultData: { label: "fn process", functionName: "process", body: "Ok(())" }, availableAtStep: 0 },
    { type: "structNode", label: "State Account", icon: "Database", color: "#14f195", defaultData: { label: "VaultAccount", structName: "VaultAccount", fields: [{ name: "balance", type: "u64" }], nodeCategory: "state" }, availableAtStep: 1 },
  ],
  dialogue: [
    { step: 0, instruction: "dojo.level1.step0.inst", successMessage: "dojo.level1.step0.success", errorMessage: "dojo.level1.step0.err" },
    { step: 1, instruction: "dojo.level1.step1.inst", successMessage: "dojo.level1.step1.success", errorMessage: "dojo.level1.step1.err" },
    { step: 2, instruction: "dojo.level1.step2.inst", successMessage: "dojo.level1.step2.success", errorMessage: "dojo.level1.step2.err" },
    { step: 3, instruction: "dojo.level1.step3.inst", successMessage: "dojo.level1.step3.success", errorMessage: "dojo.level1.step3.err" },
  ],
};

// ── Level 2: The Key - Signers ──────────────────────────────────────────
const level2: LevelConfig = {
  level: 2,
  title: "The Key",
  subtitle: "Signers",
  description: "Teach authorization. Turn an account into a signer.",
  totalSteps: 4,
  ghostNodes: [
    { id: "ghost-l2-fn", step: 0, expectedType: "functionNode", expectedData: {}, label: "Drop Instruction here", position: { x: 300, y: 350 }, accentColor: "#f0f056" },
    { id: "ghost-l2-state", step: 1, expectedType: "structNode", expectedData: { nodeCategory: "state" }, label: "Drop State Account here", position: { x: 300, y: 150 }, accentColor: "#14f195" },
  ],
  ghostEdges: [
    { id: "ghost-edge-l2", step: 2, sourceGhostId: "ghost-l2-state", targetGhostId: "ghost-l2-fn" },
  ],
  sidebarItems: [
    { type: "functionNode", label: "Instruction", icon: "Code2", color: "#f0f056", defaultData: { label: "fn authenticate", functionName: "authenticate", body: 'msg!("Authenticated!");\nOk(())' }, availableAtStep: 0 },
    { type: "structNode", label: "State Account", icon: "Database", color: "#14f195", defaultData: { label: "UserAccount", structName: "UserAccount", fields: [], nodeCategory: "state" }, availableAtStep: 1 },
  ],
  dialogue: [
    { step: 0, instruction: "dojo.level2.step0.inst", successMessage: "dojo.level2.step0.success", errorMessage: "dojo.level2.step0.err" },
    { step: 1, instruction: "dojo.level2.step1.inst", successMessage: "dojo.level2.step1.success", errorMessage: "dojo.level2.step1.err" },
    { step: 2, instruction: "dojo.level2.step2.inst", successMessage: "dojo.level2.step2.success", errorMessage: "dojo.level2.step2.err" },
    { step: 3, instruction: "dojo.level2.step3.inst", successMessage: "dojo.level2.step3.success", errorMessage: "dojo.level2.step3.err" },
  ],
};

// ── Level 3: The Ghost - PDA ────────────────────────────────────────────
const level3: LevelConfig = {
  level: 3,
  title: "The Ghost",
  subtitle: "Program Derived Addresses",
  description: "Find an account without a private key using a seed.",
  totalSteps: 3,
  ghostNodes: [
    { id: "ghost-l3-state", step: 0, expectedType: "structNode", expectedData: { nodeCategory: "state" }, label: "Drop State Account here", position: { x: 300, y: 250 }, accentColor: "#14f195" },
    { id: "ghost-l3-seed", step: 1, expectedType: "pdaNode", expectedData: {}, label: "Drop PDA Seed here", position: { x: 300, y: 100 }, accentColor: "#38bdf8" },
  ],
  ghostEdges: [
    { id: "ghost-edge-l3", step: 2, sourceGhostId: "ghost-l3-seed", targetGhostId: "ghost-l3-state" },
  ],
  sidebarItems: [
    { type: "structNode", label: "State Account", icon: "Database", color: "#14f195", defaultData: { label: "GhostAccount", structName: "GhostAccount", fields: [], nodeCategory: "state" }, availableAtStep: 0 },
    { type: "pdaNode", label: "PDA Seed", icon: "Ghost", color: "#38bdf8", defaultData: { label: "Seed", pdaSeeds: '"ghost_seed"' }, availableAtStep: 1 },
  ],
  dialogue: [
    { step: 0, instruction: "dojo.level3.step0.inst", successMessage: "dojo.level3.step0.success", errorMessage: "dojo.level3.step0.err" },
    { step: 1, instruction: "dojo.level3.step1.inst", successMessage: "dojo.level3.step1.success", errorMessage: "dojo.level3.step1.err" },
    { step: 2, instruction: "dojo.level3.step2.inst", successMessage: "dojo.level3.step2.success", errorMessage: "dojo.level3.step2.err" },
  ],
};

// ── Level 4: The Handshake - CPI ────────────────────────────────────────
const level4: LevelConfig = {
  level: 4,
  title: "The Handshake",
  subtitle: "Cross-Program Invocation",
  description: "Call another official Solana program.",
  totalSteps: 3,
  ghostNodes: [
    { id: "ghost-l4-fn", step: 0, expectedType: "functionNode", expectedData: {}, label: "Drop Instruction here", position: { x: 300, y: 150 }, accentColor: "#f0f056" },
    { id: "ghost-l4-cpi", step: 1, expectedType: "cpiNode", expectedData: {}, label: "Drop CPI Node here", position: { x: 300, y: 350 }, accentColor: "#f43f5e" },
  ],
  ghostEdges: [
    { id: "ghost-edge-l4", step: 2, sourceGhostId: "ghost-l4-fn", targetGhostId: "ghost-l4-cpi" },
  ],
  sidebarItems: [
    { type: "functionNode", label: "Instruction", icon: "Code2", color: "#f0f056", defaultData: { label: "fn transfer_tokens", functionName: "transfer_tokens", body: "Ok(())" }, availableAtStep: 0 },
    { type: "cpiNode", label: "Token Transfer", icon: "Send", color: "#f43f5e", defaultData: { label: "Token Program", programName: "token_program", action: "transfer" }, availableAtStep: 1 },
  ],
  dialogue: [
    { step: 0, instruction: "dojo.level4.step0.inst", successMessage: "dojo.level4.step0.success", errorMessage: "dojo.level4.step0.err" },
    { step: 1, instruction: "dojo.level4.step1.inst", successMessage: "dojo.level4.step1.success", errorMessage: "dojo.level4.step1.err" },
    { step: 2, instruction: "dojo.level4.step2.inst", successMessage: "dojo.level4.step2.success", errorMessage: "dojo.level4.step2.err" },
  ],
};

// ── Export ───────────────────────────────────────────────────────────────
export const LEVEL_CONFIGS: Record<TutorialLevel, LevelConfig> = {
  0: level0,
  1: level1,
  2: level2,
  3: level3,
  4: level4,
};

export function getLevelConfig(level: TutorialLevel): LevelConfig {
  return LEVEL_CONFIGS[level];
}

