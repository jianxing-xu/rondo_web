import reactRefresh from "@vitejs/plugin-react-refresh";
import istanbul from "rollup-plugin-istanbul";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import vitePluginImp from "vite-plugin-imp";
import path from "path";

export default defineConfig(({ mode }) => ({
  base: "rondo",
  css: {
    preprocessorOptions: {
      less: {
        javascriptEnabled: true,
        modifyVars: {
          // "@popover-background": "#2e3238"
          "@btn-primary-color": "var(--font-normal)",
          "@btn-primary-bg": "var(--bg-light)",
          "@label-color": "var(--font-normal)",
          "@input-bg": "var(--bg-main)",
          "@input-color": "var(--font-normal)",
          // "@select-item-selected-color": "var(--font-normal)",
          // "@select-item-selected-bg": "var(--bg-light)",
          "@select-background": "var(--bg-main)",
          "@input-addon-bg": "var(--bg-light)",
          "@modal-header-bg": "var(--bg)",
          "@modal-content-bg": "var(--bg)",
          "@modal-footer-bg": "var(--bg)",
          "@modal-heading-color": "var(--font-normal)",
          // "@select-selection-item-bg": "var(--bg-light)",
          // "@select-selection-item-color": "var(--font-normal)",
        },
      },
    },
  },
  plugins: [
    tsconfigPaths(),
    reactRefresh(),
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
  build: {
    outDir: "rondo",
  },
  resolve: {
    alias: {
      "~": path.resolve(__dirname, "./"),
      "@": path.resolve(__dirname, "src"),
    },
  },
}));
