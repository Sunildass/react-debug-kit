/**
 * react-layout-debugger — Public API exports.
 */

export { LayoutDebugger } from "./LayoutDebugger.js";
export { scanLayout } from "./layout-scanner.js";
export type { LayoutContainerInfo, LayoutScanResult } from "./layout-scanner.js";
export { detectOverflow } from "./overflow-detector.js";
export type { OverflowInfo } from "./overflow-detector.js";
export { extractSpacing } from "./spacing-extractor.js";
export type { ElementSpacing } from "./spacing-extractor.js";
export { renderLayoutOverlays, renderSpacingForElement, clearAllLayoutOverlays } from "./layout-overlay.js";
