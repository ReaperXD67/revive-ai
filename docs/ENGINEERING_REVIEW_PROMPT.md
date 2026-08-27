# Adversarial engineering review prompt

Use this prompt with a senior engineer, security reviewer, or coding agent before a submission or production pilot.

```text
Act as a principal fintech engineer and an adversarial security reviewer. Audit the Revive repository and its deployed URL as if you must sign off on a Razorpay test-mode pilot. Do not reward surface polish. Try to disprove every reliability, security, AI-safety, and revenue-attribution claim with evidence.

Inputs
- Repository: https://github.com/ReaperXD67/revive-ai
- Deployment: https://revive-revenue.vercel.app
- API contract: docs/openapi.yaml
- Architecture: docs/ARCHITECTURE.md
- Known prototype boundary: the dashboard and recovery outcome are simulated; no real payment or customer message is sent.

Threat model
- Unauthenticated internet clients can reach the public demo and its API routes.
- Razorpay webhook payloads, headers, IDs, order, and timing are attacker-controlled until authenticated.
- The runtime is an edge/serverless environment with concurrent isolates and at-least-once event delivery.
- A model recommendation is untrusted until deterministic policy checks authorize an action.
- Duplicate execution, cross-tenant access, PII leakage, false uplift attribution, and silent partial failure are unacceptable.

Audit every item below
1. Enumerate every route, state change, external trust boundary, secret, database write, and client-side claim.
2. Fuzz request content types, invalid JSON, extra keys, boundary amounts, huge bodies, malformed dates, Unicode identifiers, repeated event IDs, and concurrent duplicates.
3. Verify webhook HMAC against the untouched raw body, constant-time comparison, missing-secret failure, maximum payload size, replay handling, and out-of-order delivery behavior.
4. Prove idempotency under concurrency. Check that the unique database constraint matches the business action key and identify where a transactional outbox or per-subscription lock is still required.
5. Review the decision engine for currency-unit mistakes, timezone errors, unsupported rail/reason combinations, unsafe defaults, policy precedence, and model-confidence misuse.
6. Check that a UI success state is impossible after a failed API response and that every product claim maps to implemented behavior or is explicitly labeled simulated/roadmap.
7. Inspect authentication, authorization, tenant isolation, CSRF relevance, CORS, caching, logging, error leakage, SSRF, XSS, CSP, clickjacking, rate limiting, and dependency advisories.
8. Verify Blob key derivation, immutable-write conflict handling, private access, retention needs, failure modes, backup/restore assumptions, and record-version evolution.
9. Review the causal measurement design for sample-ratio mismatch, unstable bucketing, interference, selection bias, peeking, delayed outcomes, and double attribution.
10. Run lint, tests, coverage, production build, dependency audit, API probes, browser flow tests, console-log checks, keyboard navigation, responsive checks, and runtime security-header inspection.
11. Attack `/api/proof` specifically: try to make it reflect environment variables, tokens, branch names, PII, raw event data, unbounded Blob listings, internal URLs, stack traces, or stale deployment evidence. Confirm degraded storage fails safely and that the UI never converts a failed proof request into a green status.

Required output
- Begin with a one-sentence ship/no-ship verdict for (a) public recruiter demo and (b) real merchant pilot.
- List findings by severity: Critical, High, Medium, Low.
- For each finding provide ID, exact file and line, evidence, exploit/failure scenario, smallest safe fix, test that proves the fix, and whether it blocks the recruiter demo or only production.
- Separate confirmed defects from unverified infrastructure assumptions.
- Include a claim-to-evidence matrix for every README and pitch statement.
- Finish with the five highest-leverage improvements, ordered by risk reduction per engineering day.
- Never request, print, or commit real secrets, payment credentials, PAN, CVV, UPI PIN, customer PII, or production webhook payloads.
```
