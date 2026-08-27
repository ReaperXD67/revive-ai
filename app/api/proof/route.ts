import { NextResponse } from 'next/server';
import { auditEvidence, databaseHealth } from '../../../lib/server/audit-store';
import { describeDeployment } from '../../../lib/system-proof';

export const dynamic = 'force-dynamic';

const headers = {
  'Cache-Control': 'no-store',
  'X-Content-Type-Options': 'nosniff',
};

export async function GET() {
  const generatedAt = new Date().toISOString();
  const deployment = describeDeployment({
    isVercel: process.env.VERCEL === '1',
    region: process.env.VERCEL_REGION,
    commitSha: process.env.VERCEL_GIT_COMMIT_SHA,
    nodeVersion: process.version,
  });

  try {
    const [durableAudit, evidence] = await Promise.all([databaseHealth(), auditEvidence()]);

    return NextResponse.json({
      status: durableAudit.ok ? 'operational' : 'degraded',
      generatedAt,
      deployment,
      backend: {
        framework: 'Next.js App Router',
        API: 'Vercel Functions',
        persistence: durableAudit.store,
        webhookBoundary: 'Raw-body HMAC-SHA256, fail closed',
        idempotency: 'SHA-256 key + immutable create-only write',
        policyVersion: '3.4.0',
      },
      controls: [
        { id: 'runtime-schema', label: 'Runtime schema validation', state: 'enforced' },
        { id: 'webhook-hmac', label: 'Webhook HMAC verification', state: 'enforced' },
        { id: 'quiet-hours', label: 'Asia/Kolkata quiet hours', state: 'enforced' },
        { id: 'duplicate-suppression', label: 'Durable duplicate suppression', state: 'enforced' },
      ],
      evidence,
      endpoints: [
        { method: 'GET', path: '/api/health', purpose: 'dependency health' },
        { method: 'GET', path: '/api/proof', purpose: 'safe live system evidence' },
        { method: 'POST', path: '/api/recovery/simulate', purpose: 'policy decision' },
        { method: 'POST', path: '/api/webhooks/razorpay', purpose: 'signed event ingestion' },
      ],
    }, { status: durableAudit.ok ? 200 : 503, headers });
  } catch {
    return NextResponse.json({
      status: 'degraded',
      generatedAt,
      deployment,
      error: 'System evidence is temporarily unavailable.',
    }, { status: 503, headers });
  }
}
