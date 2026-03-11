/**
 * Suspense Scanner — Scans the fiber tree for Suspense boundaries.
 *
 * Uses the Fiber Inspector's findSuspenseBoundaries to locate all
 * Suspense components in the tree and check their suspended state.
 */

import { findSuspenseBoundaries } from "react-debug-kit";
import type { SuspenseBoundaryInfo } from "react-debug-kit";

export interface ScannedBoundary {
  boundaryId: string;
  componentName: string;
  isSuspended: boolean;
  nearestElement: HTMLElement | null;
  fiber: any;
}

let boundaryCounter = 0;
const fiberToBoundaryId = new WeakMap<object, string>();

/**
 * Scan the DOM for all Suspense boundaries starting from a root element.
 */
export function scanSuspenseBoundaries(rootElement: HTMLElement): ScannedBoundary[] {
  const boundaries = findSuspenseBoundaries(rootElement);

  return boundaries.map((info: SuspenseBoundaryInfo) => {
    // Generate stable ID per fiber
    let boundaryId = fiberToBoundaryId.get(info.fiber);
    if (!boundaryId) {
      boundaryId = `suspense-${++boundaryCounter}`;
      fiberToBoundaryId.set(info.fiber, boundaryId);
    }

    return {
      boundaryId,
      componentName: info.componentName,
      isSuspended: info.isSuspended,
      nearestElement: info.nearestElement,
      fiber: info.fiber,
    };
  });
}
