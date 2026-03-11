/**
 * Mouse Tracker — Tracks cursor movement and identifies React components under the cursor.
 *
 * Attaches a `mousemove` listener, finds the React fiber for the hovered element,
 * and emits `component_hover` events via the Event Bus.
 */

import {
  eventBus,
  getFiberFromElement,
  findNearestComponentFiber,
} from "react-debug-kit";

let isTracking = false;
let lastHoveredElement: HTMLElement | null = null;

function handleMouseMove(e: MouseEvent): void {
  const target = e.target as HTMLElement;
  if (!target || target === lastHoveredElement) return;

  // Ignore our own overlay elements
  if (target.closest("#rdk-overlay-root")) return;

  lastHoveredElement = target;

  const fiber = getFiberFromElement(target);
  const componentFiber = fiber ? findNearestComponentFiber(fiber) : null;

  eventBus.emit("component_hover", {
    element: target,
    fiber: componentFiber,
  });
}

function handleClick(e: MouseEvent): void {
  const target = e.target as HTMLElement;

  // Ignore clicks on our own overlay
  if (target.closest("#rdk-overlay-root")) return;

  e.preventDefault();
  e.stopPropagation();

  const fiber = getFiberFromElement(target);
  const componentFiber = fiber ? findNearestComponentFiber(fiber) : null;

  eventBus.emit("component_selected", {
    element: target,
    fiber: componentFiber,
  });
}

export function startMouseTracking(): void {
  if (isTracking) return;
  isTracking = true;
  document.addEventListener("mousemove", handleMouseMove, true);
  document.addEventListener("click", handleClick, true);
}

export function stopMouseTracking(): void {
  if (!isTracking) return;
  isTracking = false;
  lastHoveredElement = null;
  document.removeEventListener("mousemove", handleMouseMove, true);
  document.removeEventListener("click", handleClick, true);
}
