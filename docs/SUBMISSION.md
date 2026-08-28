# Buildathon submission copy

## Track

**Track 3: AI Revenue Recovery**

## Project Name / Title

**Revive — Autonomous Revenue Recovery**

## Project Objectives — What does it solve?

Revive prevents failed recurring payments from silently becoming lost customers. It ingests Razorpay subscription/payment webhooks, understands the failure reason and payment rail, ranks recovery opportunities by value and likelihood, then selects the safest next action: a balance-aware retry, issuer-health hold, UPI re-mandate, secure payment-method update, Payment Link or human escalation.

Unlike a generic retry scheduler or AI chat wrapper, Revive is built around trustworthy autonomy. Every action is checked against consent, contact-frequency, quiet-hour, UPI AutoPay authentication and high-value approval policies; every decision includes evidence, confidence, an idempotency key and an audit record. A treatment/holdout experiment ledger measures incremental recovered revenue so operators can prove what the AI actually created.

The prototype includes an interactive command center, recovery queue, explainable case view, specialist-agent playbooks, causal experiments, a hosted decision API, raw-body HMAC webhook verification, immutable storage-enforced duplicate suppression/audit persistence, security headers, a live System Proof surface, a production replay challenge, an interactive policy-boundary Decision Lab, 16 automated tests and a live failure-to-recovery simulation. All demo data is fictional and no real payment is initiated.

## GitHub Repository URL

https://github.com/ReaperXD67/revive-ai

## Live Product URL

https://revive-revenue.vercel.app

## 5-min Pitch Video Link

Paste the final verified public video URL here after rendering and upload. Recommended: an Unlisted YouTube link or a Google Drive link set to **Anyone with the link — Viewer**. Do not paste the product URL in this field.

## Build Challenges & Technical Obstacles

The hardest challenge was making an agentic recovery demo credible in a stateless serverless environment where webhook events may be duplicated, reordered, malformed, or malicious. TypeScript types alone could not protect runtime boundaries, and an in-memory deduplication set would fail across function instances. I solved this with strict runtime schemas and byte limits, raw-body HMAC-SHA256 verification, deterministic action keys, SHA-256-derived private Blob paths, and immutable create-only writes so the storage layer—not process memory—suppresses duplicates. A second challenge was preventing AI confidence from bypassing fintech safety. Recovery recommendations therefore pass deterministic consent, contact-frequency, IST quiet-hour, issuer-health, UPI AutoPay authentication, and high-value approval policies before receiving an execution mode. Finally, the UI had to prove rather than merely claim that the backend works. I added System Proof, a live `stored → duplicate_suppressed` replay challenge, a configurable Decision Lab, sanitized deployment evidence, automated tests, CI, security headers, and explicit labels separating simulated portfolio outcomes from live engineering evidence.

## Final Submission Confirmation

Tick the confirmation only after the final video URL opens without requesting access, the live product and GitHub links work, and every answer has been reviewed. The form warns that no further edits can be made after submission.

## One-line version

Revive is an explainable AI control plane that turns Razorpay recurring-payment failures into safe, measurable recovery actions across UPI AutoPay, cards and eMandate.

## 30-second elevator pitch

Indian subscription businesses can lose valuable customers because a card expired, a UPI mandate was revoked, a bank was down or a balance was temporarily low. Those failures look similar on a revenue dashboard but demand completely different remedies. Revive turns each Razorpay failure event into an explainable recovery decision, checks it against hard trust guardrails, executes only when safe, and uses holdout experiments to prove incremental revenue. The result is more money recovered with less customer friction—and an audit trail a finance or risk team can trust.

## Resume bullet

Built and publicly shipped Revive, an explainable revenue-recovery control plane for Razorpay subscriptions using Next.js 16, React 19, TypeScript, Vercel Functions, raw-body HMAC webhook authentication, immutable storage-enforced idempotency, a production replay challenge, deterministic fintech guardrails, causal holdout analytics, 16 tests and 95%+ core coverage.
