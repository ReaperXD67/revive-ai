'use client';

import { useCallback, useEffect, useState, type FormEvent } from 'react';
import {
  Activity, ArrowRight, Check, CheckCircle2, Cloud, Database, Fingerprint,
  FlaskConical, GitCommit, LockKeyhole, Play, RadioTower, RefreshCw, Server,
  ShieldCheck, Terminal, XCircle,
} from 'lucide-react';
import type { FailureReason, PaymentRail, RecoveryPlan } from '../lib/recovery-engine';

type SystemProofPayload = {
  status: 'operational' | 'degraded';
  generatedAt: string;
  deployment: {
    platform: string;
    compute: string;
    region: string;
    commit: string;
    runtime: string;
  };
  backend: {
    framework: string;
    API: string;
    persistence: string;
    webhookBoundary: string;
    idempotency: string;
    policyVersion: string;
  };
  controls: Array<{ id: string; label: string; state: string }>;
  evidence: {
    decisionRecordsObserved: number;
    webhookRecordsObserved: number;
    resultWindow: number;
    hasMoreDecisions: boolean;
    hasMoreWebhooks: boolean;
    latestProofs: Array<{ proofHash: string; recordedAt: string; sizeBytes: number }>;
  };
  endpoints: Array<{ method: string; path: string; purpose: string }>;
  error?: string;
};

type SimulationResponse = {
  requestId: string;
  policyVersion: string;
  persistence: 'stored' | 'duplicate_suppressed' | 'degraded';
  plan: RecoveryPlan;
};

type ChallengeResult = {
  eventId: string;
  first: SimulationResponse;
  second: SimulationResponse;
};

type LabInput = {
  amount: number;
  failureReason: FailureReason;
  rail: PaymentRail;
  contactsLast72Hours: number;
  hasMessagingConsent: boolean;
  issuerHealthy: boolean;
  lifetimeValue: number;
};

const initialLab: LabInput = {
  amount: 47999,
  failureReason: 'card_expired',
  rail: 'card',
  contactsLast72Hours: 0,
  hasMessagingConsent: true,
  issuerHealthy: true,
  lifetimeValue: 148200,
};

async function simulate(body: Record<string, unknown>) {
  const response = await fetch('/api/recovery/simulate', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  });
  const payload = await response.json() as SimulationResponse & { error?: string };
  if (!response.ok || !payload.plan) throw new Error(payload.error ?? 'The decision API rejected this request.');
  return payload;
}

async function fetchSystemProof() {
  const response = await fetch('/api/proof', { cache: 'no-store' });
  const payload = await response.json() as SystemProofPayload;
  if (!response.ok || !payload.deployment || !payload.evidence) {
    throw new Error(payload.error ?? 'Live system evidence is unavailable.');
  }
  return payload;
}

function timeLabel(value: string) {
  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit', second: '2-digit',
  }).format(new Date(value));
}

