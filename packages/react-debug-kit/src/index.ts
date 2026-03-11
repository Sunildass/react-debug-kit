/**
 * react-debug-kit — Core package barrel exports.
 */

// Event Bus
export { eventBus, EventBus } from "./event-bus";
export type { EventCallback, EventMap } from "./event-bus";

// Fiber Inspector
export {
  getFiberFromElement,
  findNearestComponentFiber,
  getComponentInfo,
  inspectElement,
  findSuspenseBoundaries,
} from "./fiber-inspector";
export type { ComponentInfo, SuspenseBoundaryInfo } from "./fiber-inspector";

// Overlay Engine
export {
  showHighlight,
  hideHighlight,
  showPanel,
  hidePanel,
  showRenderFlash,
  showSuspenseBoundary,
  removeSuspenseBoundary,
  removeAllSuspenseBoundaries,
  showLayoutOverlay,
  removeLayoutOverlay,
  removeAllLayoutOverlays,
  showSpacingOverlay,
  removeSpacingOverlay,
  destroyOverlay,
} from "./overlay-engine";
export type { PanelContent, SpacingValues } from "./overlay-engine";

// Hotkey Manager
export { hotkeyManager, HotkeyManager } from "./hotkey-manager";
export type { HotkeyCombo } from "./hotkey-manager";
