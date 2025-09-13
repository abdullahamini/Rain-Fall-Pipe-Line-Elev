// src/CircleNode.js
import React from "react";
import { Handle, Position } from "reactflow";

export default function CircleNode({ data }) {
    return (
        <div
            style={{
                width: 60,
                height: 60,
                borderRadius: "50%",
                background: "gold",
                border: "2px solid black",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
            }}
        >
            {data?.label || "Circle"}
            <Handle type="source" position={Position.Right} />
            <Handle type="target" position={Position.Left} />
        </div>
    );
}
