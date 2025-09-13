import React, { useCallback } from "react";
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
} from "reactflow";
import "reactflow/dist/style.css";

import Toolbar from "./Toolbar";
import PipeNode from "./PipeNode";
import CircleNode from "./CircleNode";
import IgnoreResizeErrorBoundary from "./IgnoreResizeErrorBoundary";

const nodeTypes = {
  circleNode: CircleNode,
  pipeNode: PipeNode,
};


export default function App() {

  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const onConnect = useCallback((p) => setEdges((eds) => addEdge(p, eds)), [setEdges]);

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();
      const type = event.dataTransfer.getData("application/reactflow");
      if (!type) return;

      const position = { x: event.clientX - 200, y: event.clientY };
      const newNode = {
        id: String(Date.now()),
        type,
        position,
        data: {
          label: type === "pipeNode" ? "Pipe" : "Circle",
          width: type === "pipeNode" ? 120 : undefined, // ⬅️ عرض اولیه
        },
        // اجازه بده RF خودش اندازه را مدیریت کند
        style: { width: "auto", height: "auto" },
      };
      setNodes((nds) => nds.concat(newNode));
    },
    [setNodes]
  );

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  return (
    <IgnoreResizeErrorBoundary>
      <div style={{ display: "flex", height: "100vh" }}>
        <Toolbar />
        <div style={{ flex: 1, background: "#111" }}>
          <ReactFlow
            fitView
            nodes={nodes}
            edges={edges}
            nodeTypes={nodeTypes}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onDrop={onDrop}
            onDragOver={onDragOver}
          >
            <MiniMap />
            <Controls />
            <Background />
          </ReactFlow>
        </div>
      </div>
    </IgnoreResizeErrorBoundary>
  );
}
