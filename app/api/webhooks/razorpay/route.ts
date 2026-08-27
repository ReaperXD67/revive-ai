import { NextResponse } from 'next/server';
import { storeWebhookEvent, webhookSecret } from '../../../../lib/server/audit-store';
import { sha256Hex, verifyRazorpaySignature } from '../../../../lib/webhook-security';

const MAX_WEBHOOK_BYTES = 64 * 1024;
const responseHeaders = { 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' };

type RazorpayEnvelope = {
  event?: unknown;
  payload?: { payment?: { entity?: { id?: unknown } } };
};

export async function POST(request: Request) {
  const contentLength = Number(request.headers.get('content-length') ?? 0);
  if (contentLength > MAX_WEBHOOK_BYTES) {
    return NextResponse.json({ accepted: false, error: 'payload too large' }, { status: 413, headers: responseHeaders });
  }

  const signature = request.headers.get('x-razorpay-signature') ?? '';
  const eventId = request.headers.get('x-razorpay-event-id') ?? '';
  const secret = webhookSecret();

  if (!secret) {
    return NextResponse.json({ accepted: false, error: 'webhook ingestion is not configured' }, { status: 503, headers: responseHeaders });
  }

  const rawBody = await request.text();
  if (new TextEncoder().encode(rawBody).byteLength > MAX_WEBHOOK_BYTES) {
    return NextResponse.json({ accepted: false, error: 'payload too large' }, { status: 413, headers: responseHeaders });
  }
  if (!eventId || !(await verifyRazorpaySignature(rawBody, signature, secret))) {
    return NextResponse.json({ accepted: false, error: 'invalid webhook signature or event id' }, { status: 401, headers: responseHeaders });
  }

  let payload: RazorpayEnvelope;
  try {
    payload = JSON.parse(rawBody) as RazorpayEnvelope;
  } catch {
    return NextResponse.json({ accepted: false, error: 'invalid JSON payload' }, { status: 400, headers: responseHeaders });
  }

  if (typeof payload.event !== 'string' || payload.event.length > 100) {
    return NextResponse.json({ accepted: false, error: 'invalid event type' }, { status: 422, headers: responseHeaders });
  }

  try {
    const status = await storeWebhookEvent({
      eventId,
      eventType: payload.event,
      paymentId: typeof payload.payload?.payment?.entity?.id === 'string' ? payload.payload.payment.entity.id : undefined,
      payloadHash: await sha256Hex(rawBody),
    });
    return NextResponse.json({ accepted: true, duplicate: status === 'duplicate', eventId }, { status: status === 'duplicate' ? 200 : 202, headers: responseHeaders });
  } catch {
    return NextResponse.json({ accepted: false, error: 'durable ingestion is temporarily unavailable' }, { status: 503, headers: responseHeaders });
  }
}
