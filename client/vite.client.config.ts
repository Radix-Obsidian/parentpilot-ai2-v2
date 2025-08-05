import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    host: "::",
    port: 3000,
  },
  build: {
    outDir: "dist",
    rollupOptions: {
      external: [/^server\//, /^\.\.\/server\//]
    }
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./"),
      "@shared": path.resolve(__dirname, "../shared"),
    },
  },
  optimizeDeps: {
    exclude: ['server/**']
  },
  esbuild: {
    exclude: ['server/**']
  }
});
