# Deployment decision

## Production target

Revive is deployed as one native Next.js application on Vercel:

- Product: https://revive-revenue.vercel.app
- Health: https://revive-revenue.vercel.app/api/health
- System proof: https://revive-revenue.vercel.app/api/proof
- Decision API: `POST /api/recovery/simulate`
- Razorpay-shaped webhook: `POST /api/webhooks/razorpay`
- Durable audit store: private Vercel Blob in `sin1`
- Source: https://github.com/ReaperXD67/revive-ai

## Why one full-stack deployment

1. The interface and route handlers ship from one immutable release, preventing frontend/API version skew.
2. The webhook secret remains server-side in encrypted Vercel environment variables.
3. Recovery decisions and accepted webhook IDs use SHA-256-derived object names and immutable private writes. A second write to the same logical key is rejected by storage and returned as a duplicate.
4. The repository is connected to Vercel Git deployments, so future pushes and pull requests can produce traceable builds and previews.
5. The public recruiter URL contains no development-platform or assistant-product branding.

## Verified production contract

The production smoke test checks:

- homepage returns HTTP 200;
- CSP and defensive response headers are present;
- `/api/health` reports the decision engine and private audit store operational;
- `/api/proof` reports the live Vercel region, runtime, deployed commit, enforced controls, API inventory, and bounded private-store evidence without exposing raw records or secrets;
- a new recovery decision returns `stored`;
- the same decision returns `duplicate_suppressed`;
- the browser-based replay challenge proves the same `stored → duplicate_suppressed` sequence on the production alias;
- an invalid webhook signature returns HTTP 401.

## Backend hosting answer

The backend is hosted, but it is intentionally not a separate service. Next.js route handlers run as Vercel Functions in `sin1`, encrypted environment variables keep webhook credentials server-side, and private Vercel Blob in `sin1` stores durable proof. The frontend and functions ship from the same immutable deployment. A separate worker or queue service becomes justified only when Revive introduces scheduled retries, real payment/message adapters, transactional outbox processing, dead letters, and replay tooling.

## Production-pilot boundary

This deployment is suitable for a public engineering demonstration. A real merchant pilot still requires authentication and merchant isolation, Razorpay test-mode onboarding, transactional workers, rate limiting, structured observability, retention controls, and incident procedures.

Official platform references:

- [Vercel Git deployments](https://vercel.com/docs/git)
- [Next.js on Vercel](https://vercel.com/docs/frameworks/full-stack/nextjs)
- [Vercel Functions](https://vercel.com/docs/functions)
- [Private Vercel Blob storage](https://vercel.com/docs/vercel-blob/private-storage)
