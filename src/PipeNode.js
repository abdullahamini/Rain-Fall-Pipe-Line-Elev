import React, { useEffect, useRef } from "react";
import { Handle, Position, useReactFlow, useUpdateNodeInternals } from "reactflow";

export default function PipeNode({ id, data }) {
    const width = typeof data?.width === "number" ? data.width : 120;

    const { setNodes } = useReactFlow();
    const updateNodeInternals = useUpdateNodeInternals();

    const draggingRef = useRef(null);
    const startXRef = useRef(0);
    const startWRef = useRef(width);
    const rafRef = useRef(null);

    useEffect(() => {
        const onMouseMove = (e) => {
            if (!draggingRef.current) return;

            const dx = e.clientX - startXRef.current;
            let next = startWRef.current + (draggingRef.current === "right" ? dx : -dx);
            if (next < 50) next = 50;

            if (rafRef.current) cancelAnimationFrame(rafRef.current);
            rafRef.current = requestAnimationFrame(() => {
                setNodes((nds) =>
                    nds.map((n) =>
                        n.id === id ? { ...n, data: { ...n.data, width: next } } : n
                    )
                );
            });
        };

        const onMouseUp = () => {
            draggingRef.current = null;
            if (rafRef.current) {
                cancelAnimationFrame(rafRef.current);
                rafRef.current = null;
            }
            // ✅ فقط اینجا اطلاع بده که ابعاد عوض شد
            updateNodeInternals(id);
        };

        document.addEventListener("mousemove", onMouseMove);
        document.addEventListener("mouseup", onMouseUp);
        return () => {
            document.removeEventListener("mousemove", onMouseMove);
            document.removeEventListener("mouseup", onMouseUp);
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
        };
    }, [id, setNodes, updateNodeInternals]);

    const startDrag = (side) => (e) => {
        e.stopPropagation();
        e.preventDefault();
        draggingRef.current = side;
        startXRef.current = e.clientX;
        startWRef.current = width;
    };

    return (
        <div
            style={{
                position: "relative",
                width,
                height: 20,
                background: "cyan",
                border: "2px solid black",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "move",
                willChange: "width",
            }}
        >
            {data?.label || "Pipe"}

            <div
                className="nodrag"
                onMouseDown={startDrag("left")}
                style={{
                    position: "absolute",
                    left: -8,
                    top: -8,
                    width: 15,
                    height: 15,
                    background: "red",
                    cursor: "ew-resize",
                    zIndex: 20,
                }}
            />
            <div
                className="nodrag"
                onMouseDown={startDrag("right")}
                style={{
                    position: "absolute",
                    right: -8,
                    top: -8,
                    width: 15,
                    height: 15,
                    background: "red",
                    cursor: "ew-resize",
                    zIndex: 20,
                }}
            />

            <Handle type="source" position={Position.Right} />
            <Handle type="target" position={Position.Left} />
        </div>
    );
}
