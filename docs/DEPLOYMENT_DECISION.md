# Deployment decision

## Decision

Deploy the current prototype as one full-stack Sites/Vinext application. Do **not** add a second Vercel deployment for the submission.

The frontend and backend are already hosted together at:

- Product: https://revive-ai.plim97527.chatgpt.site
- Health: https://revive-ai.plim97527.chatgpt.site/api/health
- Decision API: `POST /api/recovery/simulate`
- Razorpay-shaped webhook: `POST /api/webhooks/razorpay`
- Durable store: Cloudflare D1 binding `DB`

## Why this is the right choice now

1. The repository uses Vinext's Cloudflare Worker build and native `cloudflare:workers` bindings. Sites already runs the UI, route handlers, secrets, and D1 in the same regional edge application.
2. A separate backend would add cross-origin policy, two deployments, two observability surfaces, separate secrets, and version-skew risk without adding submission value.
3. A duplicate Vercel project would not be a neutral mirror: the D1 binding and Vinext build path are platform-specific. A correct Vercel version should first migrate to standard Next.js output and replace D1 access with a Vercel-compatible database adapter.
4. Recruiters need one public link that works. The current public link now has a healthy backend, persistent proof, and a verified demo flow.

## When Vercel becomes worthwhile

Choose Vercel after a deliberate portability milestone, especially if the team wants automatic Git preview URLs, deployment checks, or conventional Next.js Functions. Vercel documents automatic branch/PR preview deployments and production deployments from the production branch, while its Next.js platform runs server-side routes as managed Functions:

- [Deploying Git repositories with Vercel](https://vercel.com/docs/git)
- [Vercel environments](https://vercel.com/docs/deployments/environments)
- [Next.js on Vercel](https://vercel.com/docs/frameworks/full-stack/nextjs)
- [Vercel Functions](https://vercel.com/docs/functions)

Before that migration:

1. isolate persistence behind a repository interface;
2. provide D1 and Postgres implementations;
3. run the API contract suite against both;
4. switch `vinext build` to the standard Next.js build for the Vercel target;
5. create preview and production environments with separate secrets/databases;
6. compare cold starts, tail latency, cost, rollback, logs, and failure modes;
7. pick one production owner and remove the redundant deployment.

## Backend hosting answer

Yes, the backend must be hosted for a credible recruiter demo, but it does not need to be a separate service. The current route handlers are server-side endpoints deployed in the same Worker as the product. A separate queue/worker boundary is justified only when real payment actions, long-running retries, scheduled jobs, or third-party message delivery are introduced.
