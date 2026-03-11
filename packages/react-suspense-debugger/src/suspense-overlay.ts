/**
 * Suspense Overlay — Subscribes to Suspense events and renders overlays
 * via the Overlay Engine.
 */

import {
  eventBus,
  showSuspenseBoundary,
  removeSuspenseBoundary,
  removeAllSuspenseBoundaries,
  findSuspenseBoundaries,
} from "react-debug-kit";
import type { EventMap } from "react-debug-kit";

let unsubscribers: (() => void)[] = [];
let overlayPollId: ReturnType<typeof setInterval> | null = null;

function handleFallbackStarted(payload: EventMap["suspense_fallback_started"]): void {
  if (!payload) return;
  // Overlay will be positioned during the next poll cycle
}

function handleResolved(payload: EventMap["suspense_resolved"]): void {
  if (!payload) return;

  // Remove the pending overlay
  removeSuspenseBoundary(payload.boundaryId);

  // The resolve flash will be shown during the next overlay poll
  // using the element's current position
}

/**
 * Start updating Suspense boundary overlays by polling DOM positions.
 */
export function startSuspenseOverlay(rootElement: HTMLElement): void {
  if (overlayPollId) return;

  const onFallbackStarted = handleFallbackStarted;
  const onResolved = handleResolved;

  eventBus.on("suspense_fallback_started", onFallbackStarted);
  eventBus.on("suspense_resolved", onResolved);
  unsubscribers.push(
    () => eventBus.off("suspense_fallback_started", onFallbackStarted),
    () => eventBus.off("suspense_resolved", onResolved)
  );

  // Poll to update overlay positions
  overlayPollId = setInterval(() => {
    try {
      const boundaries = findSuspenseBoundaries(rootElement);

      for (const boundary of boundaries) {
        if (boundary.isSuspended && boundary.nearestElement) {
          const rect = boundary.nearestElement.getBoundingClientRect();
          if (rect.width > 0 && rect.height > 0) {
            const fiberToBoundaryId = (boundary as any).fiber;
            // Use fiber identity for ID — use component name as part of a stable ID
            const boundaryId = `suspense-overlay-${boundary.componentName}`;
            showSuspenseBoundary(
              boundaryId,
              rect,
              `⏳ ${boundary.componentName}`,
              "pending"
            );
          }
        }
      }
    } catch {
      // fiber tree may be mid-render
    }
  }, 200);
}

/**
 * Stop rendering Suspense overlays.
 */
export function stopSuspenseOverlay(): void {
  if (overlayPollId) {
    clearInterval(overlayPollId);
    overlayPollId = null;
  }

  for (const unsub of unsubscribers) {
    unsub();
  }
  unsubscribers = [];

  removeAllSuspenseBoundaries();
}
