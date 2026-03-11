/**
 * Overlay Engine — Centralized overlay rendering system.
 *
 * Creates a single overlay root on document.body and provides APIs
 * to show/hide highlight boxes and floating inspector panels.
 */

const OVERLAY_ROOT_ID = "rdk-overlay-root";
const HIGHLIGHT_ID = "rdk-highlight";
const LABEL_ID = "rdk-highlight-label";
const PANEL_ID = "rdk-inspector-panel";

let overlayRoot: HTMLDivElement | null = null;
let highlightEl: HTMLDivElement | null = null;
let labelEl: HTMLDivElement | null = null;
let panelEl: HTMLDivElement | null = null;

/** Ensures the overlay root element exists on document.body. */
function ensureOverlayRoot(): HTMLDivElement {
  if (overlayRoot && document.body.contains(overlayRoot)) {
    return overlayRoot;
  }

  overlayRoot = document.createElement("div");
  overlayRoot.id = OVERLAY_ROOT_ID;
  Object.assign(overlayRoot.style, {
    position: "fixed",
    top: "0",
    left: "0",
    width: "0",
    height: "0",
    zIndex: "2147483646",
    pointerEvents: "none",
  });
  document.body.appendChild(overlayRoot);
  return overlayRoot;
}

/** Show a highlight box around the given DOMRect with an optional label. */
export function showHighlight(rect: DOMRect, label?: string): void {
  const root = ensureOverlayRoot();

  // Highlight box
  if (!highlightEl) {
    highlightEl = document.createElement("div");
    highlightEl.id = HIGHLIGHT_ID;
    root.appendChild(highlightEl);
  }

  Object.assign(highlightEl.style, {
    position: "fixed",
    top: `${rect.top}px`,
    left: `${rect.left}px`,
    width: `${rect.width}px`,
    height: `${rect.height}px`,
    border: "2px solid #61dafb",
    backgroundColor: "rgba(97, 218, 251, 0.1)",
    borderRadius: "3px",
    pointerEvents: "none",
    transition: "all 0.05s ease-out",
    boxSizing: "border-box",
  });

  // Label above the highlight
  if (label) {
    if (!labelEl) {
      labelEl = document.createElement("div");
      labelEl.id = LABEL_ID;
      root.appendChild(labelEl);
    }

    labelEl.textContent = label;
    Object.assign(labelEl.style, {
      position: "fixed",
      top: `${Math.max(0, rect.top - 22)}px`,
      left: `${rect.left}px`,
      backgroundColor: "#61dafb",
      color: "#282c34",
      fontSize: "11px",
      fontFamily: "'SF Mono', 'Fira Code', 'Cascadia Code', monospace",
      fontWeight: "600",
      padding: "2px 6px",
      borderRadius: "3px 3px 0 0",
      pointerEvents: "none",
      whiteSpace: "nowrap",
      lineHeight: "16px",
    });
  }
}

/** Hide the highlight box and label. */
export function hideHighlight(): void {
  if (highlightEl && highlightEl.parentNode) {
    highlightEl.parentNode.removeChild(highlightEl);
    highlightEl = null;
  }
  if (labelEl && labelEl.parentNode) {
    labelEl.parentNode.removeChild(labelEl);
    labelEl = null;
  }
}

export interface PanelContent {
  componentName: string;
  props: Record<string, unknown>;
  state: unknown;
}

/** Show the inspector panel near the given position. */
export function showPanel(content: PanelContent, position: { x: number; y: number }): void {
  const root = ensureOverlayRoot();

  if (!panelEl) {
    panelEl = document.createElement("div");
    panelEl.id = PANEL_ID;
    root.appendChild(panelEl);
  }

  // Allow clicking inside the panel
  panelEl.style.pointerEvents = "auto";

  // Position the panel — adjust to stay within viewport
  const panelWidth = 320;
  const panelMaxHeight = 400;
  let left = position.x + 12;
  let top = position.y + 12;

  if (left + panelWidth > window.innerWidth) {
    left = position.x - panelWidth - 12;
  }
  if (top + panelMaxHeight > window.innerHeight) {
    top = Math.max(8, window.innerHeight - panelMaxHeight - 8);
  }

  Object.assign(panelEl.style, {
    position: "fixed",
    top: `${top}px`,
    left: `${left}px`,
    width: `${panelWidth}px`,
    maxHeight: `${panelMaxHeight}px`,
    backgroundColor: "#1e1e2e",
    color: "#cdd6f4",
    border: "1px solid #45475a",
    borderRadius: "8px",
    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.4)",
    fontFamily: "'SF Mono', 'Fira Code', 'Cascadia Code', monospace",
    fontSize: "12px",
    lineHeight: "1.5",
    overflow: "auto",
    padding: "0",
    zIndex: "2147483647",
  });

  panelEl.innerHTML = buildPanelHTML(content);
}

