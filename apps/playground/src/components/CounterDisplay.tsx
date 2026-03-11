import React, { useRef } from "react";
import { useRenderTracker } from "react-render-reason";

type CounterDisplayProps = {
  count: number;
  label: string;
};

export function CounterDisplay(props: CounterDisplayProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const { count, label } = props;

  useRenderTracker("CounterDisplay", props, undefined, rootRef);

  return (
    <div
      ref={rootRef}
      style={{
        background: "#ffffff",
        border: "1px solid #e5e7eb",
        borderRadius: "12px",
        padding: "24px",
        boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
        textAlign: "center",
        minWidth: "150px"
      }}
    >
      <h3 style={{ margin: "0 0 8px 0", fontSize: "14px", color: "#6c6c8a", textTransform: "uppercase" }}>
        {label}
      </h3>
      <div style={{ fontSize: "48px", fontWeight: 700, color: "#f59e0b" }}>
        {count}
      </div>
    </div>
  );
}