export function SystemProof({ onToast }: { onToast: (message: string) => void }) {
  const [proof, setProof] = useState<SystemProofPayload | null>(null);
  const [proofError, setProofError] = useState('');
  const [proofLoading, setProofLoading] = useState(true);
  const [challenge, setChallenge] = useState<ChallengeResult | null>(null);
  const [challengeError, setChallengeError] = useState('');
  const [challengeRunning, setChallengeRunning] = useState(false);
  const [lab, setLab] = useState<LabInput>(initialLab);
  const [labResult, setLabResult] = useState<SimulationResponse | null>(null);
  const [labError, setLabError] = useState('');
  const [labRunning, setLabRunning] = useState(false);

  const loadProof = useCallback(async () => {
    setProofLoading(true);
    setProofError('');
    try {
      const payload = await fetchSystemProof();
      setProof(payload);
    } catch (error) {
      setProofError(error instanceof Error ? error.message : 'Live system evidence is unavailable.');
    } finally {
      setProofLoading(false);
    }
  }, []);

  useEffect(() => {
    let active = true;
    fetchSystemProof()
      .then((payload) => {
        if (!active) return;
        setProof(payload);
        setProofLoading(false);
      })
      .catch((error: unknown) => {
        if (!active) return;
        setProofError(error instanceof Error ? error.message : 'Live system evidence is unavailable.');
        setProofLoading(false);
      });
    return () => { active = false; };
  }, []);

  const runIdempotencyChallenge = async () => {
    setChallengeRunning(true);
    setChallenge(null);
    setChallengeError('');
    const eventId = `evt_recruiter_${crypto.randomUUID()}`;
    const request = {
      eventId,
      customerId: 'cust_idempotency_proof',
      amount: 7999,
      failureReason: 'network_timeout',
      rail: 'card',
      occurredAt: new Date().toISOString(),
      contactsLast72Hours: 0,
      hasMessagingConsent: true,
      issuerHealthy: true,
      lifetimeValue: 96000,
    };
    try {
      const first = await simulate(request);
      const second = await simulate(request);
      if (first.persistence !== 'stored' || second.persistence !== 'duplicate_suppressed') {
        throw new Error(`Unexpected persistence sequence: ${first.persistence} → ${second.persistence}.`);
      }
      setChallenge({ eventId, first, second });
      onToast('Idempotency proved: the duplicate write was suppressed by durable storage.');
      void loadProof();
    } catch (error) {
      setChallengeError(error instanceof Error ? error.message : 'The idempotency challenge failed.');
    } finally {
      setChallengeRunning(false);
    }
  };

  const runDecisionLab = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLabRunning(true);
    setLabResult(null);
    setLabError('');
    try {
      const result = await simulate({
        eventId: `evt_lab_${crypto.randomUUID()}`,
        customerId: 'cust_decision_lab',
        ...lab,
        occurredAt: new Date().toISOString(),
      });
      setLabResult(result);
      onToast(`Decision generated: ${result.plan.action.replaceAll('_', ' ')}.`);
      void loadProof();
    } catch (error) {
      setLabError(error instanceof Error ? error.message : 'The decision lab could not run.');
    } finally {
      setLabRunning(false);
    }
  };

  const isOperational = proof?.status === 'operational';

  return (
    <div className="view-stack proof-view">
      <section className="proof-hero">
        <div className="proof-hero-copy">
          <span className={`proof-status ${isOperational ? 'online' : ''}`}><i /> {proofLoading ? 'VERIFYING DEPLOYMENT' : isOperational ? 'LIVE SYSTEM VERIFIED' : 'EVIDENCE DEGRADED'}</span>
          <h2>This page proves itself.</h2>
          <p>Run a decision, write it to private immutable storage, replay the exact event, and watch the backend suppress the duplicate.</p>
          <div className="proof-chip-row">
            <span><Cloud size={13} /> {proof?.deployment.platform ?? 'Checking platform'}</span>
            <span><Server size={13} /> {proof?.deployment.compute ?? 'Checking compute'}</span>
            <span><Database size={13} /> Private audit store</span>
          </div>
        </div>
        <div className="proof-hero-meta">
          <span><small>DEPLOY REGION</small><strong>{proof?.deployment.region ?? '—'}</strong></span>
          <span><small>RUNNING COMMIT</small><strong><GitCommit size={13} /> {proof?.deployment.commit ?? '—'}</strong></span>
          <span><small>GENERATED LIVE</small><strong>{proof ? timeLabel(proof.generatedAt) : '—'}</strong></span>
          <button onClick={() => void loadProof()} disabled={proofLoading}><RefreshCw size={14} className={proofLoading ? 'spin' : ''} /> Refresh evidence</button>
        </div>
      </section>

      {proofError ? <div className="proof-error" role="alert"><XCircle size={17} /><span>{proofError} No infrastructure claim is being shown.</span></div> : null}

      <div className="proof-metrics">
        <article><span><Activity size={17} /></span><div><small>FUNCTIONS</small><strong>{proof?.status ?? (proofLoading ? 'checking' : 'unavailable')}</strong><p>{proof?.backend.API ?? 'Live probe pending'}</p></div></article>
        <article><span><Database size={17} /></span><div><small>IMMUTABLE RECORDS OBSERVED</small><strong>{proof ? proof.evidence.decisionRecordsObserved + proof.evidence.webhookRecordsObserved : '—'}</strong><p>Bounded to latest {proof?.evidence.resultWindow ?? 100}</p></div></article>
        <article><span><ShieldCheck size={17} /></span><div><small>CONTROLS ENFORCED</small><strong>{proof?.controls.length ?? '—'}</strong><p>Policy v{proof?.backend.policyVersion ?? '—'}</p></div></article>
        <article><span><Terminal size={17} /></span><div><small>RUNTIME</small><strong>{proof?.deployment.runtime ?? '—'}</strong><p>Next.js route handlers</p></div></article>
      </div>

      <div className="proof-challenge-grid">
        <section className="panel challenge-card">
          <div className="challenge-heading">
            <span className="challenge-icon"><Fingerprint size={20} /></span>
            <div><p className="eyebrow">LIVE IDEMPOTENCY CHALLENGE</p><h2>Send one event twice.</h2></div>
            <span className="zero-risk">NO PAYMENT SENT</span>
          </div>
          <p className="challenge-copy">Both requests hit the hosted API. The first creates an immutable record; the second must resolve to the same decision and be rejected as a duplicate write.</p>
          <div className="request-race">
            <div className={challenge ? 'passed' : challengeRunning ? 'running' : ''}><span>01</span><p><small>FIRST REQUEST</small><strong>{challenge ? challenge.first.persistence.replaceAll('_', ' ') : challengeRunning ? 'Writing…' : 'Waiting'}</strong></p>{challenge ? <CheckCircle2 size={17} /> : <RadioTower size={17} />}</div>
            <ArrowRight size={17} />
            <div className={challenge ? 'blocked' : challengeRunning ? 'running delay' : ''}><span>02</span><p><small>IDENTICAL REPLAY</small><strong>{challenge ? challenge.second.persistence.replaceAll('_', ' ') : challengeRunning ? 'Replaying…' : 'Waiting'}</strong></p>{challenge ? <ShieldCheck size={17} /> : <RadioTower size={17} />}</div>
          </div>
          {challenge ? <div className="challenge-verdict"><Check size={16} /><p><strong>Duplicate-safe under a real replay</strong><span>Event {challenge.eventId.slice(-12)} · decision key matched · one durable write</span></p></div> : null}
          {challengeError ? <div className="inline-error" role="alert"><XCircle size={15} />{challengeError}</div> : null}
          <button className="primary-dark challenge-run" onClick={runIdempotencyChallenge} disabled={challengeRunning}><Play size={14} fill="currentColor" /> {challengeRunning ? 'Running two live requests…' : challenge ? 'Run with a new event' : 'Prove duplicate safety'}</button>
        </section>

        <form className="panel decision-lab" onSubmit={runDecisionLab}>
          <div className="challenge-heading">
            <span className="challenge-icon lab-icon"><FlaskConical size={20} /></span>
            <div><p className="eyebrow">DECISION LAB</p><h2>Try to break the policy engine.</h2></div>
          </div>
          <div className="lab-fields">
            <label><span>Amount</span><input type="number" min="1" max="10000000" value={lab.amount} onChange={(event) => setLab({ ...lab, amount: Number(event.target.value) })} /></label>
            <label><span>Failure reason</span><select value={lab.failureReason} onChange={(event) => setLab({ ...lab, failureReason: event.target.value as FailureReason })}><option value="insufficient_balance">Insufficient balance</option><option value="mandate_revoked">Mandate revoked</option><option value="card_expired">Card expired</option><option value="bank_unavailable">Bank unavailable</option><option value="authentication_required">Authentication required</option><option value="network_timeout">Network timeout</option><option value="unknown">Unknown failure</option></select></label>
            <label><span>Payment rail</span><select value={lab.rail} onChange={(event) => setLab({ ...lab, rail: event.target.value as PaymentRail })}><option value="upi_autopay">UPI AutoPay</option><option value="card">Card</option><option value="emandate">eMandate</option></select></label>
            <label><span>Contacts in 72h</span><input type="number" min="0" max="20" value={lab.contactsLast72Hours} onChange={(event) => setLab({ ...lab, contactsLast72Hours: Number(event.target.value) })} /></label>
          </div>
          <div className="lab-switches">
            <label><input type="checkbox" checked={lab.issuerHealthy} onChange={(event) => setLab({ ...lab, issuerHealthy: event.target.checked })} /><span><strong>Issuer healthy</strong><small>Turn off to trigger a protective hold</small></span></label>
            <label><input type="checkbox" checked={lab.hasMessagingConsent} onChange={(event) => setLab({ ...lab, hasMessagingConsent: event.target.checked })} /><span><strong>Messaging consent</strong><small>Turn off to test the trust boundary</small></span></label>
          </div>
          {labResult ? <DecisionResult result={labResult} /> : <div className="lab-empty"><LockKeyhole size={17} /><span>Try ₹47,999 for approval, 2 contacts for a block, or disable issuer health for a protective hold.</span></div>}
          {labError ? <div className="inline-error" role="alert"><XCircle size={15} />{labError}</div> : null}
          <button className="primary-dark lab-run" type="submit" disabled={labRunning}><FlaskConical size={14} /> {labRunning ? 'Evaluating policy…' : 'Run live decision'}</button>
        </form>
      </div>

      <div className="proof-detail-grid">
        <section className="panel control-panel">
          <div className="panel-heading"><div><p className="eyebrow">ENFORCED AT RUNTIME</p><h2>Control plane</h2></div><span className="live-indicator"><i /> {proof?.controls.length ?? 0} ACTIVE</span></div>
          <div className="control-list">{proof?.controls.map((control) => <div key={control.id}><span><Check size={13} /></span><p><strong>{control.label}</strong><small>{control.state} · server-side</small></p></div>) ?? <p className="loading-copy">Loading controls…</p>}</div>
        </section>
        <section className="panel endpoint-panel">
          <div className="panel-heading"><div><p className="eyebrow">HOSTED API SURFACE</p><h2>Live endpoints</h2></div><Server size={18} /></div>
          <div className="endpoint-list">{proof?.endpoints.map((endpoint) => <div key={endpoint.path}><b className={endpoint.method === 'GET' ? 'get' : ''}>{endpoint.method}</b><code>{endpoint.path}</code><span>{endpoint.purpose}</span></div>) ?? <p className="loading-copy">Loading endpoints…</p>}</div>
        </section>
        <section className="panel evidence-ledger">
          <div className="panel-heading"><div><p className="eyebrow">PRIVATE BLOB · SAFE METADATA ONLY</p><h2>Latest decision proofs</h2></div><Database size={18} /></div>
          <div className="proof-ledger-list">{proof?.evidence.latestProofs.map((item) => <div key={`${item.proofHash}-${item.recordedAt}`}><Fingerprint size={14} /><code>{item.proofHash}</code><span>{timeLabel(item.recordedAt)}</span><small>{item.sizeBytes} B</small></div>) ?? <p className="loading-copy">Loading proof hashes…</p>}</div>
        </section>
      </div>
    </div>
  );
}

function DecisionResult({ result }: { result: SimulationResponse }) {
  const passed = result.plan.policyChecks.filter((check) => check.passed).length;
  return (
    <div className={`lab-result ${result.plan.executionMode}`}>
      <div><small>DECISION</small><strong>{result.plan.action.replaceAll('_', ' ')}</strong><span>{Math.round(result.plan.confidence * 100)}% confidence · {result.plan.executionMode.replaceAll('_', ' ')}</span></div>
      <div className="policy-score"><strong>{passed}/{result.plan.policyChecks.length}</strong><span>policy checks passed</span></div>
      <div className="lab-checks">{result.plan.policyChecks.map((check) => <span className={check.passed ? 'pass' : 'fail'} key={check.name}>{check.passed ? <Check size={12} /> : <XCircle size={12} />}{check.name}</span>)}</div>
      <p><Database size={13} /> Audit record: {result.persistence.replaceAll('_', ' ')} · request {result.requestId.slice(0, 8)}…</p>
    </div>
  );
}
