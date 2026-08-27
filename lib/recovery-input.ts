import { z } from 'zod';
import type { RecoveryEvent } from './recovery-engine';

const identifier = z.string().trim().min(1).max(128).regex(/^[a-zA-Z0-9:_-]+$/);

export const recoveryEventSchema = z.object({
  eventId: identifier,
  customerId: identifier,
  amount: z.number().finite().positive().max(10_000_000).default(11_999),
  failureReason: z.enum([
    'insufficient_balance', 'mandate_revoked', 'card_expired', 'bank_unavailable',
    'authentication_required', 'network_timeout', 'unknown',
  ]),
  rail: z.enum(['upi_autopay', 'card', 'emandate']),
  occurredAt: z.iso.datetime({ offset: true }).default(() => new Date().toISOString()),
  contactsLast72Hours: z.number().int().min(0).max(20).default(0),
  hasMessagingConsent: z.boolean().default(true),
  issuerHealthy: z.boolean().default(true),
  lifetimeValue: z.number().finite().min(0).max(100_000_000).default(148_200),
}).strict();

export type RecoveryEventInput = z.input<typeof recoveryEventSchema>;

export function parseRecoveryEvent(input: unknown): RecoveryEvent {
  return recoveryEventSchema.parse(input) as RecoveryEvent;
}
