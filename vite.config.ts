import reactRefresh from "@vitejs/plugin-react-refresh";
import istanbul from "rollup-plugin-istanbul";
import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";
import tsconfigPaths from "vite-tsconfig-paths";
import vitePluginImp from "vite-plugin-imp";
import path from 'path';


export default defineConfig(({ mode }) => ({
  css: {
    preprocessorOptions: {
      less: {
        javascriptEnabled: true,
        modifyVars: {
          // "@popover-background": "#2e3238"
          "@btn-primary-color": "var(--font-normal)",
          "@btn-primary-bg": "var(--bg-light)",
          "@label-color": "var(--font-normal)",
          "@input-bg": "var(--bg-bg-light)",
          "@input-color": "var(--font-normal)",
          "@select-item-selected-color": "var(--font-normal)",
          "@select-item-selected-bg": "var(--bg-light)",
          "@select-background": "var(--bg-light)",
          "@select-selection-item-bg": "var(--bg-light)",
          "@select-selection-item-color": "var(--font-normal)",
        },
      }
    }
  },
  plugins: [
    tsconfigPaths(),
    reactRefresh(),
    VitePWA({
      registerType: "autoUpdate",
      manifest: {
        theme_color: "#BD34FE",
        icons: [
          {
            src: "/android-chrome-192x192.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "any maskable",
          },
          {
            src: "/android-chrome-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },
    }),
    vitePluginImp({
      libList: [
        {
          libName: "antd",
          style: (name) => `antd/lib/${name}/style/index.less`,
        },
      ],
    }),
    mode === "test" &&
    istanbul({
      include: ["src/**/*.tsx"],
    }),
  ],
  resolve: {
    alias: {
      "~": path.resolve(__dirname, "./"),
      "@": path.resolve(__dirname, "src"),
    },
  },
}));
