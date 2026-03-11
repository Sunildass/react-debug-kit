/**
 * Hotkey Manager — Global keyboard shortcut handler.
 *
 * Registers keydown listeners for debugging shortcuts and emits
 * corresponding events through the Event Bus.
 */

import { eventBus } from "./event-bus";

export interface HotkeyCombo {
  key: string;
  ctrl?: boolean;
  shift?: boolean;
  alt?: boolean;
  meta?: boolean;
}

type HotkeyCallback = () => void;

interface RegisteredHotkey {
  combo: HotkeyCombo;
  callback: HotkeyCallback;
}

class HotkeyManager {
  private hotkeys: RegisteredHotkey[] = [];
  private boundHandler: ((e: KeyboardEvent) => void) | null = null;

  /** Start listening for keyboard events. */
  init(): void {
    if (this.boundHandler) return; // already initialised

    this.boundHandler = this.handleKeyDown.bind(this);
    document.addEventListener("keydown", this.boundHandler);

    // Register default shortcuts
    this.register(
      { key: "d", ctrl: true, shift: true },
      () => eventBus.emit("toggle_debug_panel")
    );
    this.register(
      { key: "i", ctrl: true, shift: true },
      () => eventBus.emit("toggle_inspect_mode")
    );
  }

  /** Stop listening and remove all hotkeys. */
  destroy(): void {
    if (this.boundHandler) {
      document.removeEventListener("keydown", this.boundHandler);
      this.boundHandler = null;
    }
    this.hotkeys = [];
  }

  /** Register a new keyboard shortcut. */
  register(combo: HotkeyCombo, callback: HotkeyCallback): void {
    this.hotkeys.push({ combo, callback });
  }

  /** Unregister a keyboard shortcut. */
  unregister(combo: HotkeyCombo): void {
    this.hotkeys = this.hotkeys.filter(
      (hk) => !this.comboMatches(hk.combo, combo)
    );
  }

  private handleKeyDown(e: KeyboardEvent): void {
    for (const { combo, callback } of this.hotkeys) {
      if (this.eventMatchesCombo(e, combo)) {
        e.preventDefault();
        e.stopPropagation();
        callback();
        return;
      }
    }
  }

  private eventMatchesCombo(e: KeyboardEvent, combo: HotkeyCombo): boolean {
    return (
      e.key.toLowerCase() === combo.key.toLowerCase() &&
      !!e.ctrlKey === !!combo.ctrl &&
      !!e.shiftKey === !!combo.shift &&
      !!e.altKey === !!combo.alt &&
      !!e.metaKey === !!combo.meta
    );
  }

  private comboMatches(a: HotkeyCombo, b: HotkeyCombo): boolean {
    return (
      a.key.toLowerCase() === b.key.toLowerCase() &&
      !!a.ctrl === !!b.ctrl &&
      !!a.shift === !!b.shift &&
      !!a.alt === !!b.alt &&
      !!a.meta === !!b.meta
    );
  }
}

export const hotkeyManager = new HotkeyManager();

export { HotkeyManager };
