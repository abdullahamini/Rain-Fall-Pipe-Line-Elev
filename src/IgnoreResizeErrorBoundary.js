import React from "react";

export default class IgnoreResizeErrorBoundary extends React.Component {
    state = { hasError: false };

    static getDerivedStateFromError(error) {
        if (
            error?.message?.includes("ResizeObserver loop completed")
        ) {
            return { hasError: false }; // 🚫 نادیده بگیر
        }
        return { hasError: true };
    }

    componentDidCatch(error, info) {
        if (
            error?.message?.includes("ResizeObserver loop completed")
        ) {
            return;
        }
        console.error("Unhandled error:", error, info);
    }

    render() {
        return this.props.children;
    }
}
