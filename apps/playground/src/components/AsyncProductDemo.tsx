import { Suspense, useState, useEffect } from "react";

// ─── Simulated async data fetching using React Suspense pattern ───

interface Product {
  id: number;
  name: string;
  price: number;
}

// Simple cache for suspense-style data fetching
const cache: Map<string, { status: string; result?: any; promise?: Promise<any> }> = new Map();

function fetchProducts(delayMs: number): Product[] {
  const key = `products-${delayMs}`;
  const entry = cache.get(key);

  if (entry) {
    if (entry.status === "resolved") return entry.result;
    if (entry.status === "pending") throw entry.promise;
  }

  const promise = new Promise<Product[]>((resolve) => {
    setTimeout(() => {
      resolve([
        { id: 1, name: "Widget Pro", price: 19.99 },
        { id: 2, name: "Gadget Ultra", price: 49.99 },
        { id: 3, name: "Thingamajig", price: 9.99 },
      ]);
    }, delayMs);
  });

  const newEntry = { status: "pending", promise } as any;
  cache.set(key, newEntry);

  promise.then((result) => {
    newEntry.status = "resolved";
    newEntry.result = result;
  });

  throw promise;
}

function fetchReviews(delayMs: number): string[] {
  const key = `reviews-${delayMs}`;
  const entry = cache.get(key);

  if (entry) {
    if (entry.status === "resolved") return entry.result;
    if (entry.status === "pending") throw entry.promise;
  }

  const promise = new Promise<string[]>((resolve) => {
    setTimeout(() => {
      resolve([
        "☆☆☆☆☆ Excellent product!",
        "☆☆☆☆ Very good value.",
        "☆☆☆☆☆ Would recommend!",
      ]);
    }, delayMs);
  });

  const newEntry = { status: "pending", promise } as any;
  cache.set(key, newEntry);

  promise.then((result) => {
    newEntry.status = "resolved";
    newEntry.result = result;
  });

  throw promise;
}

// ─── Components ─────────────────────────────────────────────

function ProductList({ delayMs }: { delayMs: number }) {
  const products = fetchProducts(delayMs);

  return (
    <div>
      <div style={{ marginBottom: "16px" }}>
        {products.map((p) => (
          <div key={p.id} style={{
            padding: "8px 0",
            borderBottom: "1px solid #e5e7eb",
            display: "flex",
            justifyContent: "space-between",
            fontSize: "13px",
          }}>
            <span>{p.name}</span>
            <span style={{ color: "#059669", fontWeight: 600 }}>${p.price.toFixed(2)}</span>
          </div>
        ))}
      </div>
      
      {/* Nested Suspense boundary: loads in 2000ms after products load (creates waterfall) */}
      <div style={{ background: "#f8fafc", padding: "16px", borderRadius: "8px", border: "1px dashed #cbd5e1" }}>
        <h4 style={{ margin: "0 0 8px 0", fontSize: "13px", color: "#a855f7" }}>Customer Reviews (2000ms delay)</h4>
        <Suspense fallback={<LoadingSpinner label="Loading reviews..." />}>
          <ReviewList delayMs={2000} />
        </Suspense>
      </div>
    </div>
  );
}

function ReviewList({ delayMs }: { delayMs: number }) {
  const reviews = fetchReviews(delayMs);

  return (
    <div>
      {reviews.map((r, i) => (
        <div key={i} style={{ padding: "4px 0", fontSize: "12px", color: "#6c6c8a" }}>
          {r}
        </div>
      ))}
    </div>
  );
}

function LoadingSpinner({ label }: { label: string }) {
  return (
    <div style={{
      padding: "24px",
      textAlign: "center",
      color: "#a855f7",
      fontSize: "13px",
    }}>
      <div style={{
        display: "inline-block",
        width: "20px",
        height: "20px",
        border: "2px solid #e5e7eb",
        borderTopColor: "#a855f7",
        borderRadius: "50%",
        animation: "rdk-spin 0.8s linear infinite",
        marginBottom: "8px",
      }} />
      <div>{label}</div>
      <style>{`
        @keyframes rdk-spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

// ─── Main Demo ──────────────────────────────────────────────

export function AsyncProductDemo() {
  const [showContent, setShowContent] = useState(false);

  // Reset cache when toggling
  const handleToggle = () => {
    if (!showContent) {
      cache.clear();
    }
    setShowContent((s) => !s);
  };

  return (
    <div style={{
      background: "#ffffff",
      border: "1px solid #e5e7eb",
      borderRadius: "12px",
      padding: "20px",
      boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
      gridColumn: "1 / -1",
    }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
        <h3 style={{ margin: 0, fontSize: "16px", color: "#1a1a2e" }}>
          ⏳ Suspense Demo
        </h3>
        <button
          onClick={handleToggle}
          style={{
            padding: "6px 16px",
            borderRadius: "6px",
            border: "none",
            background: showContent ? "#ef4444" : "#a855f7",
            color: "#fff",
            cursor: "pointer",
            fontSize: "12px",
            fontWeight: 600,
          }}
        >
          {showContent ? "Reset" : "Load Data"}
        </button>
      </div>

      <p style={{ fontSize: "12px", color: "#6c6c8a", marginBottom: "16px" }}>
        Click "Load Data" to trigger Suspense boundaries. Watch the purple overlays and resolve timing in the console.
      </p>

      {showContent && (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {/* First boundary: loads in 800ms */}
          <div>
            <h4 style={{ margin: "0 0 8px 0", fontSize: "13px", color: "#a855f7" }}>Products (800ms)</h4>
            <Suspense fallback={<LoadingSpinner label="Loading products..." />}>
              <ProductList delayMs={800} />
            </Suspense>
          </div>
        </div>
      )}
    </div>
  );
}
