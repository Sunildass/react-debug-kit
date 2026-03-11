/**
 * LayoutDebugger — React component that enables on-demand layout debugging.
 *
 * Wrap your app with <LayoutDebugger> to enable layout scanning, overlay visualization,
 * and spacing inspection. Activated via a scan trigger (button or API).
 * Only activates in development mode.
 */

import { useState, useRef, useCallback, useEffect, type ReactNode } from "react";
import { scanLayout, type LayoutScanResult } from "./layout-scanner.js";
import { renderLayoutOverlays, renderSpacingForElement, clearAllLayoutOverlays } from "./layout-overlay.js";

interface LayoutDebuggerProps {
  children: ReactNode;
  /** Show the floating scan button. Default: true */
  showButton?: boolean;
}

export function LayoutDebugger({
  children,
  showButton = true,
}: LayoutDebuggerProps): ReactNode {
  const rootRef = useRef<HTMLDivElement>(null);
  const [isActive, setIsActive] = useState(false);
  const [scanResult, setScanResult] = useState<LayoutScanResult | null>(null);
  const [showSpacing, setShowSpacing] = useState(false);

  const handleScan = useCallback(() => {
    if (!rootRef.current) return;

    if (isActive) {
      // Deactivate
      clearAllLayoutOverlays();
      setScanResult(null);
      setIsActive(false);
      setShowSpacing(false);
      return;
    }

    // Run scan
    const result = scanLayout(rootRef.current);
    setScanResult(result);
    renderLayoutOverlays(result);
    setIsActive(true);
  }, [isActive]);

  // Spacing hover handler
  useEffect(() => {
    if (!showSpacing || !isActive) return;

    const handleMouseMove = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target && target.id !== "rdk-overlay-root" && !target.closest("#rdk-overlay-root")) {
        renderSpacingForElement(target);
      }
    };

    document.addEventListener("mousemove", handleMouseMove);
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      clearAllLayoutOverlays();
      // Re-render layout overlays without spacing
      if (scanResult) {
        renderLayoutOverlays(scanResult);
      }
    };
  }, [showSpacing, isActive, scanResult]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearAllLayoutOverlays();
    };
  }, []);

  // Guard: only run in development
  const isDev = typeof process === "undefined" || !process.env || process.env.NODE_ENV !== "production";
  if (!isDev) {
    return <>{children}</>;
  }

  return (
    <div ref={rootRef} style={{ display: "contents" }}>
      {children}

      {showButton && (
        <div style={{
          position: "fixed",
          bottom: "16px",
          right: "16px",
          zIndex: 2147483645,
          display: "flex",
          gap: "6px",
          flexDirection: "column",
          alignItems: "flex-end",
        }}>
          {isActive && scanResult && (
            <>
              <div style={{
                background: "#1e1e2e",
                color: "#cdd6f4",
                padding: "8px 12px",
                borderRadius: "8px",
                fontSize: "11px",
                fontFamily: "'SF Mono', 'Fira Code', monospace",
                lineHeight: "1.6",
                border: "1px solid #45475a",
                boxShadow: "0 4px 16px rgba(0,0,0,0.3)",
              }}>
                <div style={{ fontWeight: 700, marginBottom: "4px", color: "#06b6d4" }}>Layout Inspector</div>
                {rootRef.current && (
                  <div style={{ fontSize: "9px", opacity: 0.7, marginBottom: "4px" }}>
                    Root: {rootRef.current.tagName.toLowerCase()} ({getComputedStyle(rootRef.current).display})
                  </div>
                )}
                <div><span style={{ color: "#89b4fa" }}>Scanned:</span> {scanResult.totalScanned}</div>
                <div><span style={{ color: "#8b5cf6" }}>Flex:</span> {scanResult.containers.filter(c => c.type === "flex").length}</div>
                <div><span style={{ color: "#06b6d4" }}>Grid:</span> {scanResult.containers.filter(c => c.type === "grid").length}</div>
                <div><span style={{ color: "#ef4444" }}>Overflow:</span> {scanResult.overflows.length}</div>
              </div>
              <button
                onClick={() => setShowSpacing((s) => !s)}
                style={{
                  padding: "6px 12px",
                  borderRadius: "6px",
                  border: "none",
                  background: showSpacing ? "#f59e0b" : "#45475a",
                  color: "#fff",
                  cursor: "pointer",
                  fontSize: "10px",
                  fontFamily: "'SF Mono', 'Fira Code', monospace",
                  fontWeight: 600,
                  boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
                }}
              >
                {showSpacing ? "📏 Spacing: ON" : "📏 Spacing: OFF"}
              </button>
            </>
          )}
          <button
            onClick={handleScan}
            style={{
              padding: "8px 16px",
              borderRadius: "8px",
              border: "none",
              background: isActive ? "#ef4444" : "#06b6d4",
              color: "#fff",
              cursor: "pointer",
              fontSize: "11px",
              fontFamily: "'SF Mono', 'Fira Code', monospace",
              fontWeight: 700,
              boxShadow: "0 4px 16px rgba(0,0,0,0.3)",
              transition: "background 0.15s",
            }}
          >
            {isActive ? "✕ Clear Layout" : "📐 Scan Layout"}
          </button>
        </div>
      )}
    </div>
  );
}
