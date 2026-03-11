# React Debug Kit

**React Debug Kit** is a modular developer debugging toolkit designed for modern React applications. It provides powerful in-app visual debugging utilities that run directly inside your browser UI during development, acting as an essential companion to the React DevTools.

By integrating seamlessly with the React Fiber tree, React Debug Kit gives you deep insights into component state, re-rendering behavior, Suspense boundaries, and layout issues—all without leaving your app visually.

---

## Feature Overview

*   **Click to Inspect:** Click any component visually to inspect its current props and state.
*   **Re-render Tracking:** See exactly why components re-render with visual flashes and detailed reason logs.
*   **Suspense Visualization:** Visualize Suspense boundaries, detect loading waterfalls, and track fallback durations.
*   **Layout Debugging:** Detect layout issues like overflow, highlight flex/grid containers, and visualize margin/padding spacing.
*   **Modular Architecture:** Use only the debugging modules you need.
*   **Zero Production Impact:** Designed exclusively for development mode; strips completely from production builds.

---

## Sub-modules

The toolkit provides the following **debugging modules directly inside your React applications**.

### Live Component Inspector

Developers can click components directly in the UI to inspect their live props and state without hunting through the React DevTools tree.

### Render Reason Debugger

See exactly why a component re-rendered, with visual flashes and detailed logs showing which props or state changed.

### Suspense Debugger

Visualize React Suspense boundaries, track fallback durations, and detect sequential loading waterfalls.

### Layout Debugger

Detect layout issues instantly by highlighting flex/grid layouts, catching overflow conditions, and visualizing element spacing.

---

## Installation

Install the core kit and the modules you wish to use as development dependencies.

Using **npm**:
```bash
npm install -D react-debug-kit react-live-inspect react-render-reason react-suspense-debugger react-layout-debugger
```

Using **yarn**:
```bash
yarn add -D react-debug-kit react-live-inspect react-render-reason react-suspense-debugger react-layout-debugger
```

Using **pnpm**:
```bash
pnpm add -D react-debug-kit react-live-inspect react-render-reason react-suspense-debugger react-layout-debugger
```

---

## Basic Usage

To enable the debug kit, simply import the desired modules and drop them into your application's root component.

```tsx
import React from 'react';
import { LiveInspect } from 'react-live-inspect';
import { SuspenseDebugger } from 'react-suspense-debugger';
import { LayoutDebugger } from 'react-layout-debugger';

import MyApplication from './MyApplication';

function App() {
  return (
    <>
      <LiveInspect />
      <SuspenseDebugger />
      <LayoutDebugger>
        <MyApplication />
      </LayoutDebugger>
    </>
  );
}

export default App;
```

> **Note:** The toolkit runs **only** in development mode. In production, these wrapper components render their children directly and visual tools remain completely inactive.

---

## Module Overview

### `react-live-inspect`

Visually select components in your application to inspect their live props and state without hunting through the React DevTools tree.

```tsx
import { LiveInspect } from 'react-live-inspect';

function App() {
  return (
    <>
      <LiveInspect />
      <AppContent />
    </>
  );
}
```

### `react-render-reason`

Understand why your components are re-rendering. It visually highlights components as they update and logs the exact prop or state changes that triggered the render.

```tsx
import { RenderReason } from 'react-render-reason';

function App() {
  return (
    <>
      <RenderReason />
      <AppContent />
    </>
  );
}
```

### `react-suspense-debugger`

Visualize React Suspense boundaries. It draws overlays indicating pending and resolved states, measures exact fallback durations, and detects sequential loading waterfalls.

```tsx
import { SuspenseDebugger } from 'react-suspense-debugger';

function App() {
  return (
    <>
      <SuspenseDebugger />
      <AppContent />
    </>
  );
}
```

### `react-layout-debugger`

Detect structural issues instantly. Identify flex/grid layouts, catch horizontal or vertical overflow conditions, and visualize element spacing (margin and padding) via a built-in UI panel.

```tsx
import { LayoutDebugger } from 'react-layout-debugger';

function App() {
  // Wrap your app to provide the layout scanning context
  return (
    <LayoutDebugger>
      <AppContent />
    </LayoutDebugger>
  );
}
```

---

## Configuration

Most modules work zero-config out of the box. Future releases will introduce granular configuration options (such as custom hotkeys, overlay styling parameters, and ignored component lists) exposed via a central `DebugProvider`.

---

## Development Mode Behavior

React Debug Kit is strictly for development. 
All modules verify the environment using `process.env.NODE_ENV`. If the environment is set to `'production'`, the modules return `null` or raw children, ensuring absolute zero overhead, zero layout shifts, and zero bundle bloat in your deployed applications.

---

## Playground Example

We provide a comprehensive playground environment demonstrating all modules in action. To run it locally:

1. Clone the repository.
2. Run `pnpm install` in the root.
3. Run `pnpm --filter playground dev`.
4. Open the local server URL to interact with the Suspense demos, layout overflow examples, and live inspection tools.

---

## Architecture Overview

React Debug Kit is built as a monorepo leveraging shared core services exported by the `react-debug-kit` package. The core architecture includes:

*   **Overlay Engine:** A unified, lightweight canvas and DOM overlay system to render bounding boxes, highlights, and tooltips safely above the app layer.
*   **Fiber Inspector:** Utilities to traverse and interpret the internal React Fiber tree, allowing modules to locate Suspense boundaries, extract component names, and detect rendering phases.
*   **Event Bus:** A type-safe event emitter allowing decoupled modules to communicate (e.g., a scanner emitting a `layout_issue_detected` event caught by an overlay renderer).
*   **Hotkey Manager:** A centralized registry for keyboard shortcuts so modules do not conflict over global key bindings.

Modules build cleanly on top of this shared infrastructure, ensuring a consistent developer experience and efficient resource usage.

---

## Performance Considerations

*   **Development Only:** Never affects your production users.
*   **On-Demand Execution:** Heavy operations, like layout scanning, are triggered manually by the developer rather than running continuously.
*   **Lightweight Overlays:** Visual elements are rendered in a dedicated root portal separated from your application's DOM, avoiding unintended CSS inheritance or layout thrashing.
*   **Throttled Polling:** Scanners (like the Suspense tracker) use highly optimized, low-frequency polling intervals.

---

## Contributing

We welcome contributions! Whether it's adding a new debugging module, optimizing the Fiber traversal, or improving documentation, your help is appreciated.

Please carefully read the foundational documentation in the `/docs` directory (including our architecture overview and coding standards) before opening pull requests.

---

## Roadmap

We are constantly exploring new ways to improve the React developer experience. Upcoming modules on our roadmap include:

*   **Performance Monitor:** FPS tracking and long-task detection.
*   **Memory Leak Detector:** Spot unmounted components that remain in memory.
*   **Context Profiler:** Trace deeply nested Context API updates.
*   **Chrome DevTools Extension:** A dedicated companion tab for deeper data analysis natively within the browser.

---

## License

This project is licensed under the MIT License.
