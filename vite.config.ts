import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  server: {
    open: true, // 自動でブラウザを開く
    port: 3000, // ここでポート番号を指定します
  },
  build: {
    outDir: "dist", // ビルドの出力先ディレクトリ
    chunkSizeWarningLimit: 50000,
  },
  plugins: [react()],
});