/** Hide the inspector panel. */
export function hidePanel(): void {
  if (panelEl && panelEl.parentNode) {
    panelEl.parentNode.removeChild(panelEl);
    panelEl = null;
  }
}

/** Show a brief flash around a re-rendered component. Auto-fades after duration ms. */
export function showRenderFlash(rect: DOMRect, label?: string, duration = 400): void {
  const root = ensureOverlayRoot();

  const flash = document.createElement("div");
  Object.assign(flash.style, {
    position: "fixed",
    top: `${rect.top}px`,
    left: `${rect.left}px`,
    width: `${rect.width}px`,
    height: `${rect.height}px`,
    border: "2px solid #f59e0b",
    backgroundColor: "rgba(245, 158, 11, 0.12)",
    borderRadius: "3px",
    pointerEvents: "none",
    boxSizing: "border-box",
    transition: `opacity ${duration * 0.6}ms ease-out`,
    opacity: "1",
  });
  root.appendChild(flash);

  // Label
  let flashLabel: HTMLDivElement | null = null;
  if (label) {
    flashLabel = document.createElement("div");
    flashLabel.textContent = label;
    Object.assign(flashLabel.style, {
      position: "fixed",
      top: `${Math.max(0, rect.top - 20)}px`,
      left: `${rect.left}px`,
      backgroundColor: "#f59e0b",
      color: "#1a1a2e",
      fontSize: "10px",
      fontFamily: "'SF Mono', 'Fira Code', 'Cascadia Code', monospace",
      fontWeight: "600",
      padding: "1px 5px",
      borderRadius: "3px 3px 0 0",
      pointerEvents: "none",
      whiteSpace: "nowrap",
      lineHeight: "14px",
      transition: `opacity ${duration * 0.6}ms ease-out`,
      opacity: "1",
    });
    root.appendChild(flashLabel);
  }

  // Fade out then remove
  requestAnimationFrame(() => {
    setTimeout(() => {
      flash.style.opacity = "0";
      if (flashLabel) flashLabel.style.opacity = "0";

      setTimeout(() => {
        if (flash.parentNode) flash.parentNode.removeChild(flash);
        if (flashLabel && flashLabel.parentNode) flashLabel.parentNode.removeChild(flashLabel);
      }, duration * 0.6);
    }, duration * 0.4);
  });
}

// ─── Suspense Boundary Overlays ─────────────────────────────

const suspenseBoundaryEls: Map<string, { box: HTMLDivElement; label: HTMLDivElement }> = new Map();

