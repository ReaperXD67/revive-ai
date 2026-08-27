# Engineering and security audit

Audit date: 27 August 2026  
Scope: public recruiter demo, React client, native Next.js route handlers, decision engine, private Blob persistence, deployment configuration, dependencies, and the main user journey.

## Verdict

- **Public recruiter demo:** ship. The current deployment is public, the main flow is verified end to end, production dependencies have zero known audit findings, and the backend health check reports operational.
- **Real merchant pilot:** no-ship until authentication/tenant isolation, rate limiting, an execution outbox, per-subscription locking, real Razorpay test-mode adapters, and operational monitoring are implemented.

## Fixed findings

### REV-SEC-001 — Runtime input was trusted as TypeScript

- Severity: High
- Location: `app/api/recovery/simulate/route.ts:7-61`; `lib/recovery-input.ts:4-26`
- Evidence: the original route cast `request.json()` to a partial event and only checked four truthy properties.
- Impact: malformed types, negative values, unknown actions, oversized bodies, and extra properties could cross the trust boundary.
- Fix: strict Zod validation, numeric bounds, identifier constraints, JSON/media-type checks, 4 KiB raw-byte limit, sanitized errors, and tests.
- Verification: `lib/recovery-input.test.ts`; live invalid-input probes return 4xx.

### REV-SEC-002 — Webhook-security claims were architecture-only

- Severity: Medium
- Location: `app/api/webhooks/razorpay/route.ts:1-60`; `lib/webhook-security.ts:1-28`
- Evidence: no webhook route existed even though the product described signed ingestion.
- Impact: a production-shaped integration could have accepted spoofed or replayed events.
- Fix: raw-body HMAC-SHA256 verification, strict signature format, secret fail-closed behavior, event-ID requirement, 64 KiB limit, payload hashing, and a durable duplicate key.
- Verification: `lib/webhook-security.test.ts`; the live endpoint rejects an invalid signature with HTTP 401.

### REV-REL-001 — Idempotency key existed without durable enforcement

- Severity: Medium
- Location: `lib/server/audit-store.ts`
- Evidence: the engine returned an idempotency string but no datastore enforced uniqueness.
- Impact: concurrent or repeated delivery could create repeated decisions after isolate restarts.
- Fix: deterministic SHA-256 object paths, private immutable Vercel Blob writes, event-key deduplication, and a storage health probe.
- Verification: the public `/api/health` reports private storage operational; a first write returns `stored` and the repeated logical key returns `duplicate_suppressed`.

### REV-UX-001 — UI could claim recovery after API failure

- Severity: Medium
- Location: `app/page.tsx:104-139` and `app/page.tsx:306-309`
- Evidence: the original client ignored the fetch response and let its timer reach the success state inside a catch block.
- Impact: the demo could display recovered revenue while its only backend call failed.
- Fix: success now requires an HTTP-success response containing a plan; failures stop animation and explicitly state that no recovery was claimed. The success panel shows policy, immutable persistence, confidence, mode, and a request proof ID.
- Verification: the deployed flow reached “Simulated payment captured,” showed `stored`, and emitted no console warnings/errors.

### REV-POL-001 — Quiet-hour scheduling used UTC

- Severity: Medium
- Location: `lib/recovery-engine.ts:24-32`, `lib/recovery-engine.ts:53-63`, `lib/recovery-engine.ts:93-103`
- Evidence: `getUTCHours()` was compared directly with a policy described as Asia/Kolkata.
- Impact: a customer could be contacted during Indian quiet hours.
- Fix: the policy now carries an explicit Asia/Kolkata offset and converts both into and out of policy-local time.
- Verification: two boundary tests cover late-night and early-morning IST scheduling.

### REV-SEC-003 — No repository-owned security-header baseline

- Severity: Medium
- Location: `lib/security-headers.ts:1-8`; `proxy.ts:1-11`; `next.config.ts:1-9`
- Evidence: CSP, frame protection, MIME sniffing protection, referrer policy, permissions policy, and HSTS were absent from application code.
- Impact: weaker browser defense in depth and no auditable header contract.
- Fix: a centralized header set is applied by both framework configuration and runtime proxy.
- Verification: the public deployment returns CSP, `X-Frame-Options: DENY`, and `X-Content-Type-Options: nosniff`.

### REV-SUP-001 — No automated repository gate

- Severity: Low
- Location: `.github/workflows/ci.yml:1-29`; `.github/dependabot.yml`
- Evidence: no CI workflow was present.
- Impact: regressions and dependency advisories could merge without automated evidence.
- Fix: reproducible `npm ci`, lint, 95%+ unit coverage, production build, production-dependency audit, least-privilege workflow permissions, concurrency cancellation, and Dependabot.

## Residual production blockers

### REV-AUTH-001 — Public demo has no merchant authentication or tenant isolation

- Severity: High for real data; accepted for a fictional public demo.
- Impact: a real integration could expose or mutate another merchant's cases.
- Required fix: server-enforced identity, merchant-scoped rows/queries/credentials, role-based approvals, and cross-tenant integration tests.

### REV-ABUSE-001 — Rate limiting is not visible in application code

- Severity: Medium
- Impact: public endpoints can be spammed even though body sizes and work per request are bounded.
- Required fix: edge rate limits keyed by route/IP/merchant plus dashboards and alert thresholds. Verify any platform WAF separately; do not assume it.

### REV-EXEC-001 — No real action outbox or per-subscription lock

- Severity: High for real payment execution.
- Impact: a database write and an external retry/link/message could diverge or race.
- Required fix: transactional outbox, leased worker, action-result reconciliation, per-subscription state-machine lock, retry taxonomy, and dead-letter replay.

### REV-CSP-001 — CSP permits inline framework bootstrap

- Severity: Medium defense-in-depth limitation.
- Impact: `unsafe-inline` weakens script CSP if an HTML-injection bug is introduced later.
- Required fix: move to nonce/hash-based framework bootstrapping before handling untrusted rich content. Current React rendering uses no raw-HTML sink.

### REV-A11Y-001 — Dense operations typography and modal focus containment need a dedicated pass

- Severity: Low for demo; important before customer rollout.
- Impact: low-vision and keyboard-only users may find dense tables or dialogs harder to operate.
- Current controls: semantic buttons/labels, focus-visible styling, Escape close, reduced-motion support, and responsive layouts.
- Required fix: raise the smallest text tokens, trap/restore focus for dialogs, add automated axe checks, and test 200% zoom.

## Verification evidence

- 14 unit tests passing.
- 16 tests with 95.75% line coverage, 91.23% branch coverage, and 100% function coverage across the core tested modules.
- Lint passes.
- Native Next.js production build passes with three API routes.
- `npm audit --omit=dev` reports zero vulnerabilities.
- Public health endpoint: HTTP 200, decision engine operational, private Vercel Blob operational.
- Public invalid-signature probe: HTTP 401.
- Runtime headers verified on the public deployment.
- Browser flow verified: command center → live demo → hosted decision → immutable audit proof → simulated success; no browser warnings/errors.

The reusable adversarial review prompt is in [`ENGINEERING_REVIEW_PROMPT.md`](ENGINEERING_REVIEW_PROMPT.md).
