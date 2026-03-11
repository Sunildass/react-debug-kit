import { useRef } from "react";
import { useRenderTracker } from "react-render-reason";

type ProductCardProps = {
  name: string;
  price: number;
  category: string;
};

export function ProductCard(props: ProductCardProps) {
  const { name, price, category } = props;
  const rootRef = useRef<HTMLDivElement>(null);

  // Track renders — will detect which props caused re-renders
  useRenderTracker("ProductCard", props, undefined, rootRef);

  return (
    <div
      ref={rootRef}
      style={{
        background: "#ffffff",
        border: "1px solid #e5e7eb",
        borderRadius: "12px",
        padding: "20px",
        boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
      }}
    >
      <h3 style={{ margin: "0 0 8px 0", fontSize: "16px", color: "#1a1a2e" }}>
        🛍️ {name}
      </h3>
      <p style={{ margin: "0 0 4px 0", fontSize: "14px", color: "#6c6c8a" }}>
        Category: {category}
      </p>
      <p style={{ margin: 0, fontSize: "20px", fontWeight: 700, color: "#059669" }}>
        ${price.toFixed(2)}
      </p>
    </div>
  );
}
