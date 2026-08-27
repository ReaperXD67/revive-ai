# Research and product thesis

## Executive finding

The strongest buildathon opportunity is not “another retry scheduler.” It is a **merchant-level agentic orchestration and measurement layer** for recurring-payment failures.

Payment gateways already expose the primitives. Merchants still need to answer four hard questions for every failure:

1. What actually happened?
2. Which recovery path is most likely to work now?
3. Is that action safe and compliant for this customer?
4. Did the action create incremental revenue or merely take credit for natural recovery?

Revive makes those four questions the product.

## Evidence

### 1. Failed payments are a meaningful revenue leak

Razorpay's 2026 guide for early-stage SaaS companies states that up to 10% of SaaS revenue can be lost to involuntary churn from failed recurring payments. The exact rate varies by merchant, mix and period; Revive therefore treats this as an industry upper-bound signal, not a universal forecast.

Source: [Razorpay — Payment Gateways for Early-Stage SaaS Startups: 2026 Decision Framework](https://razorpay.com/blog/payment-gateways-saas-startups-decision)

### 2. Failure reasons imply different remedies

Razorpay lists expired cards, bank blocks, insufficient balance and cancelled mandates among subscription failure causes. Its generic payment error object exposes `source`, `step` and `reason`, giving an orchestration layer structured evidence rather than an opaque “failed” status.

Sources: [subscription payment retries](https://razorpay.com/docs/payments/subscriptions/payment-retries/?preferred-country=IN), [error structure](https://razorpay.com/docs/errors/?preferred-country=IN)

Product implication: a network timeout should be retried; a revoked mandate should be repaired; an expired card should switch the customer to a secure update or Payment Link; an issuer incident should suppress retries.

### 3. India needs rail-aware recovery

Razorpay Subscriptions supports cards, UPI AutoPay and eMandate. For regular-industry UPI AutoPay, subsequent debits above ₹15,000 require customer approval with a UPI PIN; eligible lending/investment categories have a higher threshold. A one-size-fits-all “retry later” model is therefore structurally weak.

Sources: [supported subscription payment methods](https://razorpay.com/docs/payments/subscriptions/supported-payment-methods/?preferred-country=IN), [UPI AutoPay limits and flow](https://razorpay.com/docs/payments/payment-gateway/s2s-integration/recurring-payments/upi/)

### 4. Existing flows can still end in manual operations

Razorpay automatically retries failed subscription charges. After retries are exhausted, a subscription moves to `halted`; updating a method can reactivate it, but later invoices may require merchant action. Notifications and hosted update paths exist, yet merchant teams still need prioritization, cross-rail orchestration, approvals and a coherent customer strategy.

Sources: [payment retries](https://razorpay.com/docs/payments/subscriptions/payment-retries/?preferred-country=IN), [subscription notifications](https://razorpay.com/docs/payments/subscriptions/notifications/)

### 5. Recovery actions can use native payment primitives

Razorpay Payment Links can be created via API, shared by email/SMS, expired, partially paid and observed with webhooks. They offer a secure recovery path without collecting payment credentials inside Revive.

Sources: [Payment Links overview](https://razorpay.com/docs/payments/payment-links/), [Payment Links API](https://razorpay.com/docs/api/payments/payment-links/)

### 6. Webhooks require production-grade correctness

Razorpay signs webhooks with HMAC-SHA256 over the raw request body. Duplicate events are expected and are identified by the `x-razorpay-event-id` header; event order is not guaranteed.

Source: [Validate and Test Webhooks](https://razorpay.com/docs/webhooks/validate-test/?preferred-country=IN)

Product implication: no agent action can be credible without signature verification, idempotency and state-machine reconciliation. These are first-class in Revive's architecture and demo language.

### 7. Recovery analytics and smart retries are established value categories

Stripe's official Revenue Recovery documentation groups smart retries, recovery analytics and automated customer communications as a coherent billing capability. This validates the category while leaving room for Revive's India-specific rails, agent explainability, trust policies and causal experiment ledger.

Source: [Stripe Billing — Revenue recovery](https://docs.stripe.com/billing/revenue-recovery?locale=en-GB)

## Competitive gap

This is an inference from the documented primitives above, not a claim that any gateway lacks undisclosed capabilities.

| Existing primitive | Revive's added layer |
| --- | --- |
| Fixed or configurable retries | Per-case timing and rail selection |
| Failure emails/SMS | Consent- and pressure-aware journey orchestration |
| Error code | Contextual reason + confidence + next best action |
| Dashboard status | Value/probability-ranked operational queue |
| Payment Link | Agent-selected fallback with outcome suppression |
| Aggregate recovery | Treatment-vs-holdout incremental revenue |
| API action | Evidence, policy result, idempotency key and proof hash |

## Chosen wedge

Start with Indian B2B SaaS and subscription businesses already using Razorpay. Their economics are attractive for an MVP:

- recurring invoices are observable;
- merchant operators understand MRR and involuntary churn;
- annual plans create high-value recovery opportunities;
- a shadow-mode deployment can prove uplift before autonomous execution;
- Razorpay webhooks and Payment Links reduce integration surface.

## Success metrics

Primary: **incremental recovered revenue**, measured against a stable randomized holdout.

Secondary:

- recovered-payment rate by failure reason and rail;
- median time to recover;
- customer-contact rate per recovery;
- subscription reactivation and 30-day retention;
- policy intervention and human-approval rate;
- duplicate action rate (target: zero);
- complaint, opt-out and dispute rate.

## Claims discipline

All dashboard customers, amounts, metrics and experiments are simulated. They illustrate the product's measurement contract; they are not represented as live merchant results. The prototype performs no real payment, message or merchant API action.
