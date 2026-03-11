import { useState } from "react";
import { LiveInspect } from "react-live-inspect";
import { RenderReason } from "react-render-reason";
import { SuspenseDebugger } from "react-suspense-debugger";
import { LayoutDebugger } from "react-layout-debugger";

import { Dashboard } from "./components/Dashboard";
import { CounterPanel } from "./components/CounterPanel";
import { AsyncProductDemo } from "./components/AsyncProductDemo";
import { LayoutDemoPanel } from "./components/LayoutDemoPanel";

type TabId = "live-inspect" | "render-reason" | "suspense" | "layout";

export default function App() {
  const [activeTab, setActiveTab] = useState<TabId>("live-inspect");

  const tabs: { id: TabId; label: string; icon: string }[] = [
    { id: "live-inspect", label: "Live Inspect", icon: "🔍" },
    { id: "render-reason", label: "Render Reason", icon: "⏱️" },
    { id: "suspense", label: "Suspense", icon: "⏳" },
    { id: "layout", label: "Layout", icon: "📐" },
  ];

  return (
    <LiveInspect>
      <RenderReason>
        <SuspenseDebugger>
          <LayoutDebugger>
            <div style={{ fontFamily: "'Inter', 'Segoe UI', sans-serif", padding: "40px", maxWidth: "1000px", margin: "0 auto", color: "#1a1a2e" }}>
              <header style={{ marginBottom: "32px", borderBottom: "1px solid #e2e8f0", paddingBottom: "24px" }}>
                <h1 style={{ fontSize: "28px", fontWeight: 700, margin: "0 0 12px 0" }}>
                  🧪 React Debug Kit — Demo Playground
                </h1>
                <p style={{ color: "#64748b", fontSize: "15px", margin: 0 }}>
                  Select a module below to test its capabilities and record demo scenarios.
                </p>
              </header>

              {/* Navigation Tabs */}
              <div style={{ display: "flex", gap: "8px", marginBottom: "32px", flexWrap: "wrap" }}>
                {tabs.map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    style={{
                      padding: "10px 20px",
                      borderRadius: "8px",
                      border: activeTab === tab.id ? "2px solid #3b82f6" : "1px solid #cbd5e1",
                      background: activeTab === tab.id ? "#eff6ff" : "#ffffff",
                      color: activeTab === tab.id ? "#1d4ed8" : "#475569",
                      fontSize: "15px",
                      fontWeight: activeTab === tab.id ? 600 : 500,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      transition: "all 0.2s ease"
                    }}
                  >
                    <span>{tab.icon}</span> {tab.label}
                  </button>
                ))}
              </div>

              {/* Demo Content Area */}
              <div style={{ minHeight: "400px" }}>
                {activeTab === "live-inspect" && <Dashboard />}
                {activeTab === "render-reason" && <CounterPanel />}
                {activeTab === "suspense" && <AsyncProductDemo />}
                {activeTab === "layout" && <LayoutDemoPanel />}
              </div>
            </div>
          </LayoutDebugger>
        </SuspenseDebugger>
      </RenderReason>
    </LiveInspect>
  );
}
