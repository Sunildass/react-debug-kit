/**
 * LayoutDemoPanel — Demonstrates flex, grid, and overflow layout patterns
 * for the Layout Debugger to detect and visualize.
 */

export function LayoutDemoPanel() {
  return (
    <div style={{
      background: "#ffffff",
      border: "1px solid #e5e7eb",
      borderRadius: "12px",
      padding: "20px",
      boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
      gridColumn: "1 / -1",
    }}>
      <h3 style={{ margin: "0 0 16px 0", fontSize: "16px", color: "#1a1a2e" }}>
        📐 Layout Demo
      </h3>
      <p style={{ fontSize: "12px", color: "#6c6c8a", marginBottom: "16px" }}>
        Click "📐 Scan Layout" (bottom-right) to highlight flex/grid containers and detect overflow. Toggle "📏 Spacing" to see padding/margin on hover.
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        {/* Flex row */}
        <div>
          <div style={{ fontSize: "11px", color: "#8b5cf6", fontWeight: 600, marginBottom: "6px" }}>
            Flex Row (justify: space-between)
          </div>
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "8px",
            padding: "12px",
            border: "1px dashed #d1d5db",
            borderRadius: "6px",
          }}>
            <div style={{ padding: "8px 16px", background: "#f3f0ff", borderRadius: "4px", fontSize: "12px" }}>Item A</div>
            <div style={{ padding: "8px 16px", background: "#f3f0ff", borderRadius: "4px", fontSize: "12px" }}>Item B</div>
            <div style={{ padding: "8px 16px", background: "#f3f0ff", borderRadius: "4px", fontSize: "12px" }}>Item C</div>
          </div>
        </div>

        {/* Grid */}
        <div>
          <div style={{ fontSize: "11px", color: "#06b6d4", fontWeight: 600, marginBottom: "6px" }}>
            Grid (3 columns)
          </div>
          <div style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            gap: "8px",
            padding: "12px",
            border: "1px dashed #d1d5db",
            borderRadius: "6px",
          }}>
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} style={{
                padding: "10px",
                background: "#ecfeff",
                borderRadius: "4px",
                fontSize: "12px",
                textAlign: "center",
              }}>
                Cell {n}
              </div>
            ))}
          </div>
        </div>

        {/* Overflow example */}
        <div>
          <div style={{ fontSize: "11px", color: "#ef4444", fontWeight: 600, marginBottom: "6px" }}>
            Overflow (horizontal — content wider than container)
          </div>
          <div style={{
            width: "100%",
            overflow: "hidden",
            border: "1px dashed #fca5a5",
            borderRadius: "6px",
            padding: "12px",
          }}>
            <div style={{
              whiteSpace: "nowrap",
              fontSize: "12px",
              color: "#6c6c8a",
            }}>
              This is a very long line of text that intentionally overflows its container to demonstrate the overflow detection feature of the Layout Debugger module. It should be highlighted with a red dashed border when the scanner runs.
            </div>
          </div>
        </div>

        {/* Spacing demo */}
        <div>
          <div style={{ fontSize: "11px", color: "#f59e0b", fontWeight: 600, marginBottom: "6px" }}>
            Spacing Demo (hover with spacing mode on)
          </div>
          <div style={{
            display: "flex",
            gap: "12px",
          }}>
            <div style={{
              padding: "20px",
              margin: "8px",
              background: "#fefce8",
              border: "1px solid #fcd34d",
              borderRadius: "6px",
              fontSize: "12px",
            }}>
              padding: 20px, margin: 8px
            </div>
            <div style={{
              padding: "8px 32px",
              margin: "16px 4px",
              background: "#fefce8",
              border: "1px solid #fcd34d",
              borderRadius: "6px",
              fontSize: "12px",
            }}>
              padding: 8px 32px, margin: 16px 4px
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
