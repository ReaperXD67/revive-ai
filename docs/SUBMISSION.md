# Buildathon submission copy

## Track

**Track 3: AI Revenue Recovery**

## Project Name / Title

**Revive — Autonomous Revenue Recovery**

## Project Objectives — What does it solve?

Revive prevents failed recurring payments from silently becoming lost customers. It ingests Razorpay subscription/payment webhooks, understands the failure reason and payment rail, ranks recovery opportunities by value and likelihood, then selects the safest next action: a balance-aware retry, issuer-health hold, UPI re-mandate, secure payment-method update, Payment Link or human escalation.

Unlike a generic retry scheduler or AI chat wrapper, Revive is built around trustworthy autonomy. Every action is checked against consent, contact-frequency, quiet-hour, UPI AutoPay authentication and high-value approval policies; every decision includes evidence, confidence, an idempotency key and an audit record. A treatment/holdout experiment ledger measures incremental recovered revenue so operators can prove what the AI actually created.

The prototype includes an interactive command center, recovery queue, explainable case view, specialist-agent playbooks, causal experiments, a hosted decision API, raw-body HMAC webhook verification, D1-enforced duplicate suppression/audit persistence, security headers, a public health check, 14 automated tests and a live failure-to-recovery simulation. All demo data is fictional and no real payment is initiated.

## GitHub Repository URL

https://github.com/ReaperXD67/revive-ai

## 5-min Pitch Video Link

Add the final hosted video URL here after rendering and upload.

## One-line version

Revive is an explainable AI control plane that turns Razorpay recurring-payment failures into safe, measurable recovery actions across UPI AutoPay, cards and eMandate.

## 30-second elevator pitch

Indian subscription businesses can lose valuable customers because a card expired, a UPI mandate was revoked, a bank was down or a balance was temporarily low. Those failures look similar on a revenue dashboard but demand completely different remedies. Revive turns each Razorpay failure event into an explainable recovery decision, checks it against hard trust guardrails, executes only when safe, and uses holdout experiments to prove incremental revenue. The result is more money recovered with less customer friction—and an audit trail a finance or risk team can trust.

## Resume bullet

Built and publicly shipped Revive, an explainable revenue-recovery control plane for Razorpay subscriptions using React 19, TypeScript, edge route handlers, raw-body HMAC webhook authentication, D1-enforced idempotency, deterministic fintech guardrails, causal holdout analytics, 14 tests and 95%+ core coverage.
