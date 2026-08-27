export type NavView = 'command' | 'queue' | 'playbooks' | 'experiments' | 'audit' | 'proof';

export type RecoveryCase = {
  id: string;
  initials: string;
  customer: string;
  plan: string;
  amount: number;
  failure: string;
  method: 'UPI AutoPay' | 'Card' | 'eMandate';
  confidence: number;
  action: string;
  eta: string;
  status: 'Queued' | 'Review' | 'Watching' | 'Recovered';
  accent: string;
  signals: string[];
};

export const recoveryCases: RecoveryCase[] = [
  {
    id: 'CASE-4821', initials: 'NM', customer: 'Nisha Menon', plan: 'Pro annual', amount: 11999,
    failure: 'Insufficient balance', method: 'UPI AutoPay', confidence: 94,
    action: 'Retry Fri, 09:10', eta: '18h', status: 'Queued', accent: '#ffd6c9',
    signals: ['Salary window begins Friday', '2/2 previous retries succeeded', 'No contact needed'],
  },
  {
    id: 'CASE-4818', initials: 'AK', customer: 'Arjun Khanna', plan: 'Teams monthly', amount: 8499,
    failure: 'Mandate revoked', method: 'UPI AutoPay', confidence: 88,
    action: 'Send UPI re-mandate', eta: 'Now', status: 'Review', accent: '#d8e4ff',
    signals: ['Mandate cannot be retried', 'WhatsApp preferred', 'High lifetime value'],
  },
  {
    id: 'CASE-4809', initials: 'PS', customer: 'Priya Shah', plan: 'Growth annual', amount: 47999,
    failure: 'Card expired', method: 'Card', confidence: 91,
    action: 'Request method update', eta: '12m', status: 'Queued', accent: '#f7ddad',
    signals: ['Card expired this month', 'UPI used for last add-on', 'Personalised link ready'],
  },
  {
    id: 'CASE-4804', initials: 'RV', customer: 'Rahul Verma', plan: 'Pro monthly', amount: 2499,
    failure: 'Bank unavailable', method: 'Card', confidence: 79,
    action: 'Observe bank health', eta: '42m', status: 'Watching', accent: '#d8f0df',
    signals: ['Issuer incident detected', 'Retrying now could hurt acceptance', 'Auto-release at green status'],
  },
  {
    id: 'CASE-4797', initials: 'ZI', customer: 'Zoya Iqbal', plan: 'Teams annual', amount: 89999,
    failure: 'AFA required', method: 'eMandate', confidence: 82,
    action: 'Request approval', eta: '2h', status: 'Review', accent: '#e5d9ff',
    signals: ['Amount exceeds no-AFA threshold', 'CFO contact on account', 'Human approval policy applies'],
  },
  {
    id: 'CASE-4788', initials: 'DR', customer: 'Dev Rao', plan: 'Starter annual', amount: 11999,
    failure: 'Network timeout', method: 'UPI AutoPay', confidence: 96,
    action: 'Smart retry completed', eta: 'Recovered', status: 'Recovered', accent: '#d7eed1',
    signals: ['Duplicate-safe event received', 'Network route healthy', 'Recovered in 31 minutes'],
  },
  {
    id: 'CASE-4776', initials: 'MT', customer: 'Meera Thomas', plan: 'Pro monthly', amount: 3299,
    failure: 'Generic bank decline', method: 'Card', confidence: 73,
    action: 'Route to UPI link', eta: '4h', status: 'Queued', accent: '#ffe2cf',
    signals: ['Two card retries exhausted', 'UPI conversion propensity 71%', 'Soft-touch message selected'],
  },
];

export const agentActions = [
  { time: '09:42', title: 'Queued 23 balance-aware retries', detail: 'Salary-window model · ₹58,420 at risk', tone: 'lime' },
  { time: '09:36', title: 'Paused retries for HDFC issuer', detail: 'Bank health degraded · 14 customers protected', tone: 'blue' },
  { time: '09:21', title: 'Recovered Growth annual plan', detail: 'UPI method switch · ₹47,999 collected', tone: 'green' },
  { time: '08:58', title: 'Escalated 6 high-value accounts', detail: 'Value threshold policy · approval required', tone: 'orange' },
];

export const playbooks = [
  {
    name: 'Balance-aware rescue', trigger: 'Insufficient balance', channel: 'Silent retry',
    recovery: '72.4%', attempts: '186 runs', status: 'Autonomous', color: '#d8ff4f',
    steps: ['Score payday window', 'Check issuer health', 'Retry at predicted hour', 'Verify via webhook'],
  },
  {
    name: 'Mandate repair', trigger: 'Revoked or paused mandate', channel: 'WhatsApp + link',
    recovery: '48.1%', attempts: '104 runs', status: 'Guarded', color: '#9ec5ff',
    steps: ['Detect hard failure', 'Create secure re-mandate link', 'Personalise explanation', 'Watch activation'],
  },
  {
    name: 'Payment method switch', trigger: 'Expired card / hard decline', channel: 'Email → UPI',
    recovery: '57.8%', attempts: '73 runs', status: 'Autonomous', color: '#ffbe8a',
    steps: ['Classify decline', 'Select preferred alternate rail', 'Create Payment Link', 'Suppress after success'],
  },
  {
    name: 'Trust-first save', trigger: 'High-value or sensitive account', channel: 'Human-in-loop',
    recovery: '81.2%', attempts: '49 runs', status: 'Approval', color: '#d9c5ff',
    steps: ['Calculate customer value', 'Draft account context', 'Request operator approval', 'Execute once approved'],
  },
];

export const auditEvents = [
  { id: 'DEC-93418', time: '09:42:16', agent: 'Retry Optimizer', action: 'Scheduled retry', target: 'CASE-4821', policy: 'Within policy', confidence: '94%', hash: 'a10f…9d2c' },
  { id: 'DEC-93417', time: '09:36:02', agent: 'Bank Health Sentinel', action: 'Paused 14 actions', target: 'HDFC issuer', policy: 'Protective hold', confidence: '99%', hash: '71bc…e221' },
  { id: 'DEC-93416', time: '09:21:44', agent: 'Rail Router', action: 'Verified collection', target: 'CASE-4788', policy: 'Within policy', confidence: '96%', hash: '459a…09fd' },
  { id: 'DEC-93415', time: '08:58:11', agent: 'Trust Guardian', action: 'Requested approval', target: '6 accounts', policy: 'Value gate', confidence: '100%', hash: 'c882…e49a' },
  { id: 'DEC-93414', time: '08:44:29', agent: 'Message Composer', action: 'Selected message B', target: 'CASE-4776', policy: 'Frequency safe', confidence: '86%', hash: '06ed…b731' },
  { id: 'DEC-93413', time: '08:31:07', agent: 'Event Listener', action: 'Deduplicated webhook', target: 'evt_RP21K8', policy: 'Idempotent', confidence: '100%', hash: 'd381…3c87' },
];

export const chartBars = [31, 38, 34, 47, 43, 55, 61, 53, 68, 64, 77, 84, 73, 92];
export const baselineBars = [25, 29, 27, 33, 31, 36, 39, 37, 43, 42, 47, 51, 49, 53];

export const researchFacts = [
  'Razorpay subscription failures move accounts to pending, then halted after retries.',
  'Failure payloads expose source, step and reason—enough context for targeted recovery.',
  'Webhook delivery can be duplicated or out of order, so every action is idempotent.',
  'UPI AutoPay, cards and eMandate each need different recovery routes.',
];
