export type FailureReason =
  | 'insufficient_balance'
  | 'mandate_revoked'
  | 'card_expired'
  | 'bank_unavailable'
  | 'authentication_required'
  | 'network_timeout'
  | 'unknown';

export type PaymentRail = 'upi_autopay' | 'card' | 'emandate';

export type RecoveryEvent = {
  eventId: string;
  customerId: string;
  amount: number;
  failureReason: FailureReason;
  rail: PaymentRail;
  occurredAt: string;
  contactsLast72Hours: number;
  hasMessagingConsent: boolean;
  issuerHealthy: boolean;
  lifetimeValue: number;
};

export type RecoveryPolicy = {
  humanApprovalAbove: number;
  maximumContactsPer72Hours: number;
  quietHoursStart: number;
  quietHoursEnd: number;
};

export type RecoveryAction =
  | 'SMART_RETRY'
  | 'REQUEST_NEW_MANDATE'
  | 'SEND_PAYMENT_LINK'
  | 'WAIT_FOR_ISSUER'
  | 'REQUEST_AUTHENTICATION'
  | 'HUMAN_REVIEW';

export type RecoveryPlan = {
  eventId: string;
  idempotencyKey: string;
  action: RecoveryAction;
  confidence: number;
  executionMode: 'autonomous' | 'approval_required' | 'blocked';
  scheduledFor: string;
  policyChecks: Array<{ name: string; passed: boolean; detail: string }>;
  evidence: string[];
};

export const defaultPolicy: RecoveryPolicy = {
  humanApprovalAbove: 40_000,
  maximumContactsPer72Hours: 2,
  quietHoursStart: 21,
  quietHoursEnd: 8,
};

const confidenceByReason: Record<FailureReason, number> = {
  insufficient_balance: 0.94,
  mandate_revoked: 0.88,
  card_expired: 0.91,
  bank_unavailable: 0.79,
  authentication_required: 0.82,
  network_timeout: 0.96,
  unknown: 0.48,
};

function selectAction(event: RecoveryEvent): RecoveryAction {
  if (!event.issuerHealthy) return 'WAIT_FOR_ISSUER';

  switch (event.failureReason) {
    case 'insufficient_balance': return 'SMART_RETRY';
    case 'mandate_revoked': return 'REQUEST_NEW_MANDATE';
    case 'card_expired': return 'SEND_PAYMENT_LINK';
    case 'bank_unavailable': return 'WAIT_FOR_ISSUER';
    case 'authentication_required': return 'REQUEST_AUTHENTICATION';
    case 'network_timeout': return 'SMART_RETRY';
    default: return 'HUMAN_REVIEW';
  }
}

function requiresCustomerContact(action: RecoveryAction) {
  return ['REQUEST_NEW_MANDATE', 'SEND_PAYMENT_LINK', 'REQUEST_AUTHENTICATION'].includes(action);
}

function nextSafeExecutionTime(event: RecoveryEvent, policy: RecoveryPolicy) {
  const date = new Date(event.occurredAt);
  const hour = date.getUTCHours();
  const isQuietHours = hour >= policy.quietHoursStart || hour < policy.quietHoursEnd;
  if (!isQuietHours) return date.toISOString();

  date.setUTCDate(date.getUTCDate() + (hour >= policy.quietHoursStart ? 1 : 0));
  date.setUTCHours(policy.quietHoursEnd, 10, 0, 0);
  return date.toISOString();
}

export function planRecovery(event: RecoveryEvent, policy: RecoveryPolicy = defaultPolicy): RecoveryPlan {
  const action = selectAction(event);
  const contactRequired = requiresCustomerContact(action);
  const contactCapPassed = !contactRequired || event.contactsLast72Hours < policy.maximumContactsPer72Hours;
  const consentPassed = !contactRequired || event.hasMessagingConsent;
  const valueGatePassed = event.amount <= policy.humanApprovalAbove;
  const knownFailure = event.failureReason !== 'unknown';

  const policyChecks = [
    { name: 'Contact frequency cap', passed: contactCapPassed, detail: `${event.contactsLast72Hours}/${policy.maximumContactsPer72Hours} contacts in 72h` },
    { name: 'Messaging consent', passed: consentPassed, detail: contactRequired ? (event.hasMessagingConsent ? 'Consent verified' : 'Consent missing') : 'No message required' },
    { name: 'High-value approval', passed: valueGatePassed, detail: `${event.amount} against ${policy.humanApprovalAbove} threshold` },
    { name: 'Known failure taxonomy', passed: knownFailure, detail: event.failureReason },
  ];

  const hardBlock = !contactCapPassed || !consentPassed || !knownFailure;
  const executionMode = hardBlock ? 'blocked' : valueGatePassed ? 'autonomous' : 'approval_required';

  return {
    eventId: event.eventId,
    idempotencyKey: `recovery:${event.eventId}:${action.toLowerCase()}`,
    action: hardBlock ? 'HUMAN_REVIEW' : action,
    confidence: confidenceByReason[event.failureReason],
    executionMode,
    scheduledFor: nextSafeExecutionTime(event, policy),
    policyChecks,
    evidence: [
      `Failure classified as ${event.failureReason}`,
      `Payment rail is ${event.rail}`,
      `Issuer health is ${event.issuerHealthy ? 'normal' : 'degraded'}`,
      `Customer lifetime value is ${event.lifetimeValue}`,
    ],
  };
}
