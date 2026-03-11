/**
 * SuspenseDebugger — React component that enables Suspense debugging.
 *
 * Wrap your app with <SuspenseDebugger> to visualize Suspense boundaries,
 * track fallback durations, and detect loading waterfalls.
 * Only activates in development mode.
 */

import { useEffect, useRef, type ReactNode } from "react";
import { startTracking, stopTracking, getBoundaryRecords, clearRecords } from "./suspense-tracker";
import { startSuspenseOverlay, stopSuspenseOverlay } from "./suspense-overlay";
import { detectWaterfall } from "./waterfall-detector";
import { eventBus } from "react-debug-kit";

interface SuspenseDebuggerProps {
  children: ReactNode;
  /** Enable visual overlays. Default: true */
  showOverlays?: boolean;
  /** Enable waterfall detection. Default: true */
  detectWaterfalls?: boolean;
  /** Polling interval in ms for boundary scanning. Default: 150 */
  pollInterval?: number;
}

export function SuspenseDebugger({
  children,
  showOverlays = true,
  detectWaterfalls: enableWaterfallDetection = true,
  pollInterval = 150,
}: SuspenseDebuggerProps): ReactNode {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Guard: only run in development
    if (
      typeof process !== "undefined" &&
      process.env &&
      process.env.NODE_ENV === "production"
    ) {
      return;
    }

    const rootEl = rootRef.current;
    if (!rootEl) return;

    // Start tracking Suspense boundaries
    startTracking(rootEl, pollInterval);

    // Start overlay rendering
    if (showOverlays) {
      startSuspenseOverlay(rootEl);
    }

    // Run waterfall detection when boundaries resolve
    let waterfallHandler: (() => void) | null = null;
    if (enableWaterfallDetection) {
      waterfallHandler = () => {
        // Debounce: check after a small delay to catch sequential resolves
        setTimeout(() => {
          const records = getBoundaryRecords();
          detectWaterfall(records);
        }, 300);
      };
      eventBus.on("suspense_resolved", waterfallHandler);
    }

    return () => {
      stopTracking();
      stopSuspenseOverlay();
      clearRecords();
      if (waterfallHandler) {
        eventBus.off("suspense_resolved", waterfallHandler);
      }
    };
  }, [showOverlays, enableWaterfallDetection, pollInterval]);

  return (
    <div ref={rootRef} style={{ display: "contents" }}>
      {children}
    </div>
  );
}
