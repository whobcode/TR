# Test Runner (TR)

Run HTTP integration checks against any API endpoints and get a pass/fail dashboard — on Cloudflare
Workers (TypeScript + Hono). Checks run server-side in parallel from Cloudflare's edge, so no CORS
limits and no local setup. Originally specced for Python script API integrations; rebuilt as a
language-agnostic HTTP test runner on Cloudflare.

## Features
- Define a suite of checks as JSON (URL, method, headers, body, timeout)
- Assertions: `expectStatus`, `expectBodyContains`, `expectJsonPath` (dot-path equals)
- Parallel execution with per-check duration + failure reasons
- Summary dashboard (passed / failed / total)

## Run
```bash
npm install
npm run dev
```

## Deploy
```bash
npm run deploy
```

## API
- `POST /api/run` `{ checks: Check[] }` → `{ total, passed, failed, results[] }`

`Check = { name?, url, method?, headers?, body?, expectStatus?, expectBodyContains?, expectJsonPath?:{path,equals}, timeoutMs? }`

## Stack
Cloudflare Workers · Hono
