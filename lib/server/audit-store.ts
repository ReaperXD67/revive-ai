import { env } from 'cloudflare:workers';
import type { RecoveryEvent, RecoveryPlan } from '../recovery-engine';

type ReviveEnv = Cloudflare.Env & {
  DB?: D1Database;
  RAZORPAY_WEBHOOK_SECRET?: string;
};

const schemaStatements = [
  `CREATE TABLE IF NOT EXISTS webhook_events (
    event_id TEXT PRIMARY KEY,
    event_type TEXT NOT NULL,
    payment_id TEXT,
    payload_hash TEXT NOT NULL,
    received_at TEXT NOT NULL
  )`,
  `CREATE INDEX IF NOT EXISTS idx_webhook_events_type_received
    ON webhook_events(event_type, received_at)`,
  `CREATE TABLE IF NOT EXISTS recovery_decisions (
    decision_id TEXT PRIMARY KEY,
    event_id TEXT NOT NULL,
    customer_id TEXT NOT NULL,
    amount INTEGER NOT NULL,
    action TEXT NOT NULL,
    confidence_basis_points INTEGER NOT NULL,
    execution_mode TEXT NOT NULL,
    scheduled_for TEXT NOT NULL,
    created_at TEXT NOT NULL
  )`,
  `CREATE UNIQUE INDEX IF NOT EXISTS idx_recovery_decisions_idempotency
    ON recovery_decisions(event_id, action)`,
  `CREATE INDEX IF NOT EXISTS idx_recovery_decisions_created
    ON recovery_decisions(created_at)`,
];

function database() {
  const db = (env as ReviveEnv).DB;
  if (!db) throw new Error('D1 binding DB is unavailable');
  return db;
}

async function ensureSchema(db: D1Database) {
  await db.batch(schemaStatements.map((statement) => db.prepare(statement)));
}

export async function recordRecoveryDecision(plan: RecoveryPlan, event: RecoveryEvent) {
  try {
    const db = database();
    await ensureSchema(db);
    const result = await db.prepare(`INSERT OR IGNORE INTO recovery_decisions (
      decision_id, event_id, customer_id, amount, action, confidence_basis_points,
      execution_mode, scheduled_for, created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`)
      .bind(
        plan.idempotencyKey,
        event.eventId,
        event.customerId,
        Math.round(event.amount),
        plan.action,
        Math.round(plan.confidence * 10_000),
        plan.executionMode,
        plan.scheduledFor,
        new Date().toISOString(),
      )
      .run();

    return result.meta.changes > 0 ? 'stored' as const : 'duplicate_suppressed' as const;
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
  const db = database();
  await ensureSchema(db);
  const result = await db.prepare(`INSERT OR IGNORE INTO webhook_events (
    event_id, event_type, payment_id, payload_hash, received_at
  ) VALUES (?, ?, ?, ?, ?)`)
    .bind(input.eventId, input.eventType, input.paymentId ?? null, input.payloadHash, new Date().toISOString())
    .run();
  return result.meta.changes > 0 ? 'accepted' as const : 'duplicate' as const;
}

export async function databaseHealth() {
  try {
    const db = database();
    await ensureSchema(db);
    await db.prepare('SELECT 1 AS ok').first();
    return { ok: true as const, store: 'Cloudflare D1' };
  } catch {
    return { ok: false as const, store: 'Cloudflare D1' };
  }
}

export function webhookSecret() {
  return (env as ReviveEnv).RAZORPAY_WEBHOOK_SECRET;
}
