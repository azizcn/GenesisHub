"use client";

import { memo, useCallback } from "react";
import { Handle, Position, type NodeProps, type Node } from "@xyflow/react";
import { motion } from "framer-motion";
import { ArrowRightLeft, Coins, Trash2, Plus } from "lucide-react";
import type { ActionNodeData, StructField } from "../codegen";

type ActionNodeType = Node<ActionNodeData>;

function ActionNode({ id, data, selected }: NodeProps<ActionNodeType>) {
  const isTransfer = data.actionType === "transfer";
  const accentColor = isTransfer ? "#38bdf8" : "#fb923c";
  const accentMuted = isTransfer ? "rgba(56,189,248,0.15)" : "rgba(251,146,60,0.15)";
  const Icon = isTransfer ? ArrowRightLeft : Coins;
  const badgeLabel = isTransfer ? "TRANSFER" : "MINT";

  const updateData = useCallback(
    (updates: Partial<ActionNodeData>) => {
      window.dispatchEvent(
        new CustomEvent("builder:updateNode", { detail: { id, updates } })
      );
    },
    [id]
  );

  const handleParamChange = useCallback(
    (index: number, key: keyof StructField, value: string) => {
      const newParams = [...data.params];
      newParams[index] = { ...newParams[index], [key]: value };
      updateData({ params: newParams });
    },
    [data.params, updateData]
  );

  const addParam = useCallback(() => {
    updateData({ params: [...data.params, { name: "", type: "u64" }] });
  }, [data.params, updateData]);

  const removeParam = useCallback(
    (index: number) => {
      updateData({ params: data.params.filter((_, i) => i !== index) });
    },
    [data.params, updateData]
  );

  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="relative group"
      style={{ minWidth: 250 }}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="!border-0 !bg-transparent"
        style={{ top: -6 }}
      >
        <div className="bullet-handle-target" style={{ backgroundColor: accentColor }} />
      </Handle>

      <div
        className="rounded-xl overflow-hidden transition-shadow duration-200"
        style={{
          background: "var(--card-bg)",
          border: `1.5px solid ${selected ? accentColor : "var(--card-border)"}`,
          boxShadow: selected ? `0 0 20px ${accentMuted}` : "none",
        }}
      >
        {/* Header */}
        <div
          className="flex items-center gap-2 px-3 py-2"
          style={{
            background: `linear-gradient(135deg, ${accentMuted}, transparent)`,
            borderBottom: "1px solid var(--card-border)",
          }}
        >
          <div
            className="w-6 h-6 rounded-md flex items-center justify-center"
            style={{ backgroundColor: accentMuted }}
          >
            <Icon size={14} style={{ color: accentColor }} />
          </div>
          <div
            className="bullet-badge"
            style={{
              backgroundColor: accentMuted,
              color: accentColor,
              fontSize: 10,
              fontWeight: 700,
              padding: "2px 10px 2px 14px",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
            }}
          >
            {badgeLabel}
          </div>
        </div>

        {/* Params */}
        <div className="px-3 py-2 space-y-1.5">
          {data.params.map((param, i) => (
            <div key={i} className="flex items-center gap-1.5 group/field">
              <input
                value={param.name}
                onChange={(e) => handleParamChange(i, "name", e.target.value)}
                placeholder="param"
                className="flex-1 bg-surface rounded px-2 py-1 text-xs font-mono text-foreground
                           focus:outline-none focus:ring-1 placeholder:text-muted-dim"
              />
              <span className="text-muted-dim text-xs">:</span>
              <input
                value={param.type}
                onChange={(e) => handleParamChange(i, "type", e.target.value)}
                placeholder="u64"
                className="w-20 bg-surface rounded px-2 py-1 text-xs font-mono"
                style={{ color: accentColor }}
              />
              <button
                onClick={() => removeParam(i)}
                className="opacity-0 group-hover/field:opacity-100 text-muted-dim hover:text-red-400
                           transition-opacity p-0.5"
              >
                <Trash2 size={12} />
              </button>
            </div>
          ))}
          <button
            onClick={addParam}
            className="flex items-center gap-1 text-xs text-muted hover:text-foreground
                       transition-colors w-full justify-center py-1.5 rounded border border-dashed
                       border-card-border hover:border-current mt-1"
          >
            <Plus size={12} />
            Add Param
          </button>
        </div>
      </div>

      <Handle
        type="source"
        position={Position.Bottom}
        className="!border-0 !bg-transparent"
        style={{ bottom: -6 }}
      >
        <div className="bullet-handle-source" style={{ backgroundColor: accentColor }} />
      </Handle>
    </motion.div>
  );
}

export default memo(ActionNode);
