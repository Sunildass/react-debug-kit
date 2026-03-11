/**
 * Waterfall Detector — Detects sequential Suspense loading patterns.
 *
 * A waterfall occurs when Suspense boundaries resolve sequentially
 * (boundary B can only start after boundary A finishes) instead of concurrently.
 */

import { eventBus } from "react-debug-kit";
import type { BoundaryRecord } from "./suspense-tracker";

export interface WaterfallResult {
  isWaterfall: boolean;
  chain: BoundaryRecord[];
}

/**
 * Analyze boundary records to detect sequential loading patterns.
 * Two boundaries constitute a waterfall if B's startTime is after A's endTime.
 */
export function detectWaterfall(records: BoundaryRecord[]): WaterfallResult {
  const resolved = records
    .filter((r) => r.status === "resolved" && r.fallbackEndTime !== null)
    .sort((a, b) => a.fallbackStartTime - b.fallbackStartTime);

  if (resolved.length < 2) {
    return { isWaterfall: false, chain: [] };
  }

  const chain: BoundaryRecord[] = [resolved[0]];

  for (let i = 1; i < resolved.length; i++) {
    const prev = resolved[i - 1];
    const curr = resolved[i];

    // Sequential: current started after previous ended (with a small tolerance of 50ms)
    if (prev.fallbackEndTime !== null && curr.fallbackStartTime > prev.fallbackEndTime - 50) {
      chain.push(curr);
    }
  }

  const isWaterfall = chain.length >= 2;

  if (isWaterfall) {
    eventBus.emit("suspense_waterfall_detected", {
      boundaries: chain.map((r) => ({
        boundaryId: r.boundaryId,
        componentName: r.componentName,
        startTime: r.fallbackStartTime,
        endTime: r.fallbackEndTime!,
        duration: r.duration!,
      })),
    });

    console.warn(
      `%c[SuspenseDebugger] ⚠️ Loading waterfall detected!%c ${chain.length} boundaries resolved sequentially:\n` +
        chain
          .map(
            (r, i) =>
              `  ${i + 1}. ${r.componentName} (${r.duration}ms)`
          )
          .join("\n"),
      "color: #f59e0b; font-weight: bold;",
      "color: #cdd6f4;"
    );
  }

  return { isWaterfall, chain };
}
