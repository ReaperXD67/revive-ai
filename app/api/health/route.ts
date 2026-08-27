import { NextResponse } from 'next/server';
import { databaseHealth } from '../../../lib/server/audit-store';
import { describeDeployment } from '../../../lib/system-proof';

export const dynamic = 'force-dynamic';

export async function GET() {
  const durableAudit = await databaseHealth();
  const healthy = durableAudit.ok;

  return NextResponse.json({
    status: healthy ? 'operational' : 'degraded',
    service: 'revive-recovery-api',
    version: '1.0.0',
    checks: {
      decisionEngine: { ok: true, mode: 'deterministic policy engine' },
      durableAudit,
    },
    deployment: describeDeployment({
      isVercel: process.env.VERCEL === '1',
      region: process.env.VERCEL_REGION,
      commitSha: process.env.VERCEL_GIT_COMMIT_SHA,
      nodeVersion: process.version,
    }),
    timestamp: new Date().toISOString(),
  }, {
    status: healthy ? 200 : 503,
    headers: { 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' },
  });
}
