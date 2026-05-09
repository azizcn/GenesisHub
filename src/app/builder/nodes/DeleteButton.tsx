"use client";

import { useReactFlow } from "@xyflow/react";
import { Trash2 } from "lucide-react";
import { memo } from "react";

interface DeleteButtonProps {
  id: string;
  type: "node" | "edge";
}

function DeleteButton({ id, type }: DeleteButtonProps) {
  const { deleteElements } = useReactFlow();

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (type === "node") {
      deleteElements({ nodes: [{ id }] });
    } else {
      deleteElements({ edges: [{ id }] });
    }
  };

  const visibilityClass = type === "node" ? "opacity-0 group-hover:opacity-100" : "opacity-100 hover:scale-110";

  return (
    <button
      onClick={handleDelete}
      className={`absolute z-50 w-6 h-6 bg-red-500/10 hover:bg-red-500/30 text-red-400 hover:text-red-300 rounded-full flex items-center justify-center backdrop-blur-md border border-red-500/30 transition-all ${
        type === "node" ? "-top-2 -right-2" : "top-0 left-0"
      } ${visibilityClass}`}
      title="Delete"
    >
      <Trash2 size={12} />
    </button>
  );
}

export default memo(DeleteButton);
