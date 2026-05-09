"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type DragEvent,
} from "react";
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  addEdge,
  useReactFlow,
  ReactFlowProvider,
  BackgroundVariant,
  type Connection,
  type Node,
  type Edge,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import { useApp } from "../context/AppContext";
import { generateAnchorCode } from "./codegen";
import { applyDagreLayout } from "./autoLayout";

import Toolbox from "./Toolbox";
import CodePreviewPanel from "./CodePreviewPanel";
import CanvasToolbar from "./CanvasToolbar";
import AIImportModal from "./AIImportModal";
import AITutorPanel from "./AITutorPanel";

import StructNode from "./nodes/StructNode";
import FunctionNode from "./nodes/FunctionNode";
import ActionNode from "./nodes/ActionNode";
import TemplateNode from "./nodes/TemplateNode";

// ── Register custom node types ──────────────────────────────────────────
const nodeTypes = {
  structNode: StructNode,
  functionNode: FunctionNode,
  actionNode: ActionNode,
  templateNode: TemplateNode,
};

// ── Helpers ─────────────────────────────────────────────────────────────
let nodeIdCounter = 0;
function nextId() {
  nodeIdCounter++;
  return `node-${Date.now()}-${nodeIdCounter}`;
}

// ── Inner component (needs ReactFlowProvider ancestor) ──────────────────
function BuilderCanvas() {
  const { theme } = useApp();
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const { screenToFlowPosition, zoomIn, zoomOut, fitView } = useReactFlow();

  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  const [codeOutput, setCodeOutput] = useState("");
  const [rightPanelOpen, setRightPanelOpen] = useState(true);
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [locked, setLocked] = useState(false);
  const [tutorOpen, setTutorOpen] = useState(true);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  // Get the selected node object
  const selectedNode = useMemo(
    () => nodes.find((n) => n.id === selectedNodeId) || null,
    [nodes, selectedNodeId]
  );

  // ── Code generation ───────────────────────────────────────────────
  useEffect(() => {
    const code = generateAnchorCode(nodes, edges);
    setCodeOutput(code);
  }, [nodes, edges]);

  // ── Listen for node data updates from custom nodes ────────────────
  useEffect(() => {
    const handler = (e: Event) => {
      const { id, updates } = (e as CustomEvent).detail;
      setNodes((nds) =>
        nds.map((n) =>
          n.id === id ? { ...n, data: { ...n.data, ...updates } } : n
        )
      );
    };
    window.addEventListener("builder:updateNode", handler);
    return () => window.removeEventListener("builder:updateNode", handler);
  }, [setNodes]);

  // ── Listen for template expand events ─────────────────────────────
  useEffect(() => {
    const handler = (e: Event) => {
      const { id, templateType } = (e as CustomEvent).detail;
      const templateNode = nodes.find((n) => n.id === id);
      if (!templateNode) return;

      const newNodes: Node[] = [];
      const newEdges: Edge[] = [];

      if (templateType === "basic_coin") {
        const stateId = nextId();
        const ctxId = nextId();
        const fnId = nextId();

        newNodes.push({
          id: stateId,
          type: "structNode",
          position: { x: 0, y: 0 },
          data: {
            label: "Token State",
            structName: "TokenState",
            fields: [
              { name: "mint", type: "Pubkey" },
              { name: "authority", type: "Pubkey" },
              { name: "supply", type: "u64" },
            ],
            nodeCategory: "state",
          },
        });
        newNodes.push({
          id: ctxId,
          type: "structNode",
          position: { x: 0, y: 0 },
          data: {
            label: "Mint Context",
            structName: "MintCtx",
            fields: [
              { name: "mint", type: "Account<'info, Mint>" },
              { name: "authority", type: "Signer<'info>" },
              { name: "token_program", type: "Program<'info, Token>" },
            ],
            nodeCategory: "context",
          },
        });
        newNodes.push({
          id: fnId,
          type: "functionNode",
          position: { x: 0, y: 0 },
          data: {
            label: "fn mint_tokens",
            functionName: "mint_tokens",
            body: "// Mint SPL tokens\nOk(())",
            connectedContext: "MintCtx",
          },
        });
        newEdges.push({
          id: `edge-${stateId}-${ctxId}`,
          source: stateId,
          target: ctxId,
          animated: true,
          style: { stroke: "#14f195", strokeWidth: 2 },
        });
        newEdges.push({
          id: `edge-${ctxId}-${fnId}`,
          source: ctxId,
          target: fnId,
          animated: true,
          style: { stroke: "#9945ff", strokeWidth: 2 },
        });
      } else if (templateType === "basic_nft") {
        const stateId = nextId();
        const ctxId = nextId();
        const fnId = nextId();

        newNodes.push({
          id: stateId,
          type: "structNode",
          position: { x: 0, y: 0 },
          data: {
            label: "NFT Metadata",
            structName: "NftMetadata",
            fields: [
              { name: "name", type: "String" },
              { name: "symbol", type: "String" },
              { name: "uri", type: "String" },
              { name: "creator", type: "Pubkey" },
            ],
            nodeCategory: "state",
          },
        });
        newNodes.push({
          id: ctxId,
          type: "structNode",
          position: { x: 0, y: 0 },
          data: {
            label: "Mint NFT Context",
            structName: "MintNftCtx",
            fields: [
              { name: "mint", type: "Account<'info, Mint>" },
              { name: "metadata", type: "Account<'info, NftMetadata>" },
              { name: "authority", type: "Signer<'info>" },
            ],
            nodeCategory: "context",
          },
        });
        newNodes.push({
          id: fnId,
          type: "functionNode",
          position: { x: 0, y: 0 },
          data: {
            label: "fn mint_nft",
            functionName: "mint_nft",
            body: "// Mint NFT with metadata\nOk(())",
            connectedContext: "MintNftCtx",
          },
        });
        newEdges.push({
          id: `edge-${stateId}-${ctxId}`,
          source: stateId,
          target: ctxId,
          animated: true,
          style: { stroke: "#14f195", strokeWidth: 2 },
        });
        newEdges.push({
          id: `edge-${ctxId}-${fnId}`,
          source: ctxId,
          target: fnId,
          animated: true,
          style: { stroke: "#9945ff", strokeWidth: 2 },
        });
      }

      // Remove template node, add expanded nodes — then auto-layout
      const allNodes = [...nodes.filter((n) => n.id !== id), ...newNodes];
      const allEdges = [...edges, ...newEdges];
      const laid = applyDagreLayout(allNodes, allEdges);
      setNodes(laid);
      setEdges(allEdges);

      // Fit view after layout
      setTimeout(() => fitView({ padding: 0.2 }), 100);
    };

    window.addEventListener("builder:expandTemplate", handler);
    return () => window.removeEventListener("builder:expandTemplate", handler);
  }, [nodes, edges, setNodes, setEdges, fitView]);

  // ── Edge connection ───────────────────────────────────────────────
  const onConnect = useCallback(
    (params: Connection) => {
      const newEdges = addEdge(
        {
          ...params,
          animated: true,
          style: { stroke: "#14f195", strokeWidth: 2 },
        },
        edges
      );
      setEdges(newEdges);

      // Auto-layout after new connection
      const laid = applyDagreLayout(nodes, newEdges);
      setNodes(laid);
      setTimeout(() => fitView({ padding: 0.2 }), 100);
    },
    [nodes, edges, setEdges, setNodes, fitView]
  );

  // ── Node click → select for tutor ─────────────────────────────────
  const onNodeClick = useCallback(
    (_event: React.MouseEvent, node: Node) => {
      setSelectedNodeId(node.id);
      if (!tutorOpen) setTutorOpen(true);
    },
    [tutorOpen]
  );

  // ── Pane click → deselect ─────────────────────────────────────────
  const onPaneClick = useCallback(() => {
    setSelectedNodeId(null);
  }, []);

  // ── Drag from sidebar → canvas ────────────────────────────────────
  const onDragOver = useCallback((e: DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (e: DragEvent) => {
      e.preventDefault();
      const raw = e.dataTransfer.getData("application/reactflow");
      if (!raw) return;

      const { type, data } = JSON.parse(raw);
      const position = screenToFlowPosition({
        x: e.clientX,
        y: e.clientY,
      });

      const newNode: Node = {
        id: nextId(),
        type,
        position,
        data: { ...data },
      };

      const allNodes = [...nodes, newNode];
      // Auto-layout all nodes after drop
      const laid = applyDagreLayout(allNodes, edges);
      setNodes(laid);
      setTimeout(() => fitView({ padding: 0.2 }), 100);
    },
    [screenToFlowPosition, nodes, edges, setNodes, fitView]
  );

  // ── Toolbar actions ───────────────────────────────────────────────
  const handleExport = useCallback(() => {
    const blob = new Blob([codeOutput], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "contract.rs";
    a.click();
    URL.revokeObjectURL(url);
  }, [codeOutput]);

  const handleAIImport = useCallback(
    (importedNodes: Node[], importedEdges: Edge[]) => {
      const allNodes = [...nodes, ...importedNodes];
      const allEdges = [...edges, ...importedEdges];
      const laid = applyDagreLayout(allNodes, allEdges);
      setNodes(laid);
      setEdges(allEdges);
      setTimeout(() => fitView({ padding: 0.2 }), 100);
    },
    [nodes, edges, setNodes, setEdges, fitView]
  );

  // ── MiniMap colors ────────────────────────────────────────────────
  const minimapStyle = useMemo(
    () => ({
      backgroundColor: theme === "dark" ? "#0f172a" : "#f1f5f9",
    }),
    [theme]
  );

  const miniMapNodeColor = useCallback(
    (node: Node) => {
      switch (node.type) {
        case "structNode":
          return (node.data as { nodeCategory?: string })?.nodeCategory === "context" ? "#9945ff" : "#14f195";
        case "functionNode":
          return "#f0f056";
        case "actionNode":
          return "#38bdf8";
        case "templateNode":
          return "#fb923c";
        default:
          return "#94a3b8";
      }
    },
    []
  );

  return (
    <div className="flex-1 flex h-[calc(100vh-4rem)] overflow-hidden">
      {/* Left Sidebar */}
      <div className="w-[280px] shrink-0">
        <Toolbox />
      </div>

      {/* Canvas */}
      <div className="flex-1 relative" ref={reactFlowWrapper}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onDrop={onDrop}
          onDragOver={onDragOver}
          onNodeClick={onNodeClick}
          onPaneClick={onPaneClick}
          nodeTypes={nodeTypes}
          nodesDraggable={!locked}
          fitView
          proOptions={{ hideAttribution: true }}
          defaultEdgeOptions={{
            animated: true,
            style: { stroke: "#14f195", strokeWidth: 2 },
          }}
          className="builder-canvas"
        >
          <Background
            variant={BackgroundVariant.Dots}
            gap={20}
            size={1.5}
            color={theme === "dark" ? "rgba(148,163,184,0.15)" : "rgba(100,116,139,0.2)"}
          />
          <Controls
            showInteractive={false}
            className="!hidden"
          />
          <MiniMap
            style={minimapStyle}
            nodeColor={miniMapNodeColor}
            maskColor={theme === "dark" ? "rgba(15,23,42,0.7)" : "rgba(241,245,249,0.7)"}
            className="!rounded-xl !border !border-card-border !shadow-lg"
          />
        </ReactFlow>

        {/* Floating toolbar */}
        <CanvasToolbar
          onZoomIn={() => zoomIn()}
          onZoomOut={() => zoomOut()}
          onFitView={() => fitView({ padding: 0.2 })}
          locked={locked}
          onToggleLock={() => setLocked((prev) => !prev)}
          onExport={handleExport}
        />
      </div>

      {/* Right Panel — Tutor + Code Preview stacked vertically */}
      <div
        className="flex flex-col shrink-0 overflow-hidden"
        style={{
          width: rightPanelOpen ? 400 : 0,
          borderLeft: rightPanelOpen ? "1px solid var(--card-border)" : "none",
          transition: "width 0.3s ease-in-out",
        }}
      >
        {rightPanelOpen && (
          <>
            {/* AI Tutor Panel (top) */}
            <AITutorPanel
              selectedNode={selectedNode}
              isOpen={tutorOpen}
              onToggle={() => setTutorOpen((prev) => !prev)}
            />

            {/* Code Preview Panel (bottom, takes remaining space) */}
            <div className="flex-1 flex flex-col overflow-hidden">
              <CodePreviewPanel
                code={codeOutput}
                isOpen={true}
                onToggle={() => setRightPanelOpen(false)}
                onOpenAIModal={() => setAiModalOpen(true)}
              />
            </div>
          </>
        )}
      </div>

      {/* Toggle button when right panel is closed */}
      {!rightPanelOpen && (
        <button
          onClick={() => setRightPanelOpen(true)}
          className="absolute right-4 top-4 z-10 p-2.5 rounded-xl bg-card-bg border border-card-border
                     text-muted hover:text-foreground transition-colors backdrop-blur-xl"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
            <line x1="15" y1="3" x2="15" y2="21" />
          </svg>
        </button>
      )}

      {/* AI Modal */}
      <AIImportModal
        isOpen={aiModalOpen}
        onClose={() => setAiModalOpen(false)}
        onImport={handleAIImport}
      />
    </div>
  );
}

// ── Wrapped with ReactFlowProvider ──────────────────────────────────────
export default function BuilderView() {
  return (
    <ReactFlowProvider>
      <BuilderCanvas />
    </ReactFlowProvider>
  );
}
