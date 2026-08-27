import assert from 'node:assert/strict';
import test from 'node:test';
import { planRecovery, type RecoveryEvent } from './recovery-engine.ts';

const baseEvent: RecoveryEvent = {
  eventId: 'evt_test_001', customerId: 'cust_test_001', amount: 11_999,
  failureReason: 'insufficient_balance', rail: 'upi_autopay',
  occurredAt: '2026-08-27T09:42:00.000Z', contactsLast72Hours: 0,
  hasMessagingConsent: true, issuerHealthy: true, lifetimeValue: 148_200,
};

test('chooses a smart retry for an insufficient-balance failure', () => {
  const plan = planRecovery(baseEvent);
  assert.equal(plan.action, 'SMART_RETRY');
  assert.equal(plan.executionMode, 'autonomous');
  assert.equal(plan.confidence, 0.94);
});

test('requires approval for high-value recovery actions', () => {
  const plan = planRecovery({ ...baseEvent, amount: 89_999 });
  assert.equal(plan.executionMode, 'approval_required');
  assert.equal(plan.policyChecks.find((check) => check.name === 'High-value approval')?.passed, false);
});

test('blocks contact when the frequency cap is reached', () => {
  const plan = planRecovery({ ...baseEvent, failureReason: 'mandate_revoked', contactsLast72Hours: 2 });
  assert.equal(plan.action, 'HUMAN_REVIEW');
  assert.equal(plan.executionMode, 'blocked');
});

test('holds actions when an issuer is unhealthy', () => {
  const plan = planRecovery({ ...baseEvent, issuerHealthy: false });
  assert.equal(plan.action, 'WAIT_FOR_ISSUER');
});

test('routes UPI AutoPay debits above the no-AFA threshold to authentication', () => {
  const plan = planRecovery({ ...baseEvent, amount: 24_999 });
  assert.equal(plan.action, 'REQUEST_AUTHENTICATION');
});

test('derives a stable idempotency key from the event and action', () => {
  const first = planRecovery(baseEvent);
  const second = planRecovery(baseEvent);
  assert.equal(first.idempotencyKey, second.idempotencyKey);
});
