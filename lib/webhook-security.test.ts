import assert from 'node:assert/strict';
import test from 'node:test';
import { createHmac } from 'node:crypto';
import { sha256Hex, verifyRazorpaySignature } from './webhook-security.ts';

test('verifies a Razorpay-style HMAC over the untouched raw body', async () => {
  const rawBody = '{"event":"payment.failed","payload":{"payment":{"entity":{"id":"pay_123"}}}}';
  const secret = 'test_webhook_secret';
  const signature = createHmac('sha256', secret).update(rawBody).digest('hex');
  assert.equal(await verifyRazorpaySignature(rawBody, signature, secret), true);
  assert.equal(await verifyRazorpaySignature(`${rawBody} `, signature, secret), false);
});

test('rejects malformed signatures before comparison', async () => {
  assert.equal(await verifyRazorpaySignature('{}', 'not-hex', 'secret'), false);
});

test('creates deterministic payload hashes for audit evidence', async () => {
  assert.equal(await sha256Hex('revive'), await sha256Hex('revive'));
  assert.notEqual(await sha256Hex('revive'), await sha256Hex('Revive'));
});
