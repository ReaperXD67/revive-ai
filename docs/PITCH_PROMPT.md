# Obsidian pipeline prompt — five-minute Revive pitch

Copy everything inside the prompt block into the video-generation pipeline. Replace bracketed URLs only after deployment/upload.

---

## Master prompt

```text
Create a polished 5:00 product pitch video for a Razorpay AI Buildathon submission.

PROJECT
Name: Revive
Tagline: Autonomous revenue recovery
Track: Track 3 — AI Revenue Recovery
Product URL: [DEPLOYED_PRODUCT_URL]
GitHub URL: https://github.com/ReaperXD67/revive-ai

CORE STORY
Recurring payment failures are not all the same. A temporarily low balance, revoked UPI mandate, expired card, bank outage, authentication requirement and network timeout each need different handling. Revive is an AI control plane that turns Razorpay failure events into safe, explainable and measurable recovery decisions. It recovers revenue without sacrificing customer trust.

AUDIENCE
Razorpay buildathon judges, product leaders, fintech engineers and hiring reviewers. Assume they understand payments and AI. Make the story concrete, technically credible and commercially sharp. Avoid generic AI hype.

FORMAT
- Exact target duration: 5 minutes; acceptable range 4:55–5:05.
- Canvas: 16:9, 1920×1080, 30 fps.
- Voice: one confident Indian-English narrator, warm, precise, slightly energetic, 135–145 words per minute.
- Visual mix: 65% crisp screen recording of the working product, 25% restrained motion graphics/diagrams, 10% typography-led transitions.
- Music: modern restrained electronic pulse, 95–105 BPM; confident rather than cinematic; always under narration.
- SFX: subtle UI click, webhook pulse, decision confirmation and recovered-payment chime. Never use loud whooshes.
- Captions: sentence case, two lines maximum, high contrast, verbatim to narration, safe margins.

VISUAL IDENTITY
- Background: graphite #17201d.
- Accent: acid lime #d8ff4f.
- Surface: warm white #f4f6f2.
- Typography: clean geometric sans-serif similar to Geist/Inter; numbers tabular where possible.
- Motion: deliberate and operational—short 220–350 ms reveals, flowing event paths, evidence chips locking into a policy gate.
- Use the repository social card public/og.png as the opening/closing visual reference.
- Never show a Razorpay logo as if Revive were an official Razorpay product. It is an independent buildathon prototype.

TRUTHFULNESS RULES
- State clearly once that all dashboard customers, amounts and uplift metrics are realistic simulated demo data.
- Do not claim real merchant deployment, real payments, real customer messages or production revenue.
- Phrase the “up to 10%” statement as a figure from Razorpay’s 2026 SaaS guide, not as Revive’s result.
- Distinguish implemented prototype features from production architecture/roadmap.
- Never show raw keys, secrets, customer PII, card data, UPI PINs or private browser chrome.

NARRATIVE ARC AND SHOT LIST

00:00–00:16 — Cold open: the leak
Visual: black/graphite field. Four small payment streams move toward a monthly revenue total. One stream breaks on “card expired,” another on “low balance,” another on “mandate revoked.” The missed fragments accumulate into a red/orange “revenue at risk” number. Cut to the Revive lime recovery path pulling fragments back into the total.
On-screen text: “A failed payment should not become a lost customer.”
Voiceover: “A customer can love your product and still disappear because a balance was low, a mandate was revoked, or a bank was briefly unavailable. A failed payment should not automatically become a lost customer.”

00:16–00:43 — Problem and stakes
Visual: concise failure taxonomy cards: Insufficient balance, Mandate revoked, Card expired, Bank unavailable, AFA required. Then show a simple subscription state transition: Active → Pending → Halted. Add a small source footnote: “Razorpay docs: Payment Retries; 2026 SaaS Decision Guide.”
On-screen text: “Up to 10% of SaaS revenue can be lost to involuntary churn*” with a small asterisk saying “Razorpay 2026 guide; varies by merchant.”
Voiceover: “Razorpay documents that failed subscriptions can move from pending to halted after retries, and its 2026 SaaS guide says involuntary churn can cost businesses up to ten percent of revenue. The deeper problem is that every failure is treated like a billing event when it is actually a different recovery decision.”

00:43–01:05 — Product thesis
Visual: four-step horizontal system graphic using the exact words “Understand,” “Decide,” “Guard,” “Measure.” A signed event enters; a recovery decision exits; an experiment ledger records the result.
On-screen text: “Understand → Decide → Guard → Measure”
Voiceover: “Revive is an agentic revenue-recovery control plane. It understands why a payment failed, selects the highest-probability next action, checks that action against hard trust policies, and measures whether it created incremental revenue.”

01:05–01:40 — Command center demo
Visual: full-screen recording of the product. Start on Command center. Slowly pan through the recovery briefing, ₹1.72 lakh at risk, recovered-revenue metrics and safe-autonomy metric. Hover the recovery chart and agent activity feed. Keep cursor movement smooth and purposeful.
Callouts: “₹3.84L recovered — simulated”; “+26.3% incremental uplift — simulated”; “98.7% within policy — simulated.”
Voiceover: “The command center turns a messy exception queue into an operating system. The recovery briefing separates safe autonomous work from actions that need review. Operators see money recovered, causal uplift, recovery speed and the percentage of agent decisions that stayed within policy. These numbers are simulated here, but the measurement contract is real.”

01:40–02:12 — Explainable case decision
Visual: click Recovery queue. Open Nisha Menon’s ₹11,999 UPI AutoPay case. Move through Next best action, confidence, evidence chips, reasoning trace and customer context. Briefly highlight the Hold 24h and Approve action buttons without clicking.
On-screen micro-callouts: “Failure-aware”; “94% confidence”; “Policy v3.4”; “Human override.”
Voiceover: “Open any case and Revive explains itself. For this insufficient-balance failure below the regular UPI AutoPay no-AFA threshold, it predicts a better retry window, checks issuer health, contact pressure and customer context, then proposes a duplicate-safe retry. The operator sees the evidence, confidence, policy version and override controls before approving anything sensitive.”

02:12–02:45 — Live recovery simulation
Visual: click Run live demo. Start simulation. Let each of the four stages visibly finish: Ingest failure, Reason over context, Apply guardrails, Execute recovery. End on “₹11,999 recovered.” Synchronize each step with the narration; use one subtle chime on success.
Voiceover: “Here is the flow end to end. A realistic subscription-pending event enters through the simulation API. Revive verifies and deduplicates the event, classifies the failure, scores candidate actions, applies trust guardrails, and produces an idempotent execution command. The outcome returns through a webhook, the subscription is restored, and the decision is logged.”

02:45–03:20 — Specialist agents and guardrails
Visual: close modal, open Agent playbooks. Reveal the multi-agent chain: Event Listener → Recovery Brain → Trust Guardian → Action Agents. Scroll through the four playbooks. Animate a hard red stop at a policy gate, then a lime pass for a safe action.
On-screen text: “Models recommend. Deterministic policies authorize.”
Voiceover: “Revive does not give one general-purpose model unlimited tools. Specialist agents listen, classify, score and route. Then a deterministic Trust Guardian enforces consent, quiet hours, contact caps, issuer holds, high-value approval and India-specific payment rules. Models recommend; deterministic policies authorize.”

03:20–03:48 — Causal experiments
Visual: open Experiments. Focus on the treatment-versus-holdout chart, 95% confidence ring, segment uplift bars and the label “+₹80,310 incremental — simulated.” Show the Stable bucketing methodology note.
Voiceover: “Most recovery dashboards take credit for every payment that eventually succeeds. Revive reserves a stable holdout and reports treatment uplift, confidence and segment effects. That makes incremental recovered revenue—not message sends or retry volume—the north-star metric.”

03:48–04:18 — Audit and trust
Visual: open Audit trail. Track across decision ID, agent, action, policy result, confidence and proof hash. Finish on the four-step Decision Anatomy flow and Trust Guarantee card.
Voiceover: “Every decision produces an audit record: the signed input, evidence, model score, policy checks, idempotency key, tool action and outcome. Duplicate events are blocked, out-of-order webhooks are reconciled, and finance or risk teams can inspect exactly why the system acted.”

04:18–04:42 — Architecture and Razorpay fit
Visual: switch to a clean system diagram: Razorpay webhooks → signature and idempotency gateway → recovery orchestrator → policy engine → Razorpay retry, hosted update or Payment Link → outcome webhook → experiment and audit ledgers. Use official product words only as small integration labels, not logos.
Voiceover: “In production, Revive sits above Razorpay’s existing primitives. It consumes signed subscription and payment webhooks, uses structured failure reasons, and routes safe actions to retries, hosted payment-method updates or Payment Links. A transactional outbox and per-subscription lock make execution effectively once.”

04:42–05:00 — Close
Visual: return to the command center, then clean brand end card using public/og.png. Add GitHub URL and final product URL. Lime recovery path completes into an upward arrow.
On-screen text: “Recover revenue. Retain trust.” then “Revive — Autonomous revenue recovery.”
Voiceover: “Revive turns payment failure from a dead-end status into an explainable, measurable recovery operation. More revenue, less customer friction, and autonomy a fintech team can actually trust. This is Revive.”

SCREEN CAPTURE INSTRUCTIONS
1. Use a fresh 1440×900 or 1920×1080 browser viewport at 100% zoom.
2. Hide bookmarks, extensions, personal tabs and notifications.
3. Begin on Command center with the browser already loaded.
4. Record these clean takes separately: Command center; Recovery queue to Nisha case; Run live demo complete; Agent playbooks; Experiments; Audit trail.
5. Pause for 1.5 seconds after every navigation or drawer open so edits have handles.
6. Keep the pointer away from text unless actively selecting something.
7. Do not capture development-console warnings or localhost chrome; crop to product viewport.

EDITING RULES
- Use straight cuts for product actions; use short lime path wipes only between conceptual chapters.
- No fake typing, floating glassmorphism, 3D coins, robot characters, stock office footage or generic neural-network imagery.
- Never cover important product metrics with captions.
- Use gentle 104–112% push-ins to direct attention, keeping UI text sharp.
- Keep every number shown in narration consistent with the product.
- End music on a resolved beat exactly with the Revive mark.

DELIVERABLES
- Final H.264 MP4, 1920×1080, 30 fps, high bitrate.
- Separate WAV voiceover and music stems.
- WebVTT or SRT captions.
- Thumbnail derived from public/og.png with no additional text.
- A 20-second silent loop of the live simulation for optional social sharing.
```

## Recording checklist

- Deploy the latest `main` branch before capturing.
- Replace `[DEPLOYED_PRODUCT_URL]` in the prompt.
- Open every view once to warm assets before recording.
- Reset the live demo by closing and reopening its modal.
- Confirm the visible demo amount is ₹11,999.
- Keep the disclaimer that metrics and customer data are simulated.
- Upload the final video and paste its URL into [`SUBMISSION.md`](SUBMISSION.md).
