import { defineConfig } from "vite";
import VitePluginVue from "@vitejs/plugin-vue";

export default defineConfig({
  server: {
    host: "0.0.0.0",
    port: 3000
  },
  build: {
    rollupOptions: {
      input: __dirname + "/entrypoints/client.js"
    }
  },
  plugins: [
    VitePluginVue()
  ]
});
