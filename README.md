# Link Manager

一个部署在 Cloudflare Workers 上的轻量级链接管理工具。

- 前端：React + TypeScript + Vite + TailwindCSS
- 后端：Cloudflare Workers
- 数据持久化：Cloudflare KV（命名空间：`LINKS_KV`）
- 特性：
  - 支持分类管理链接
  - 支持子链接（比如 GitHub 的 Issues / PRs 快捷入口）
  - 搜索标题 / 描述 / 子链接
  - 拖拽排序分类和链接
  - 数据备份 / 导入导出（JSON）

线上 Demo（我的实例）：  
👉 https://link-manager.morty626.workers.dev

## 一键部署到 Cloudflare

你需要：

- 一个 Cloudflare 账号
- 一个绑定了支付方式的账户（免费套餐即可）

点击下方按钮即可一键部署到你自己的 Cloudflare 账户中：

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/morty626/link-manager)

部署流程（Cloudflare 端大致会做的事情）：

1. 读取本仓库代码
2. 按 `wrangler.jsonc` 创建：
   - 一个 Workers 服务：`link-manager`
   - 一个 KV 命名空间：`LINKS_KV`
   - 上传 `dist/` 里的静态资源为 Assets
3. 自动生成类似 `https://xxx.workers.dev` 的访问地址

## 截图

首页界面：

![Link Manager 首页界面](./docs/images/screenshot-home.png)

## 本地开发

```bash
# 安装依赖
npm install

# 本地开发（只跑前端 Vite，走 localStorage 模式）
npm run dev

# 构建前端
npm run build

# 本地模拟 Cloudflare Workers（会使用构建后的 dist 资源 + 本地 KV）
npx wrangler dev
```

访问：

- Vite 开发服务器：`http://localhost:5173`
- Wrangler Dev（完整 Worker + 静态资源）：`http://localhost:8787`

## 技术说明

### 数据存储

前端通过同源接口 `/api/data` 与 Worker 通信：

- `GET /api/data`：从 KV 中读取 `{ categories, links }`
- `POST /api/data`：将最新的 `{ categories, links }` 写入 KV

在 Worker 中，通过 `env.LINKS_KV` 访问 KV，逻辑在 `worker/index.ts` 中实现。

在 Cloudflare KV/Workers 无法访问时（比如本地只跑 `npm run dev`），前端会自动回退到浏览器 `localStorage`，保证功能可用。

### 部署到自定义域名（可选）

部署成功后，可以在 Cloudflare 后台为 Worker 绑定自定义域名，例如：

- `link-manager.xxxxx.com`

路径：
**Workers & Pages → 选择你的 Worker → Custom Domains → Add custom domain**

填入你想要的子域名，例如 `link-manager.xxxxx.com` 即可。

---

## License

MIT
