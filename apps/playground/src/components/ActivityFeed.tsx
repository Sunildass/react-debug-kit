import React from "react";

interface ActivityFeedProps {
  activityCount: number;
  recentAction: string;
}

export function ActivityFeed({ activityCount, recentAction }: ActivityFeedProps) {
  return (
    <div style={{
      background: "#ffffff",
      border: "1px solid #e5e7eb",
      borderRadius: "12px",
      padding: "20px",
      boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
      flex: 1
    }}>
      <h3 style={{ margin: "0 0 12px 0", fontSize: "16px", color: "#1a1a2e" }}>
        📈 Activity Feed
      </h3>
      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: "14px", color: "#6c6c8a" }}>Total Activities:</span>
          <span style={{ fontSize: "16px", fontWeight: 600, color: "#3b82f6" }}>{activityCount}</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: "14px", color: "#6c6c8a" }}>Recent Action:</span>
          <span style={{ fontSize: "14px", fontWeight: 500, color: "#10b981" }}>{recentAction}</span>
        </div>
      </div>
    </div>
  );
}
