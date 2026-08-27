import assert from 'node:assert/strict';
import test from 'node:test';
import { parseRecoveryEvent, recoveryEventSchema } from './recovery-input.ts';

const validInput = {
  eventId: 'evt_demo_4821',
  customerId: 'cust_demo_nisha',
  failureReason: 'insufficient_balance',
  rail: 'upi_autopay',
};

test('normalizes a minimal recovery request with safe defaults', () => {
  const event = parseRecoveryEvent(validInput);
  assert.equal(event.amount, 11_999);
  assert.equal(event.contactsLast72Hours, 0);
  assert.equal(event.hasMessagingConsent, true);
});

test('rejects unknown failure taxonomies and extra properties', () => {
  assert.equal(recoveryEventSchema.safeParse({ ...validInput, failureReason: 'sql_injection' }).success, false);
  assert.equal(recoveryEventSchema.safeParse({ ...validInput, admin: true }).success, false);
});

test('rejects negative or unreasonably large monetary values', () => {
  assert.equal(recoveryEventSchema.safeParse({ ...validInput, amount: -1 }).success, false);
  assert.equal(recoveryEventSchema.safeParse({ ...validInput, amount: 10_000_001 }).success, false);
});
