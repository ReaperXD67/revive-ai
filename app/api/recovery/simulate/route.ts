import { NextResponse } from 'next/server';
import { ZodError } from 'zod';
import { planRecovery } from '../../../../lib/recovery-engine';
import { parseRecoveryEvent } from '../../../../lib/recovery-input';
import { recordRecoveryDecision } from '../../../../lib/server/audit-store';

const MAX_REQUEST_BYTES = 4_096;

const jsonHeaders = {
  'Cache-Control': 'no-store',
  'X-Content-Type-Options': 'nosniff',
};

export async function POST(request: Request) {
  const requestId = crypto.randomUUID();
  const contentType = request.headers.get('content-type') ?? '';
  const contentLength = Number(request.headers.get('content-length') ?? 0);

  if (!contentType.toLowerCase().startsWith('application/json')) {
    return NextResponse.json({ error: 'content-type must be application/json', requestId }, { status: 415, headers: jsonHeaders });
  }

  if (contentLength > MAX_REQUEST_BYTES) {
    return NextResponse.json({ error: 'request body is too large', requestId }, { status: 413, headers: jsonHeaders });
  }

  try {
    const rawBody = await request.text();
    if (new TextEncoder().encode(rawBody).byteLength > MAX_REQUEST_BYTES) {
      return NextResponse.json({ error: 'request body is too large', requestId }, { status: 413, headers: jsonHeaders });
    }

    const event = parseRecoveryEvent(JSON.parse(rawBody));
    const plan = planRecovery(event);
    const persistence = await recordRecoveryDecision(plan, event);

    return NextResponse.json({
      requestId,
      simulated: true,
      policyVersion: '3.4.0',
      persistence,
      plan,
    }, { headers: jsonHeaders });
  } catch (error) {
    if (error instanceof SyntaxError) {
      return NextResponse.json({ error: 'request body must contain valid JSON', requestId }, { status: 400, headers: jsonHeaders });
    }
    if (error instanceof ZodError) {
      return NextResponse.json({
        error: 'request validation failed',
        requestId,
        issues: error.issues.map((issue) => ({ path: issue.path.join('.'), message: issue.message })),
      }, { status: 422, headers: jsonHeaders });
    }

    return NextResponse.json({ error: 'recovery simulation failed safely', requestId }, { status: 500, headers: jsonHeaders });
  }
}
