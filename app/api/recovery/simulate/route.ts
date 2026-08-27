import { NextResponse } from 'next/server';
import { planRecovery, type RecoveryEvent } from '../../../../lib/recovery-engine';

export async function POST(request: Request) {
  const payload = await request.json() as Partial<RecoveryEvent>;

  if (!payload.eventId || !payload.customerId || !payload.failureReason || !payload.rail) {
    return NextResponse.json({ error: 'eventId, customerId, failureReason and rail are required' }, { status: 400 });
  }

  const event: RecoveryEvent = {
    eventId: payload.eventId,
    customerId: payload.customerId,
    amount: payload.amount ?? 24_999,
    failureReason: payload.failureReason,
    rail: payload.rail,
    occurredAt: payload.occurredAt ?? new Date().toISOString(),
    contactsLast72Hours: payload.contactsLast72Hours ?? 0,
    hasMessagingConsent: payload.hasMessagingConsent ?? true,
    issuerHealthy: payload.issuerHealthy ?? true,
    lifetimeValue: payload.lifetimeValue ?? 148_200,
  };

  return NextResponse.json({ plan: planRecovery(event), simulated: true });
}
