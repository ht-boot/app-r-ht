// auto-router.js (修正版本)

import fs from "fs";
import path, { resolve, basename, extname } from "path";
import { fileURLToPath } from "url";

// 1. 获取当前脚本的目录名 (ESM 兼容方案)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// --- 路径配置 ---
const PAGES_DIR = resolve(__dirname, "..", "src", "pages");
const ROUTER_PATHS_FILE = resolve(
  __dirname,
  "..",
  "src",
  "router",
  "routes.ts" // 目标文件，假定它一定存在
);

// --- 辅助函数 (保持不变) ---

function formatRouteKey(fileName) {
  return basename(fileName, extname(fileName));
}

function isLazyRoute(entry) {
  // 忽略大小写
  return entry.toLowerCase().includes("react.lazy");
}

function extractRouteKey(entry) {
  // 尝试从 "Key: React.lazy" 或 "404: NotFind" 中提取 Key
  const match = entry.match(/^\s*(\w+|['"]\d\w+['"])\s*:/);
  // 注意: 路由键可能是数字或字符串 (如 '404')
  return match ? match[1].replace(/['"]/g, "") : null;
}

function generateLazyRouteEntry(key) {
  return `  ${key}: React.lazy(() => import("@/pages/${key}")),`;
}

/**
 * 主函数：更新 routerPaths 文件内容
 */
function updateRouterPaths(filename, isFileNowPresent) {
  let existingContent;
  try {
    existingContent = fs.readFileSync(ROUTER_PATHS_FILE, "utf8"); // 读取现有内容
  } catch (error) {
    console.error(
      `[RouterScript] ❌ 读取 routes.ts 文件失败，无法进行更新：`,
      error.message
    );
    return;
  }

  const routerPathsRegex =
    /(const\s+routerPaths\s*:\s*RoutesType\s*=\s*\{)([\s\S]*?)(\}\s*;)/; // 匹配现有内容中的 routerPaths 块
  const match = existingContent.match(routerPathsRegex);
  const p1 = match[1]; // 'const routerPaths: RoutesType = {'
  const p2 = match[2]; // 内部内容
  const p3 = match[3]; // '};'
  const arr = p2.trim().split("\n"); // 过滤掉注释行
  const updateFile = generateLazyRouteEntry(filename); // 生成新的路由条目
  if (isFileNowPresent) {
    arr.push(updateFile); // 添加新的路由条目
  } else {
    const index = arr.findIndex((entry) => extractRouteKey(entry) === filename);
    if (index !== -1) {
      arr.splice(index, 1); // 删除路由条目
    }
  }

  const newContent = `${p1}\n${arr.join("\n")}\n${p3}`;

  const content = existingContent.replace(routerPathsRegex, newContent);

  fs.writeFileSync(ROUTER_PATHS_FILE, content, "utf8");
}

// ------------------------------------------
// --- 监控 pages 目录 开发环境使用 (保持不变) ---
// ------------------------------------------

function watchPagesDirectory() {
  console.log(`[RouterScript] 🚀 首次检查并更新 routes.ts...`);
  updateRouterPaths();
  // 监听目录
  console.log(`[RouterScript] 🚀 正在监控 ${PAGES_DIR} 的文件变化...`);

  fs.watch(PAGES_DIR, (eventType, filename) => {
    if (
      filename &&
      /\.(jsx?|tsx?)$/.test(filename) &&
      (eventType === "rename" || eventType === "change")
    ) {
      const isFileNowPresent = fs.existsSync(PAGES_DIR + "/" + filename); // 检查文件是否存在 创建还是删除文件
      updateRouterPaths(filename, isFileNowPresent);
      console.log(
        `\n[RouterScript] 检测到文件变化 (${eventType}): ${filename}`
      );
    }
  });
}

// 运行监控
watchPagesDirectory();
