import React, { useState } from "react";
import { CounterDisplay } from "./CounterDisplay";

export function CounterPanel() {
  const [count, setCount] = useState(0);
  const [labelExpanded, setLabelExpanded] = useState(false);

  return (
    <div style={{
      padding: "24px",
      background: "#fffbeb",
      borderRadius: "16px",
      border: "1px solid #fcd34d"
    }}>
      <h2 style={{ marginTop: 0, marginBottom: "20px", fontSize: "20px", color: "#92400e" }}>
        ⏱️ Render Reason Demo
      </h2>
      <p style={{ color: "#b45309", fontSize: "14px", marginBottom: "24px" }}>
        Click the buttons below to change state. Watch the{" "}
        <strong style={{ color: "#d97706" }}>yellow flash overlay</strong> on the CounterDisplay component highlighting the exact prop or state that caused the render!
      </p>

      <div style={{ display: "flex", gap: "24px", alignItems: "flex-start", flexWrap: "wrap" }}>
        <CounterDisplay 
          count={count} 
          label={labelExpanded ? "Total Count Value" : "Count"} 
        />

        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <button
            onClick={() => setCount(c => c + 1)}
            style={{
              padding: "10px 20px", borderRadius: "8px",
              border: "none", background: "#f59e0b",
              color: "#fff", cursor: "pointer", fontSize: "15px",
              fontWeight: 600, boxShadow: "0 2px 4px rgba(245, 158, 11, 0.2)"
            }}
          >
            Increment Count (+1)
          </button>
          
          <button
            onClick={() => setLabelExpanded(b => !b)}
            style={{
              padding: "10px 20px", borderRadius: "8px",
              border: "1px solid #fcd34d", background: "#fef3c7",
              color: "#b45309", cursor: "pointer", fontSize: "15px",
              fontWeight: 600
            }}
          >
            Toggle Label Length
          </button>
        </div>
      </div>
    </div>
  );
}
