# Revive

**Autonomous revenue recovery for failed recurring payments.**

[![Live demo](https://img.shields.io/badge/live-Vercel-d8ff4f?style=flat-square&labelColor=17201d)](https://revive-revenue.vercel.app)
[![CI](https://img.shields.io/github/actions/workflow/status/ReaperXD67/revive-ai/ci.yml?branch=main&style=flat-square&label=CI)](https://github.com/ReaperXD67/revive-ai/actions/workflows/ci.yml)
[![Tests](https://img.shields.io/badge/tests-14_passing-d8ff4f?style=flat-square&labelColor=17201d)](#engineering-evidence)
[![Coverage](https://img.shields.io/badge/core_coverage-95.24%25-d8ff4f?style=flat-square&labelColor=17201d)](#engineering-evidence)
[![Production audit](https://img.shields.io/badge/prod_dependencies-0_vulnerabilities-d8ff4f?style=flat-square&labelColor=17201d)](#engineering-evidence)
[![License](https://img.shields.io/badge/license-MIT-3178c6?style=flat-square)](LICENSE)

[![Revive revenue command center](docs/assets/revive-command-center.png)](https://revive-revenue.vercel.app)

> [Open the public product](https://revive-revenue.vercel.app) · [Check the hosted backend](https://revive-revenue.vercel.app/api/health) · [Read the API contract](docs/openapi.yaml) · [Use the five-minute pitch prompt](docs/PITCH_PROMPT.md)

## The one-minute pitch

A low balance, revoked UPI mandate, expired card, bank outage, authentication requirement, and network timeout are all “failed payments”—but they should not trigger the same recovery action.

Revive turns Razorpay subscription/payment failures into explainable recovery plans. It classifies the failure, selects a rail-aware next action, runs deterministic trust policies, persists an audit record, and measures incremental uplift against a holdout. Models can recommend; policies authorize.

The result is an operations product built around three promises:

1. **Recover intelligently.** Retry timing, payment rail, issuer health, customer value, and failure semantics shape the next action.
2. **Protect customer trust.** Consent, contact caps, IST quiet hours, UPI AutoPay thresholds, and high-value approval gates run before execution.
3. **Prove incrementality.** Stable holdouts distinguish revenue created by Revive from payments that would have recovered naturally.

This is an independent Razorpay AI Buildathon prototype for **Track 3: AI Revenue Recovery**.

## What is actually implemented

| Layer | Implemented proof |
| --- | --- |
| Product | Responsive command center, ranked recovery queue, explainable case drawer, agent playbooks, experiment analysis, audit trail, and a live modal flow |
| Decision engine | Failure-aware action routing, confidence, approval/block modes, consent/contact/value/AFA gates, issuer holds, IST quiet-hour scheduling, evidence, and deterministic idempotency keys |
| Hosted API | Strict runtime schema validation, byte-size limits, safe errors, no-store responses, request proof IDs, and an OpenAPI 3.1 contract |
| Webhook boundary | Raw-body HMAC-SHA256 verification, secret fail-closed behavior, event-ID requirement, payload hash, and invalid-signature rejection |
| Persistence | Private Vercel Blob audit records, deterministic SHA-256 object paths, immutable writes, and storage-enforced duplicate suppression |
| Security | CSP, clickjacking/MIME/referrer/permissions/HSTS headers, no client secrets, bounded public work, dependency audit, and an explicit residual-risk register |
| Quality | 14 tests, 95.24% line coverage on the core tested modules, lint, production build, GitHub Actions, and Dependabot |
| Deployment | Public full-stack Vercel deployment; native Next.js frontend, route handlers, encrypted secrets, and private Blob storage are hosted together |

All customers, amounts, uplift metrics, and payment outcomes visible in the UI are realistic fictional demo data. The product does not initiate a real charge or send a real customer message.

## Recruiter demo path

Use this path to see the strongest engineering story in under 90 seconds:

1. Open the [command center](https://revive-revenue.vercel.app) and scan revenue-at-risk, uplift, safe-autonomy, and live-agent activity.
2. Select **Review agent plan** to see which actions can run autonomously and which require approval.
3. Open a priority case to inspect evidence, confidence, policy version, context, and the human override.
4. Select **Run live demo**, then **Start simulation**. The browser calls the hosted API; success is impossible unless a real response returns a plan.
5. Inspect policy version, immutable audit status, confidence, execution mode, and request proof in the success panel.
6. Visit **Experiments** for treatment-versus-holdout measurement and **Audit trail** for explainability/proof.
7. Open [`/api/health`](https://revive-revenue.vercel.app/api/health) to verify the decision engine and durable store independently of the UI.

![Revive verified live simulation](docs/assets/revive-live-demo.png)

## Why this problem matters

Razorpay documents that failed subscriptions can move to `pending` and then `halted` after retries, with failure causes including expired cards, bank blocks, insufficient balance, and cancelled mandates. Its SaaS guidance also describes involuntary churn as a material revenue risk. The infrastructure primitives—events, reasons, retries, update flows, and Payment Links—already exist. The product gap is coordinating them with context, customer-trust controls, explanations, and causal measurement.

Primary research is summarized in [`docs/RESEARCH.md`](docs/RESEARCH.md), with direct links to Razorpay and RBI sources.

## Architecture

```mermaid
flowchart LR
    R[Razorpay webhook] --> H[Raw-body HMAC verifier]
    H --> I[Private immutable event record]
    I --> C[Failure classifier]
    C --> S[Recovery scorer]
    S --> P[Deterministic policy engine]
    P -->|safe| A[Action adapter]
    P -->|high value / sensitive| U[Human approval]
    A --> O[Outcome webhook]
    O --> X[Experiment ledger]
    O --> D[Private immutable decision audit]
    D -. evidence .-> UI[Operations UI]
```

The checked-in slice implements the shaded center of this design: authenticated webhook ingestion, durable deduplication/audit, a deterministic plan, and the interactive proof flow. Real payment/message adapters, an outbox, and multi-tenant authorization remain explicit pilot blockers. See [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) and [`docs/ENGINEERING_AUDIT.md`](docs/ENGINEERING_AUDIT.md).

## Hosted API

| Endpoint | Purpose | Important behavior |
| --- | --- | --- |
| `GET /api/health` | Operational proof | Reports decision-engine and private-storage state; returns 503 when persistence is degraded |
| `POST /api/recovery/simulate` | Build a recovery plan | Strict JSON schema, 4 KiB limit, policy version, persistence state, proof ID |
| `POST /api/webhooks/razorpay` | Razorpay-shaped ingestion | Verifies HMAC on untouched bytes, requires event ID, caps 64 KiB, and suppresses duplicates with immutable object keys |

Example:

```bash
curl -X POST https://revive-revenue.vercel.app/api/recovery/simulate \
  -H "content-type: application/json" \
  -d '{
    "eventId": "evt_readme_001",
    "customerId": "cust_demo_nisha",
    "amount": 11999,
    "failureReason": "insufficient_balance",
    "rail": "upi_autopay",
    "contactsLast72Hours": 0,
    "hasMessagingConsent": true,
    "issuerHealthy": true,
    "lifetimeValue": 148200
  }'
```

The response contains `SMART_RETRY`, confidence, autonomous/approval/blocked mode, an IST-safe schedule, five policy results, evidence, a stable action key, database persistence state, and a request proof ID. The complete contract is in [`docs/openapi.yaml`](docs/openapi.yaml).

## Trust model

- Webhook data is hostile until the raw bytes pass HMAC verification.
- TypeScript types are not trusted as runtime validation.
- The model/action score never bypasses deterministic policy checks.
- Deterministic SHA-256 paths and immutable Blob writes—not process memory—enforce duplicate suppression across function instances.
- Contact, consent, issuer, AFA, and money gates can block or require human approval.
- API responses do not expose stacks, environment variables, secrets, or raw credentials.
- The browser cannot display a success result after an API error.
- No PAN, CVV, UPI PIN, card/mandate credential, or real customer PII is stored.

The public-demo verdict and remaining pilot blockers are documented in [`docs/ENGINEERING_AUDIT.md`](docs/ENGINEERING_AUDIT.md). A reusable red-team prompt is in [`docs/ENGINEERING_REVIEW_PROMPT.md`](docs/ENGINEERING_REVIEW_PROMPT.md).

## Engineering evidence

```text
14 tests passing
95.24% line coverage
93.88% branch coverage
100% function coverage
lint passing
production build passing
0 production dependency vulnerabilities
live health check: operational
live private Blob check: operational
invalid webhook signature: HTTP 401
runtime CSP / frame / MIME headers: verified
browser console warnings and errors in core demo: none
```

Run the same gate locally:

```bash
npm ci
npm run check
npm run test:coverage
npm audit --omit=dev
```

GitHub Actions runs the equivalent gate on pushes and pull requests. Dependency updates are monitored by Dependabot.

## Local development

Requirements: Node.js 22.13 or newer.

```bash
npm ci
npm run dev
```

Open `http://localhost:3000` and select **Run live demo**. To exercise persistence locally, link the project with `vercel link`, pull development variables with `vercel env pull`, and inspect `/api/health`.

## Deployment

**Production: [revive-revenue.vercel.app](https://revive-revenue.vercel.app).**

The repository now uses native Next.js 16 and is connected directly to the Vercel project. Production serves the interface and route handlers from one release, keeps webhook credentials in encrypted environment variables, and stores audit evidence as private immutable Blob objects in `sin1`. Pushes can produce deployment previews through the connected GitHub integration.

The exact deployment contract and verification evidence are in [`docs/DEPLOYMENT_DECISION.md`](docs/DEPLOYMENT_DECISION.md).

## Repository map

| Path | Responsibility |
| --- | --- |
| [`app/page.tsx`](app/page.tsx) | Interactive recruiter/demo experience and truth-linked API success state |
| [`lib/recovery-engine.ts`](lib/recovery-engine.ts) | Deterministic action and policy engine |
| [`lib/recovery-input.ts`](lib/recovery-input.ts) | Strict runtime request contract |
| [`lib/webhook-security.ts`](lib/webhook-security.ts) | HMAC verification and payload hashing |
| [`lib/server/audit-store.ts`](lib/server/audit-store.ts) | Private immutable Blob persistence and duplicate suppression |
| [`app/api/recovery/simulate/route.ts`](app/api/recovery/simulate/route.ts) | Hosted simulation decision endpoint |
| [`app/api/webhooks/razorpay/route.ts`](app/api/webhooks/razorpay/route.ts) | Signed webhook boundary |
| [`app/api/health/route.ts`](app/api/health/route.ts) | Runtime dependency evidence |
| [`docs/PITCH_PROMPT.md`](docs/PITCH_PROMPT.md) | Detailed five-minute Obsidian video prompt |
| [`docs/SUBMISSION.md`](docs/SUBMISSION.md) | Copy-ready buildathon submission |
| [`docs/ENGINEERING_AUDIT.md`](docs/ENGINEERING_AUDIT.md) | Fixed loopholes and residual production blockers |

## Resume-ready bullet

Built and publicly shipped an explainable revenue-recovery control plane for Razorpay subscriptions using Next.js 16, React 19, TypeScript, serverless route handlers, raw-body HMAC webhook authentication, immutable storage-enforced idempotency, deterministic fintech guardrails, causal holdout analytics, 14 automated tests, and 95%+ core coverage.

## Production path

1. Add server-enforced identity, roles, merchant scoping, and cross-tenant tests.
2. Connect Razorpay test-mode subscription/payment events and reconcile out-of-order outcomes.
3. Add a transactional outbox, leased action workers, per-subscription locks, dead letters, and replay tooling.
4. Implement real Razorpay retry, hosted update, Payment Link, and consent-aware message adapters.
5. Add edge rate limits, structured/redacted logs, traces, SLOs, alerts, backup/restore drills, and retention workflows.
6. Run shadow mode on live-shaped traffic; graduate only low-risk playbooks to bounded autonomy.
7. Validate uplift with stable bucketing, sample-ratio checks, delayed-outcome windows, and finance reconciliation.

## Pitch and submission kit

- [`docs/PITCH_PROMPT.md`](docs/PITCH_PROMPT.md) — exact five-minute video brief for the Obsidian pipeline
- [`docs/SUBMISSION.md`](docs/SUBMISSION.md) — form answers, short pitch, and resume bullet
- [`docs/RESEARCH.md`](docs/RESEARCH.md) — problem evidence and sources
- [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) — production target state
- [`docs/ENGINEERING_REVIEW_PROMPT.md`](docs/ENGINEERING_REVIEW_PROMPT.md) — adversarial loophole hunt

## License and acknowledgement

MIT licensed. Built for the Razorpay AI Buildathon, Track 3: AI Revenue Recovery. Revive is an independent prototype and is not an official Razorpay product.
