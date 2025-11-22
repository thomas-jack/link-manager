export interface Env {
  LINKS_KV: KVNamespace;
  ASSETS: Fetcher; // 来自 wrangler.jsonc 里的 assets.binding = "ASSETS"
}

// 默认数据（防止 KV 里还没东西时前端拿不到结构）
const DEFAULT_DATA = {
  categories: [],
  links: [],
};

async function handleApi(request: Request, env: Env): Promise<Response> {
  const url = new URL(request.url);

  if (url.pathname === "/api/data") {
    if (request.method === "GET") {
      const raw = await env.LINKS_KV.get("APP_DATA");
      return new Response(raw || JSON.stringify(DEFAULT_DATA), {
        headers: { "Content-Type": "application/json" },
      });
    }

    if (request.method === "POST") {
      const body = await request.text();
      // 简单粗暴直接存 JSON 字符串，逻辑交给前端保证格式
      await env.LINKS_KV.put("APP_DATA", body);
      return new Response("OK");
    }

    return new Response("Method Not Allowed", { status: 405 });
  }

  return new Response("Not found", { status: 404 });
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);

    // 1) API 路径：/api/...
    if (url.pathname.startsWith("/api/")) {
      return handleApi(request, env);
    }

    // 2) 静态资源 & 前端路由，全部交给 Static Assets 处理
    //    这会返回 dist 目录里的 index.html / JS / CSS 等
    return env.ASSETS.fetch(request);
  },
};
