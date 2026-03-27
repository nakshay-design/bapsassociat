import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  server: {
    host: "0.0.0.0",
    port: 3000,
    proxy: {
      "/api/wp-acf": {
        target: "https://my.wordpress.net/scope:default/wp-json/wp/v2/pages/18?_fields=acf",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/wp-acf/, ""),
      },
    },
  },
});