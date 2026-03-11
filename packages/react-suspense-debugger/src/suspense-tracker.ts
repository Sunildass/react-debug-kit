/**
 * Suspense Tracker — Tracks Suspense boundary lifecycle (fallback → resolved).
 *
 * Polls the fiber tree at intervals to detect state transitions,
 * records timing, and emits events through the Event Bus.
 */

import { eventBus } from "react-debug-kit";
import { scanSuspenseBoundaries } from "./suspense-scanner";
import type { ScannedBoundary } from "./suspense-scanner";

export interface BoundaryRecord {
  boundaryId: string;
  componentName: string;
  fallbackStartTime: number;
  fallbackEndTime: number | null;
  duration: number | null;
  status: "pending" | "resolved";
}

const boundaryRecords: Map<string, BoundaryRecord> = new Map();
let pollIntervalId: ReturnType<typeof setInterval> | null = null;
let rootElement: HTMLElement | null = null;

/**
 * Start tracking Suspense boundaries by polling the fiber tree.
 */
export function startTracking(root: HTMLElement, intervalMs = 150): void {
  if (pollIntervalId) return;
  rootElement = root;

  pollIntervalId = setInterval(() => {
    pollBoundaries();
  }, intervalMs);

  // Do an initial scan immediately
  pollBoundaries();
}

/**
 * Stop tracking Suspense boundaries.
 */
export function stopTracking(): void {
  if (pollIntervalId) {
    clearInterval(pollIntervalId);
    pollIntervalId = null;
  }
  rootElement = null;
}

/**
 * Get all tracked boundary records.
 */
export function getBoundaryRecords(): BoundaryRecord[] {
  return Array.from(boundaryRecords.values());
}

/**
 * Clear all boundary records.
 */
export function clearRecords(): void {
  boundaryRecords.clear();
}

// ─── Internal ───────────────────────────────────────────────

function pollBoundaries(): void {
  if (!rootElement || !document.body.contains(rootElement)) return;

  let scanned: ScannedBoundary[];
  try {
    scanned = scanSuspenseBoundaries(rootElement);
  } catch {
    return; // fiber tree may be mid-render
  }

  for (const boundary of scanned) {
    const existing = boundaryRecords.get(boundary.boundaryId);

    if (boundary.isSuspended) {
      // Boundary is in fallback state
      if (!existing || existing.status === "resolved") {
        // New fallback started
        const record: BoundaryRecord = {
          boundaryId: boundary.boundaryId,
          componentName: boundary.componentName,
          fallbackStartTime: performance.now(),
          fallbackEndTime: null,
          duration: null,
          status: "pending",
        };
        boundaryRecords.set(boundary.boundaryId, record);

        eventBus.emit("suspense_fallback_started", {
          boundaryId: boundary.boundaryId,
          componentName: boundary.componentName,
          startTime: record.fallbackStartTime,
        });

        console.log(
          `%c[SuspenseDebugger] %c${boundary.componentName}%c fallback started`,
          "color: #a855f7; font-weight: bold;",
          "color: #89b4fa; font-weight: bold;",
          "color: #cdd6f4;"
        );
      }
    } else {
      // Boundary is resolved (showing content, not fallback)
      if (existing && existing.status === "pending") {
        // Just resolved!
        const endTime = performance.now();
        const duration = Math.round(endTime - existing.fallbackStartTime);

        existing.fallbackEndTime = endTime;
        existing.duration = duration;
        existing.status = "resolved";

        eventBus.emit("suspense_resolved", {
          boundaryId: boundary.boundaryId,
          componentName: boundary.componentName,
          startTime: existing.fallbackStartTime,
          endTime,
          duration,
        });

        console.log(
          `%c[SuspenseDebugger] %c${boundary.componentName}%c resolved in %c${duration}ms`,
          "color: #a855f7; font-weight: bold;",
          "color: #89b4fa; font-weight: bold;",
          "color: #cdd6f4;",
          "color: #22c55e; font-weight: bold;"
        );
      }
    }
  }
}
