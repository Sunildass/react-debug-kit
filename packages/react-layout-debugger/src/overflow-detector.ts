/**
 * Overflow Detector — Detects elements with content overflow.
 *
 * Compares scrollWidth/scrollHeight against clientWidth/clientHeight
 * to find elements where content exceeds the visible area.
 */

import { eventBus } from "react-debug-kit";

export interface OverflowInfo {
  element: HTMLElement;
  direction: "horizontal" | "vertical" | "both";
  scrollWidth: number;
  clientWidth: number;
  scrollHeight: number;
  clientHeight: number;
}

/**
 * Check if an element has overflow issues.
 * Returns null if no overflow detected.
 */
export function detectOverflow(element: HTMLElement): OverflowInfo | null {
  const { scrollWidth, clientWidth, scrollHeight, clientHeight } = element;

  // Use a 1px tolerance to avoid false positives from sub-pixel rendering
  const hasHorizontal = scrollWidth > clientWidth + 1;
  const hasVertical = scrollHeight > clientHeight + 1;

  if (!hasHorizontal && !hasVertical) return null;

  // Skip elements that intentionally scroll (explicit overflow: scroll/auto)
  const style = getComputedStyle(element);
  const overflowX = style.overflowX;
  const overflowY = style.overflowY;
  if (overflowX === "auto" || overflowX === "scroll") return null;
  if (overflowY === "auto" || overflowY === "scroll") return null;

  let direction: OverflowInfo["direction"];
  if (hasHorizontal && hasVertical) direction = "both";
  else if (hasHorizontal) direction = "horizontal";
  else direction = "vertical";

  const info: OverflowInfo = {
    element,
    direction,
    scrollWidth,
    clientWidth,
    scrollHeight,
    clientHeight,
  };

  // Emit layout issue event
  eventBus.emit("layout_issue_detected", {
    element,
    issue: `${direction} overflow (scroll: ${hasHorizontal ? scrollWidth : scrollHeight}px > client: ${hasHorizontal ? clientWidth : clientHeight}px)`,
    type: "overflow",
    direction,
  });

  return info;
}
