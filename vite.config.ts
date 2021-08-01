import reactRefresh from "@vitejs/plugin-react-refresh";
import istanbul from "rollup-plugin-istanbul";
import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig(({ mode }) => ({
  css: {
    preprocessorOptions: {
      less: {
        javascriptEnabled: true
      }
    }
  },
  build: {
    assetsInlineLimit: 8 * 1024,
    outDir: 'build',
    assetsDir: 'assets',
    sourcemap: 'inline'
  },
  define: {
    'process.env.RUN_ENV': JSON.stringify(''),
    'process.env.NODE_ENV': JSON.stringify('development')
  },
  server: {
    // port: PORT
    // proxy
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
    mode === "test" &&
    istanbul({
      include: ["src/**/*.tsx"],
    }),
  ],
}));