/** Show a persistent overlay around a Suspense boundary. */
export function showSuspenseBoundary(
  boundaryId: string,
  rect: DOMRect,
  label: string,
  status: "pending" | "resolved"
): void {
  const root = ensureOverlayRoot();

  // Remove existing overlay for this boundary
  removeSuspenseBoundary(boundaryId);

  if (status === "resolved") {
    // Show a brief green resolve flash
    const flash = document.createElement("div");
    Object.assign(flash.style, {
      position: "fixed",
      top: `${rect.top}px`,
      left: `${rect.left}px`,
      width: `${rect.width}px`,
      height: `${rect.height}px`,
      border: "2px solid #22c55e",
      backgroundColor: "rgba(34, 197, 94, 0.1)",
      borderRadius: "4px",
      pointerEvents: "none",
      boxSizing: "border-box",
      transition: "opacity 0.6s ease-out",
      opacity: "1",
    });
    root.appendChild(flash);

    const flashLabel = document.createElement("div");
    flashLabel.textContent = label;
    Object.assign(flashLabel.style, {
      position: "fixed",
      top: `${Math.max(0, rect.top - 20)}px`,
      left: `${rect.left}px`,
      backgroundColor: "#22c55e",
      color: "#fff",
      fontSize: "10px",
      fontFamily: "'SF Mono', 'Fira Code', 'Cascadia Code', monospace",
      fontWeight: "600",
      padding: "1px 6px",
      borderRadius: "3px 3px 0 0",
      pointerEvents: "none",
      whiteSpace: "nowrap",
      lineHeight: "14px",
      transition: "opacity 0.6s ease-out",
      opacity: "1",
    });
    root.appendChild(flashLabel);

    setTimeout(() => {
      flash.style.opacity = "0";
      flashLabel.style.opacity = "0";
      setTimeout(() => {
        if (flash.parentNode) flash.parentNode.removeChild(flash);
        if (flashLabel.parentNode) flashLabel.parentNode.removeChild(flashLabel);
      }, 600);
    }, 800);
    return;
  }

  // Pending: dashed purple border
  const box = document.createElement("div");
  Object.assign(box.style, {
    position: "fixed",
    top: `${rect.top}px`,
    left: `${rect.left}px`,
    width: `${rect.width}px`,
    height: `${rect.height}px`,
    border: "2px dashed #a855f7",
    backgroundColor: "rgba(168, 85, 247, 0.06)",
    borderRadius: "4px",
    pointerEvents: "none",
    boxSizing: "border-box",
    animation: "rdk-suspense-pulse 1.5s ease-in-out infinite",
  });
  root.appendChild(box);

  const labelEl = document.createElement("div");
  labelEl.textContent = label;
  Object.assign(labelEl.style, {
    position: "fixed",
    top: `${Math.max(0, rect.top - 20)}px`,
    left: `${rect.left}px`,
    backgroundColor: "#a855f7",
    color: "#fff",
    fontSize: "10px",
    fontFamily: "'SF Mono', 'Fira Code', 'Cascadia Code', monospace",
    fontWeight: "600",
    padding: "1px 6px",
    borderRadius: "3px 3px 0 0",
    pointerEvents: "none",
    whiteSpace: "nowrap",
    lineHeight: "14px",
  });
  root.appendChild(labelEl);

  suspenseBoundaryEls.set(boundaryId, { box, label: labelEl });

  // Inject keyframe animation if not already present
  if (!document.getElementById("rdk-suspense-keyframes")) {
    const style = document.createElement("style");
    style.id = "rdk-suspense-keyframes";
    style.textContent = `
      @keyframes rdk-suspense-pulse {
        0%, 100% { opacity: 0.6; }
        50% { opacity: 1; }
      }
    `;
    document.head.appendChild(style);
  }
}

/** Remove a specific Suspense boundary overlay. */
export function removeSuspenseBoundary(boundaryId: string): void {
  const els = suspenseBoundaryEls.get(boundaryId);
  if (els) {
    if (els.box.parentNode) els.box.parentNode.removeChild(els.box);
    if (els.label.parentNode) els.label.parentNode.removeChild(els.label);
    suspenseBoundaryEls.delete(boundaryId);
  }
}

/** Remove all Suspense boundary overlays. */
export function removeAllSuspenseBoundaries(): void {
  for (const [id] of suspenseBoundaryEls) {
    removeSuspenseBoundary(id);
  }
}

// ─── Layout Debugger Overlays ───────────────────────────────

const layoutOverlayEls: Map<string, HTMLDivElement[]> = new Map();
let spacingOverlayEls: HTMLDivElement[] = [];

const LAYOUT_COLORS: Record<string, { border: string; bg: string }> = {
  flex: { border: "#8b5cf6", bg: "rgba(139, 92, 246, 0.06)" },
  grid: { border: "#06b6d4", bg: "rgba(6, 182, 212, 0.06)" },
  overflow: { border: "#ef4444", bg: "rgba(239, 68, 68, 0.06)" },
};

