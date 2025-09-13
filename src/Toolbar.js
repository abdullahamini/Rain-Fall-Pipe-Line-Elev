import React from "react";
import "./index.css";

export default function Toolbar() {
    const onDragStart = (event, nodeType) => {
        event.dataTransfer.setData("application/reactflow", nodeType);
        event.dataTransfer.effectAllowed = "move";
    };

    return (
        <aside className="toolbar">
            <div className="tool" draggable onDragStart={(e) => onDragStart(e, "circleNode")}>
                ⚪ Circle
            </div>
            <div className="tool" draggable onDragStart={(e) => onDragStart(e, "pipeNode")}>
                ➖ Pipe
            </div>
        </aside>
    );
}
