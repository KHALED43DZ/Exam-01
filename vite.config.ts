import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  base: "./",
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["icon.svg"],
      manifest: {
        name: "منشئ الاختبارات للمعلمين",
        short_name: "منشئ الاختبارات",
        description: "إنشاء أوراق اختبارات A4 مع دعم RTL وحفظ المسودات والعمل دون اتصال.",
        lang: "ar",
        dir: "rtl",
        theme_color: "#0f172a",
        background_color: "#f8fafc",
        display: "standalone",
        start_url: "./",
        icons: [
          { src: "icon.svg", sizes: "any", type: "image/svg+xml", purpose: "any maskable" }
        ]
      },
      workbox: {
        navigateFallback: "index.html",
        globPatterns: ["**/*.{js,css,html,svg,png,woff2,ttf,json}"]
      }
    })
  ]
});