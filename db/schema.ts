import { index, integer, sqliteTable, text, uniqueIndex } from 'drizzle-orm/sqlite-core';

export const webhookEvents = sqliteTable('webhook_events', {
  eventId: text('event_id').primaryKey(),
  eventType: text('event_type').notNull(),
  paymentId: text('payment_id'),
  payloadHash: text('payload_hash').notNull(),
  receivedAt: text('received_at').notNull(),
}, (table) => [index('idx_webhook_events_type_received').on(table.eventType, table.receivedAt)]);

export const recoveryDecisions = sqliteTable('recovery_decisions', {
  decisionId: text('decision_id').primaryKey(),
  eventId: text('event_id').notNull(),
  customerId: text('customer_id').notNull(),
  amount: integer('amount').notNull(),
  action: text('action').notNull(),
  confidenceBasisPoints: integer('confidence_basis_points').notNull(),
  executionMode: text('execution_mode').notNull(),
  scheduledFor: text('scheduled_for').notNull(),
  createdAt: text('created_at').notNull(),
}, (table) => [
  uniqueIndex('idx_recovery_decisions_idempotency').on(table.eventId, table.action),
  index('idx_recovery_decisions_created').on(table.createdAt),
]);
