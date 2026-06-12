import { defineConfigSchema, defineDataSources } from "@fgate/template-sdk";
import { fgateTemplateManifest } from "@fgate/template-sdk/vite-plugin";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

import packageJson from "./package.json";

/** manifest.json 的静态元信息，构建时与 dataSources/configSchema 一起生成 manifest.json */
const meta = {
  author: packageJson.author,
  description: packageJson.description,
  id: packageJson.name.replace(/^@fgate\/template-/, ""),
  name: "在线玩家列表",
  version: packageJson.version,
  viewport: "auto" as const,
};

/** 与 manifest.json 的 dataSources 一致，构建时由 vite 插件写入 manifest.json */
export const dataSources = defineDataSources([
  { id: "onlinePlayers", required: true, type: "online_players" },
]);

/** 与 manifest.json 的 configSchema 一致，构建时由 vite 插件写入 manifest.json */
export const configSchema = defineConfigSchema([
  { default: "在线玩家", key: "title", label: "标题", type: "string" },
]);

/** 与 manifest.json 的 networkPermissions 一致，构建时由 vite 插件写入 manifest.json */
const networkPermissions = [
  { origin: "https://mc-heads.net", reason: "渲染玩家头像（皮肤渲染服务）" },
];

// 渲染环境通过 file:// 打开 dist/index.html，资源路径必须是相对路径
export default defineConfig({
  base: "./",
  build: {
    outDir: "dist",
  },
  plugins: [
    react(),
    tailwindcss(),
    fgateTemplateManifest({
      configSchema,
      dataSources,
      meta,
      networkPermissions,
    }),
  ],
});
