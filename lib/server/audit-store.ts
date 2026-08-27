import { head, list, put } from '@vercel/blob';
import type { RecoveryEvent, RecoveryPlan } from '../recovery-engine';

const PRIVATE_ACCESS = 'private' as const;

function blobToken() {
  const token = process.env.BLOB_READ_WRITE_TOKEN;
  if (!token) throw new Error('BLOB_READ_WRITE_TOKEN is unavailable');
  return token;
}

async function storageKey(namespace: string, value: string) {
  const bytes = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest('SHA-256', bytes);
  const hash = Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, '0')).join('');
  return `${namespace}/${hash}.json`;
}

async function putImmutable(pathname: string, payload: object) {
  const token = blobToken();

  try {
    await put(pathname, JSON.stringify(payload), {
      access: PRIVATE_ACCESS,
      addRandomSuffix: false,
      allowOverwrite: false,
      contentType: 'application/json',
      token,
    });
    return 'stored' as const;
  } catch (writeError) {
    try {
      await head(pathname, { token });
      return 'duplicate_suppressed' as const;
    } catch {
      throw writeError;
    }
  }
}

export async function recordRecoveryDecision(plan: RecoveryPlan, event: RecoveryEvent) {
  try {
    const pathname = await storageKey('recovery-decisions', plan.idempotencyKey);
    return await putImmutable(pathname, {
      schemaVersion: 1,
      decisionId: plan.idempotencyKey,
      eventId: event.eventId,
      customerId: event.customerId,
      amount: Math.round(event.amount),
      action: plan.action,
      confidenceBasisPoints: Math.round(plan.confidence * 10_000),
      executionMode: plan.executionMode,
      scheduledFor: plan.scheduledFor,
      createdAt: new Date().toISOString(),
    });
  } catch {
    return 'degraded' as const;
  }
}

export async function storeWebhookEvent(input: {
  eventId: string;
  eventType: string;
  paymentId?: string;
  payloadHash: string;
}) {
  const pathname = await storageKey('webhook-events', input.eventId);
  const result = await putImmutable(pathname, {
    schemaVersion: 1,
    ...input,
    receivedAt: new Date().toISOString(),
  });
  return result === 'stored' ? 'accepted' as const : 'duplicate' as const;
}

export async function databaseHealth() {
  try {
    await list({ limit: 1, token: blobToken() });
    return { ok: true as const, store: 'Vercel Blob (private, immutable records)' };
  } catch {
    return { ok: false as const, store: 'Vercel Blob (private, immutable records)' };
  }
}

export function webhookSecret() {
  return process.env.RAZORPAY_WEBHOOK_SECRET;
}
