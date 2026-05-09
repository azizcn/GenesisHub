import { create } from "zustand";

export interface BuilderState {
  codePreviewOpen: boolean;
  customCodeOverride: string | null;
  toggleCodePreview: (force?: boolean) => void;
  setCustomCodeOverride: (code: string | null) => void;
}

export const useBuilderStore = create<BuilderState>((set) => ({
  codePreviewOpen: true,
  customCodeOverride: null,
  toggleCodePreview: (force) =>
    set((state) => ({ codePreviewOpen: force !== undefined ? force : !state.codePreviewOpen })),
  setCustomCodeOverride: (code) =>
    set({ customCodeOverride: code }),
}));
