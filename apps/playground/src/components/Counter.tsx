import { useState, useRef } from "react";
import { useRenderTracker } from "react-render-reason";

export function Counter() {
  const [count, setCount] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);

  // Track renders — will detect state changes
  useRenderTracker("Counter", {}, { count }, rootRef);

  return (
    <div
      ref={rootRef}
      style={{
        background: "#ffffff",
        border: "1px solid #e5e7eb",
        borderRadius: "12px",
        padding: "20px",
        boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
      }}
    >
      <h3 style={{ margin: "0 0 12px 0", fontSize: "16px", color: "#1a1a2e" }}>Counter</h3>
      <p style={{ fontSize: "32px", fontWeight: 700, margin: "0 0 16px 0", color: "#3b82f6" }}>
        {count}
      </p>
      <div style={{ display: "flex", gap: "8px" }}>
        <button
          onClick={() => setCount((c) => c - 1)}
          style={{
            padding: "8px 16px",
            borderRadius: "6px",
            border: "1px solid #d1d5db",
            background: "#fff",
            cursor: "pointer",
            fontSize: "14px",
          }}
        >
          −
        </button>
        <button
          onClick={() => setCount((c) => c + 1)}
          style={{
            padding: "8px 16px",
            borderRadius: "6px",
            border: "none",
            background: "#3b82f6",
            color: "#fff",
            cursor: "pointer",
            fontSize: "14px",
          }}
        >
          +
        </button>
      </div>
    </div>
  );
}
