import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true,
  },
  define: {
    "process.env.NODE_ENV": JSON.stringify("development"),
  },
  resolve: {
    dedupe: ["react", "react-dom"],
  },
  optimizeDeps: {
    exclude: [
      "react-debug-kit",
      "react-live-inspect",
      "react-render-reason",
      "react-suspense-debugger",
      "react-layout-debugger"
    ],
  },
});