/** Show a layout overlay (flex/grid/overflow) around an element. */
export function showLayoutOverlay(
  id: string,
  rect: DOMRect,
  type: "flex" | "grid" | "overflow",
  label?: string
): void {
  removeLayoutOverlay(id);
  const root = ensureOverlayRoot();
  const colors = LAYOUT_COLORS[type];
  const elements: HTMLDivElement[] = [];

  const box = document.createElement("div");
  Object.assign(box.style, {
    position: "fixed",
    top: `${rect.top}px`,
    left: `${rect.left}px`,
    width: `${rect.width}px`,
    height: `${rect.height}px`,
    border: `2px ${type === "overflow" ? "dashed" : "solid"} ${colors.border}`,
    backgroundColor: colors.bg,
    borderRadius: "3px",
    pointerEvents: "none",
    boxSizing: "border-box",
  });
  root.appendChild(box);
  elements.push(box);

  if (label) {
    const labelEl = document.createElement("div");
    labelEl.textContent = label;
    Object.assign(labelEl.style, {
      position: "fixed",
      top: `${Math.max(0, rect.top - 18)}px`,
      left: `${rect.left}px`,
      backgroundColor: colors.border,
      color: "#fff",
      fontSize: "9px",
      fontFamily: "'SF Mono', 'Fira Code', 'Cascadia Code', monospace",
      fontWeight: "600",
      padding: "1px 5px",
      borderRadius: "2px 2px 0 0",
      pointerEvents: "none",
      whiteSpace: "nowrap",
      lineHeight: "13px",
    });
    root.appendChild(labelEl);
    elements.push(labelEl);
  }

  layoutOverlayEls.set(id, elements);
}

/** Remove a specific layout overlay. */
export function removeLayoutOverlay(id: string): void {
  const els = layoutOverlayEls.get(id);
  if (els) {
    for (const el of els) {
      if (el.parentNode) el.parentNode.removeChild(el);
    }
    layoutOverlayEls.delete(id);
  }
}

/** Remove all layout overlays. */
export function removeAllLayoutOverlays(): void {
  for (const [id] of layoutOverlayEls) {
    removeLayoutOverlay(id);
  }
}

export interface SpacingValues {
  top: number; right: number; bottom: number; left: number;
}

/** Show spacing overlay (padding = blue, margin = orange) for an element. */
export function showSpacingOverlay(
  rect: DOMRect,
  padding: SpacingValues,
  margin: SpacingValues
): void {
  removeSpacingOverlay();
  const root = ensureOverlayRoot();

  // Margin overlays — orange
  const marginBoxes = [
    { top: rect.top - margin.top, left: rect.left, width: rect.width, height: margin.top },
    { top: rect.top + rect.height, left: rect.left, width: rect.width, height: margin.bottom },
    { top: rect.top - margin.top, left: rect.left - margin.left, width: margin.left, height: rect.height + margin.top + margin.bottom },
    { top: rect.top - margin.top, left: rect.left + rect.width, width: margin.right, height: rect.height + margin.top + margin.bottom },
  ];

  for (const mb of marginBoxes) {
    if (mb.width <= 0 || mb.height <= 0) continue;
    const el = document.createElement("div");
    Object.assign(el.style, {
      position: "fixed",
      top: `${mb.top}px`,
      left: `${mb.left}px`,
      width: `${mb.width}px`,
      height: `${mb.height}px`,
      backgroundColor: "rgba(251, 146, 60, 0.3)",
      pointerEvents: "none",
      boxSizing: "border-box",
    });
    root.appendChild(el);
    spacingOverlayEls.push(el);
  }

  // Padding overlays — blue
  const paddingBoxes = [
    { top: rect.top, left: rect.left, width: rect.width, height: padding.top },
    { top: rect.top + rect.height - padding.bottom, left: rect.left, width: rect.width, height: padding.bottom },
    { top: rect.top + padding.top, left: rect.left, width: padding.left, height: rect.height - padding.top - padding.bottom },
    { top: rect.top + padding.top, left: rect.left + rect.width - padding.right, width: padding.right, height: rect.height - padding.top - padding.bottom },
  ];

  for (const pb of paddingBoxes) {
    if (pb.width <= 0 || pb.height <= 0) continue;
    const el = document.createElement("div");
    Object.assign(el.style, {
      position: "fixed",
      top: `${pb.top}px`,
      left: `${pb.left}px`,
      width: `${pb.width}px`,
      height: `${pb.height}px`,
      backgroundColor: "rgba(96, 165, 250, 0.3)",
      pointerEvents: "none",
      boxSizing: "border-box",
    });
    root.appendChild(el);
    spacingOverlayEls.push(el);
  }

  // Content area outline
  const contentEl = document.createElement("div");
  Object.assign(contentEl.style, {
    position: "fixed",
    top: `${rect.top + padding.top}px`,
    left: `${rect.left + padding.left}px`,
    width: `${rect.width - padding.left - padding.right}px`,
    height: `${rect.height - padding.top - padding.bottom}px`,
    border: "1px dashed rgba(74, 222, 128, 0.6)",
    pointerEvents: "none",
    boxSizing: "border-box",
  });
  root.appendChild(contentEl);
  spacingOverlayEls.push(contentEl);
}

