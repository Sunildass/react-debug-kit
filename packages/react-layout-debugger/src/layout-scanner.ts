/**
 * Layout Scanner — On-demand DOM scan for flex/grid containers.
 *
 * Uses getComputedStyle() to detect layout types and extract properties.
 * Scans only visible elements within a root container.
 */

import { eventBus } from "react-debug-kit";
import { detectOverflow } from "./overflow-detector.js";
import type { OverflowInfo } from "./overflow-detector.js";

export interface LayoutContainerInfo {
  element: HTMLElement;
  type: "flex" | "grid";
  id: string;
  properties: Record<string, string>;
}

export interface LayoutScanResult {
  containers: LayoutContainerInfo[];
  overflows: OverflowInfo[];
  totalScanned: number;
}

let containerCounter = 0;

/**
 * Scan visible DOM elements within root for layout containers and overflow issues.
 * This is an on-demand scan — call only when the user activates layout debugging.
 */
export function scanLayout(root: HTMLElement): LayoutScanResult {
  const containers: LayoutContainerInfo[] = [];
  const overflows: OverflowInfo[] = [];
  let totalScanned = 0;
  
  console.log("%c[LayoutDebugger] Starting scan on root:", "color: #06b6d4; font-weight: bold;", root);

  function walk(element: HTMLElement, isRoot = false): void {
    // Skip overlay root and hidden elements
    if (element.id === "rdk-overlay-root") return;

    const style = getComputedStyle(element);
    if (style.display === "none") return;

    const rect = element.getBoundingClientRect();
    // Only skip 0x0 elements if they aren't the root (display:contents can have 0x0)
    if (!isRoot && rect.width === 0 && rect.height === 0) {
      console.log("%c[LayoutDebugger] Skipping 0x0 element:", "color: #9399b2;", element);
      return;
    }

    console.log("%c[LayoutDebugger] Visiting element:", "color: #89b4fa;", element.tagName, element.className, "display:", style.display);

    totalScanned++;
    const display = style.display;

    // Detect flex containers
    if (display.includes("flex")) {
      containers.push({
        element,
        type: "flex",
        id: `layout-${++containerCounter}`,
        properties: {
          display,
          flexDirection: style.flexDirection,
          justifyContent: style.justifyContent,
          alignItems: style.alignItems,
          flexWrap: style.flexWrap,
          gap: style.gap,
        },
      });
    }

    // Detect grid containers
    if (display.includes("grid")) {
      containers.push({
        element,
        type: "grid",
        id: `layout-${++containerCounter}`,
        properties: {
          display,
          gridTemplateColumns: style.gridTemplateColumns,
          gridTemplateRows: style.gridTemplateRows,
          gap: style.gap,
          justifyItems: style.justifyItems,
          alignItems: style.alignItems,
        },
      });
    }

    // Check for overflow
    const overflow = detectOverflow(element);
    if (overflow) {
      overflows.push(overflow);
    }

    // Walk children (skip script, style, svg internals)
    const children = element.children;
    for (let i = 0; i < children.length; i++) {
      const child = children[i];
      if (child instanceof HTMLElement) {
        const tag = child.tagName.toLowerCase();
        if (tag !== "script" && tag !== "style" && tag !== "noscript") {
          walk(child, false);
        }
      }
    }
  }

  walk(root, true);

  // Emit scan complete event
  eventBus.emit("layout_scan_complete", {
    flexCount: containers.filter((c) => c.type === "flex").length,
    gridCount: containers.filter((c) => c.type === "grid").length,
    overflowCount: overflows.length,
    totalScanned,
  });

  // Log results
  const flexCount = containers.filter((c) => c.type === "flex").length;
  const gridCount = containers.filter((c) => c.type === "grid").length;

  console.log(
    `%c[LayoutDebugger] %cScan complete%c — ${totalScanned} elements, ${flexCount} flex, ${gridCount} grid, ${overflows.length} overflow`,
    "color: #06b6d4; font-weight: bold;",
    "color: #89b4fa; font-weight: bold;",
    "color: #cdd6f4;"
  );

  return { containers, overflows, totalScanned };
}
