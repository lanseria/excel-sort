import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig({
  base: "/excel-sort/",
  build: {
    outDir: "docs",
  },
  plugins: [
    vue(),
    VitePWA({
      base: "/excel-sort/",
      manifest: {
        name: "@lanseria/excel-sort",
        short_name: "表格排序",
        description: "表格排序.",
        start_url: "/excel-sort/",
        display: "standalone",
        background_color: "#fff",
        theme_color: "#3eaf7c",
        icons: [
          {
            src: "./images/icons/android-chrome-96x96.png",
            sizes: "96x96",
            type: "image/png",
          },
        ],
      },
    }),
  ],
});