/** Remove spacing overlay. */
export function removeSpacingOverlay(): void {
  for (const el of spacingOverlayEls) {
    if (el.parentNode) el.parentNode.removeChild(el);
  }
  spacingOverlayEls = [];
}

/** Destroy the entire overlay root. */
export function destroyOverlay(): void {
  hideHighlight();
  hidePanel();
  removeAllSuspenseBoundaries();
  removeAllLayoutOverlays();
  removeSpacingOverlay();
  if (overlayRoot && overlayRoot.parentNode) {
    overlayRoot.parentNode.removeChild(overlayRoot);
    overlayRoot = null;
  }
}

// ─── Internal helpers ───────────────────────────────────────

function buildPanelHTML(content: PanelContent): string {
  const propsHTML = formatObject(content.props);
  const stateHTML = formatValue(content.state);

  return `
    <div style="padding: 10px 12px; border-bottom: 1px solid #45475a; display: flex; align-items: center; gap: 8px;">
      <span style="display: inline-block; width: 8px; height: 8px; border-radius: 50%; background: #a6e3a1;"></span>
      <span style="font-weight: 700; color: #89b4fa; font-size: 13px;">&lt;${escapeHTML(content.componentName)}&gt;</span>
    </div>
    <div style="padding: 10px 12px;">
      <div style="color: #f9e2af; font-weight: 600; margin-bottom: 4px;">Props</div>
      <div style="padding-left: 8px; margin-bottom: 12px;">${propsHTML || '<span style="color: #6c7086;">none</span>'}</div>
      <div style="color: #f9e2af; font-weight: 600; margin-bottom: 4px;">State</div>
      <div style="padding-left: 8px;">${stateHTML || '<span style="color: #6c7086;">null</span>'}</div>
    </div>
  `;
}

function formatObject(obj: Record<string, unknown>, depth = 0): string {
  if (!obj || Object.keys(obj).length === 0) return "";
  if (depth > 3) return '<span style="color: #6c7086;">[nested]</span>';

  return Object.entries(obj)
    .filter(([key]) => key !== "children")
    .map(([key, value]) => {
      return `<div style="margin-bottom: 2px;">
        <span style="color: #cba6f7;">${escapeHTML(key)}</span><span style="color: #6c7086;">: </span>${formatValue(value, depth)}
      </div>`;
    })
    .join("");
}

function formatValue(value: unknown, depth = 0): string {
  if (value === null || value === undefined) {
    return `<span style="color: #f38ba8;">${String(value)}</span>`;
  }
  if (typeof value === "string") {
    const truncated = value.length > 50 ? value.slice(0, 50) + "…" : value;
    return `<span style="color: #a6e3a1;">"${escapeHTML(truncated)}"</span>`;
  }
  if (typeof value === "number" || typeof value === "boolean") {
    return `<span style="color: #fab387;">${String(value)}</span>`;
  }
  if (typeof value === "function") {
    return `<span style="color: #74c7ec;">ƒ ${value.name || "anonymous"}</span>`;
  }
  if (Array.isArray(value)) {
    if (depth > 2) return `<span style="color: #6c7086;">[Array(${value.length})]</span>`;
    return `<span style="color: #6c7086;">[${value.length} items]</span>`;
  }
  if (typeof value === "object") {
    if (depth > 2) return `<span style="color: #6c7086;">{…}</span>`;
    return formatObject(value as Record<string, unknown>, depth + 1) || `<span style="color: #6c7086;">{}</span>`;
  }
  return `<span style="color: #cdd6f4;">${String(value)}</span>`;
}

function escapeHTML(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
