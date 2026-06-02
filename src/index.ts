import { Hono } from "hono";

type Bindings = { ASSETS: Fetcher };
const app = new Hono<{ Bindings: Bindings }>();

interface Check {
  name?: string;
  url: string;
  method?: string;
  headers?: Record<string, string>;
  body?: string;
  expectStatus?: number;
  expectBodyContains?: string;
  expectJsonPath?: { path: string; equals: unknown }; // dot path e.g. "data.0.id"
  timeoutMs?: number;
}

interface CheckResult {
  name: string; url: string; ok: boolean; status: number | null; durationMs: number; failures: string[];
}

function getPath(obj: any, path: string): unknown {
  return path.split(".").reduce((o, k) => (o == null ? undefined : o[k]), obj);
}

async function runCheck(check: Check): Promise<CheckResult> {
  const name = check.name || `${check.method || "GET"} ${check.url}`;
  const failures: string[] = [];
  const started = Date.now();
  let status: number | null = null;
  try {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), check.timeoutMs ?? 10000);
    const res = await fetch(check.url, {
      method: check.method || "GET",
      headers: check.headers,
      body: check.body,
      signal: ctrl.signal,
    });
    clearTimeout(t);
    status = res.status;
    const text = await res.text();
    if (check.expectStatus != null && res.status !== check.expectStatus)
      failures.push(`expected status ${check.expectStatus}, got ${res.status}`);
    if (check.expectBodyContains && !text.includes(check.expectBodyContains))
      failures.push(`body did not contain "${check.expectBodyContains}"`);
    if (check.expectJsonPath) {
      try {
        const json = JSON.parse(text);
        const actual = getPath(json, check.expectJsonPath.path);
        if (JSON.stringify(actual) !== JSON.stringify(check.expectJsonPath.equals))
          failures.push(`json ${check.expectJsonPath.path}: expected ${JSON.stringify(check.expectJsonPath.equals)}, got ${JSON.stringify(actual)}`);
      } catch { failures.push("response was not valid JSON for expectJsonPath"); }
    }
  } catch (e: any) {
    failures.push(e.name === "AbortError" ? "timed out" : `request error: ${e.message}`);
  }
  return { name, url: check.url, ok: failures.length === 0, status, durationMs: Date.now() - started, failures };
}

// POST /api/run { checks: Check[] } -> run all (in parallel) and summarize.
app.post("/api/run", async (c) => {
  const body = (await c.req.json().catch(() => null)) as { checks?: Check[] } | null;
  if (!body?.checks || !Array.isArray(body.checks) || body.checks.length === 0)
    return c.json({ error: "checks: Check[] required" }, 400);
  if (body.checks.length > 50) return c.json({ error: "max 50 checks per run" }, 413);
  const results = await Promise.all(body.checks.map(runCheck));
  const passed = results.filter((r) => r.ok).length;
  return c.json({ total: results.length, passed, failed: results.length - passed, results });
});

export default app;
