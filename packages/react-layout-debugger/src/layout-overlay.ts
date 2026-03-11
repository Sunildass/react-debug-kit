/**
 * Layout Overlay — Renders visual overlays for layout scan results.
 *
 * Uses the Overlay Engine to show color-coded borders around
 * flex/grid containers and overflow elements.
 */

import {
  showLayoutOverlay,
  removeAllLayoutOverlays,
  showSpacingOverlay,
  removeSpacingOverlay,
} from "react-debug-kit";
import type { LayoutScanResult, LayoutContainerInfo } from "./layout-scanner.js";
import type { OverflowInfo } from "./overflow-detector.js";
import { extractSpacing } from "./spacing-extractor.js";

/**
 * Render overlays for all layout scan results.
 */
export function renderLayoutOverlays(result: LayoutScanResult): void {
  // Clear previous overlays
  removeAllLayoutOverlays();

  // Render container overlays
  for (const container of result.containers) {
    renderContainerOverlay(container);
  }

  // Render overflow overlays
  for (const overflow of result.overflows) {
    renderOverflowOverlay(overflow);
  }
}

function renderContainerOverlay(container: LayoutContainerInfo): void {
  const rect = container.element.getBoundingClientRect();
  if (rect.width === 0 && rect.height === 0) return;

  const props = container.properties;
  let label: string;

  if (container.type === "flex") {
    label = `flex ${props.flexDirection || "row"}`;
  } else {
    const cols = props.gridTemplateColumns || "";
    const colCount = cols.split(/\s+/).filter(Boolean).length;
    label = `grid ${colCount}col`;
  }

  showLayoutOverlay(container.id, rect, container.type, label);
}

function renderOverflowOverlay(overflow: OverflowInfo): void {
  const rect = overflow.element.getBoundingClientRect();
  if (rect.width === 0 && rect.height === 0) return;

  const id = `overflow-${Math.random().toString(36).slice(2, 8)}`;
  const label = `⚠ ${overflow.direction} overflow`;

  showLayoutOverlay(id, rect, "overflow", label);
}

/**
 * Show spacing overlays for a specific element.
 */
export function renderSpacingForElement(element: HTMLElement): void {
  const rect = element.getBoundingClientRect();
  if (rect.width === 0 && rect.height === 0) return;

  const spacing = extractSpacing(element);
  showSpacingOverlay(rect, spacing.padding, spacing.margin);
}

/**
 * Clear all layout and spacing overlays.
 */
export function clearAllLayoutOverlays(): void {
  removeAllLayoutOverlays();
  removeSpacingOverlay();
}
