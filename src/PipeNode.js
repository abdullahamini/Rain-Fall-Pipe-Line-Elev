import React, { useEffect, useRef, useMemo } from "react";
import { Handle, useReactFlow, useUpdateNodeInternals } from "reactflow";

const PAD = 12;

export default function PipeNode({ id, data, selected  }) {
  const pts = data?.points || { x1: 20, y1: 20, x2: 160, y2: 20 };

  const { setNodes } = useReactFlow();
  const updateNodeInternals = useUpdateNodeInternals();

  // محاسبه‌ی کادر اطراف خط
  const bbox = useMemo(() => {
    const minX = Math.min(pts.x1, pts.x2);
    const minY = Math.min(pts.y1, pts.y2);
    const maxX = Math.max(pts.x1, pts.x2);
    const maxY = Math.max(pts.y1, pts.y2);
    return {
      minX,
      minY,
      maxX,
      maxY,
      w: Math.max(1, maxX - minX),
      h: Math.max(1, maxY - minY),
    };
  }, [pts]);

  // نقاط نسبی در کادر
  const rel = useMemo(
    () => ({
      x1: PAD + (pts.x1 - bbox.minX),
      y1: PAD + (pts.y1 - bbox.minY),
      x2: PAD + (pts.x2 - bbox.minX),
      y2: PAD + (pts.y2 - bbox.minY),
      width: bbox.w + PAD * 2,
      height: bbox.h + PAD * 2,
    }),
    [pts, bbox]
  );

  const draggingRef = useRef(null);
  const startMouseRef = useRef({ x: 0, y: 0 });
  const startPtsRef = useRef(pts);
  const rafRef = useRef(null);

  useEffect(() => {
    const onMove = (e) => {
      if (!draggingRef.current) return;

      const dx = e.clientX - startMouseRef.current.x;
      const dy = e.clientY - startMouseRef.current.y;
      const base = startPtsRef.current;

      let next = { ...base };
      if (draggingRef.current === "p1") {
        next.x1 = base.x1 + dx;
        next.y1 = base.y1 + dy;
      } else {
        next.x2 = base.x2 + dx;
        next.y2 = base.y2 + dy;
      }

      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        setNodes((nds) =>
          nds.map((n) =>
            n.id === id ? { ...n, data: { ...n.data, points: next } } : n
          )
        );
      });
    };

    const onUp = () => {
      draggingRef.current = null;
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
      updateNodeInternals(id);
    };

    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", onUp);
    return () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseup", onUp);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [id, setNodes, updateNodeInternals]);

  const startDrag = (which) => (e) => {
    e.stopPropagation();
    e.preventDefault();
    draggingRef.current = which;
    startMouseRef.current = { x: e.clientX, y: e.clientY };
    startPtsRef.current = pts;
  };

return (
    <div
      style={{
        position: "relative",
        width: rel.width,
        height: rel.height,
        cursor: "move",
        userSelect: "none",
      }}
    >
      {/* خط */}
      <svg width={rel.width} height={rel.height}>
        <line
          x1={rel.x1}
          y1={rel.y1}
          x2={rel.x2}
          y2={rel.y2}
          stroke="cyan"
          strokeWidth={6}
        />
      </svg>

      {/* ✅ مربع‌ها فقط وقتی انتخاب شده */}
      {selected && (
        <>
          <div
            className="nodrag"
            onMouseDown={startDrag("p1")}
            style={{
              position: "absolute",
              left: rel.x1 - 6,
              top: rel.y1 - 6,
              width: 12,
              height: 12,
              background: "red",
              cursor: "move",
              zIndex: 20,
            }}
          />
          <div
            className="nodrag"
            onMouseDown={startDrag("p2")}
            style={{
              position: "absolute",
              left: rel.x2 - 6,
              top: rel.y2 - 6,
              width: 12,
              height: 12,
              background: "red",
              cursor: "move",
              zIndex: 20,
            }}
          />
        </>
      )}

      {/* ✅ Handleها همیشه باقی می‌مونن */}
     <Handle
        type="source"
        position="left"
        style={{ left: rel.x1, top: rel.y1 }}
     />
  
      <Handle
        type="target"
        position="right"
        style={{ left: rel.x2, top: rel.y2 }}
      />
    </div>
  );
}
