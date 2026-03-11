import React, { useState } from "react";
import { UserCard } from "./UserCard";
import { ActivityFeed } from "./ActivityFeed";

export function Dashboard() {
  const [activityCount, setActivityCount] = useState(42);
  const [role, setRole] = useState("Debug Engineer");

  return (
    <div style={{
      padding: "24px",
      background: "#f8fafc",
      borderRadius: "16px",
      border: "1px dashed #cbd5e1"
    }}>
      <h2 style={{ marginTop: 0, marginBottom: "20px", fontSize: "20px", color: "#334155" }}>
        📊 Dashboard (Live Inspect Demo)
      </h2>
      <p style={{ color: "#64748b", fontSize: "14px", marginBottom: "24px" }}>
        Press <kbd style={{ background: "#e2e8f0", padding: "2px 6px", borderRadius: "4px" }}>Ctrl+Shift+I</kbd> and hover over the components below to see their props and state.
      </p>

      <div style={{ display: "flex", gap: "24px", flexWrap: "wrap" }}>
        <UserCard name="Alex Mercer" role={role} avatar="👨‍🔬" />
        <ActivityFeed activityCount={activityCount} recentAction="Enabled Debug Mode" />
      </div>

      <div style={{ marginTop: "24px", display: "flex", gap: "12px" }}>
        <button
          onClick={() => setActivityCount(c => c + 1)}
          style={{
            padding: "8px 16px", borderRadius: "6px",
            border: "1px solid #3b82f6", background: "#eff6ff",
            color: "#1d4ed8", cursor: "pointer", fontSize: "14px",
            fontWeight: 500
          }}
        >
          Simulate Activity
        </button>
        <button
          onClick={() => setRole(r => r === "Debug Engineer" ? "Senior Architect" : "Debug Engineer")}
          style={{
            padding: "8px 16px", borderRadius: "6px",
            border: "1px solid #8b5cf6", background: "#f5f3ff",
            color: "#6d28d9", cursor: "pointer", fontSize: "14px",
            fontWeight: 500
          }}
        >
          Change Role
        </button>
      </div>
    </div>
  );
}
