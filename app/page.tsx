'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  Activity, ArrowRight, ArrowUpRight, Bell, Bot, Check, CheckCircle2,
  ChevronDown, ChevronRight, CircleAlert, CircleDollarSign, Clock3, Command,
  Copy, FileCheck2, Fingerprint, FlaskConical, Gauge, Layers3, ListFilter, LockKeyhole,
  Menu, MoreHorizontal, PauseCircle, Play, RadioTower, RefreshCw, Search,
  Send, Settings2, ShieldCheck, SlidersHorizontal, Sparkles, TrendingUp,
  UserCheck, Webhook, X, Zap,
} from 'lucide-react';
import {
  agentActions, auditEvents, baselineBars, chartBars, playbooks,
  recoveryCases, researchFacts, type NavView, type RecoveryCase,
} from './data';
import type { RecoveryPlan } from '../lib/recovery-engine';
import { SystemProof } from './system-proof';
import { LandingPage } from './landing-page';

const navItems = [
  { id: 'command' as NavView, label: 'Command center', icon: Command },
  { id: 'queue' as NavView, label: 'Recovery queue', icon: Layers3, count: 68 },
  { id: 'playbooks' as NavView, label: 'Agent playbooks', icon: Bot },
  { id: 'experiments' as NavView, label: 'Experiments', icon: FlaskConical },
  { id: 'audit' as NavView, label: 'Audit trail', icon: ShieldCheck },
  { id: 'proof' as NavView, label: 'System proof', icon: Fingerprint },
];

const viewMeta: Record<NavView, { eyebrow: string; title: string; description: string }> = {
  command: { eyebrow: 'SIMULATED PORTFOLIO · LIVE BACKEND', title: 'Revenue command center', description: 'Your autonomous recovery operation, in one view.' },
  queue: { eyebrow: '68 OPEN CASES', title: 'Recovery queue', description: 'Every failed payment, ranked by recoverability and value.' },
  playbooks: { eyebrow: '4 ACTIVE ROUTES', title: 'Agent playbooks', description: 'Failure-aware strategies with explicit autonomy boundaries.' },
  experiments: { eyebrow: 'CAUSAL MEASUREMENT', title: 'Recovery experiments', description: 'Prove incremental revenue with holdouts, not vanity attribution.' },
  audit: { eyebrow: 'IMMUTABLE DECISIONS', title: 'Agent audit trail', description: 'Inspect the evidence, policies, and tools behind every action.' },
  proof: { eyebrow: 'LIVE ENGINEERING EVIDENCE', title: 'System proof', description: "Challenge the backend. Do not take the interface's word for it." },
};

const formatMoney = (amount: number) => `₹${amount.toLocaleString('en-IN')}`;

type SimulationResponse = {
  requestId: string;
  policyVersion: string;
  persistence: 'stored' | 'duplicate_suppressed' | 'degraded';
  plan: RecoveryPlan;
};

export default function Home() {
  const [experience, setExperience] = useState<'story' | 'command'>('story');
  const [launchDemo, setLaunchDemo] = useState(false);

  const openCommand = () => {
    setLaunchDemo(false);
    setExperience('command');
    window.scrollTo({ top: 0, behavior: 'auto' });
  };

  const openDemo = () => {
    setLaunchDemo(true);
    setExperience('command');
    window.scrollTo({ top: 0, behavior: 'auto' });
  };

  if (experience === 'story') {
    return <LandingPage onOpenCommand={openCommand} onRunDemo={openDemo} />;
  }

  return <DashboardApp initialDemoOpen={launchDemo} onBackToStory={() => setExperience('story')} />;
}

function DashboardApp({ initialDemoOpen = false, onBackToStory }: { initialDemoOpen?: boolean; onBackToStory: () => void }) {
  const [view, setView] = useState<NavView>('command');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedCase, setSelectedCase] = useState<RecoveryCase | null>(null);
  const [planOpen, setPlanOpen] = useState(false);
  const [demoOpen, setDemoOpen] = useState(initialDemoOpen);
  const [demoStep, setDemoStep] = useState(0);
  const [running, setRunning] = useState(false);
  const [demoResult, setDemoResult] = useState<SimulationResponse | null>(null);
  const [demoError, setDemoError] = useState('');
  const [toast, setToast] = useState('');
  const [query, setQuery] = useState('');
  const [queueFilter, setQueueFilter] = useState('All cases');

  const meta = viewMeta[view];
  const visibleCases = useMemo(() => recoveryCases.filter((item) => {
    const matchesQuery = `${item.customer} ${item.failure} ${item.method}`.toLowerCase().includes(query.toLowerCase());
    const matchesFilter = queueFilter === 'All cases' || item.status === queueFilter;
    return matchesQuery && matchesFilter;
  }), [query, queueFilter]);

  useEffect(() => {
    if (!running) return;
    const timer = window.setTimeout(() => {
      if (demoStep >= 3 && demoResult) {
        setDemoStep(4);
        setRunning(false);
        setToast('Simulation verified: decision stored and recovery completed safely.');
      } else if (demoStep >= 3) {
        return;
      } else {
        setDemoStep((step) => step + 1);
      }
    }, 900);
    return () => window.clearTimeout(timer);
  }, [running, demoStep, demoResult]);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(''), 4200);
    return () => window.clearTimeout(timer);
  }, [toast]);

  useEffect(() => {
    const closeOverlay = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      setSelectedCase(null);
      setPlanOpen(false);
      setDemoOpen(false);
      setRunning(false);
    };
    window.addEventListener('keydown', closeOverlay);
    return () => window.removeEventListener('keydown', closeOverlay);
  }, []);

  const chooseView = (next: NavView) => {
    setView(next);
    setSidebarOpen(false);
    setSelectedCase(null);
  };

  const startDemo = async () => {
    setDemoStep(0);
    setDemoResult(null);
    setDemoError('');
    setRunning(true);
    try {
      const response = await fetch('/api/recovery/simulate', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          eventId: `evt_demo_${crypto.randomUUID()}`, customerId: 'cust_demo_nisha', amount: 11999,
          failureReason: 'insufficient_balance', rail: 'upi_autopay',
          occurredAt: '2026-08-27T09:42:00.000Z', contactsLast72Hours: 0,
          hasMessagingConsent: true, issuerHealthy: true, lifetimeValue: 148200,
        }),
      });
      const payload = await response.json() as SimulationResponse & { error?: string };
      if (!response.ok || !payload.plan) throw new Error(payload.error ?? 'The recovery API rejected the simulation.');
      setDemoResult(payload);
    } catch (error) {
      setRunning(false);
      setDemoError(error instanceof Error ? error.message : 'The recovery API is unavailable.');
    }
  };

  const openDemo = () => {
    setDemoStep(0);
    setDemoResult(null);
    setDemoError('');
    setDemoOpen(true);
  };

  return (
    <main className="app-shell">
      <button className="mobile-menu" onClick={() => setSidebarOpen(true)} aria-label="Open navigation"><Menu size={19} /></button>
      {sidebarOpen && <button className="sidebar-scrim" onClick={() => setSidebarOpen(false)} aria-label="Close navigation" />}
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-top">
          <button className="brand-mark" onClick={onBackToStory} aria-label="Back to the Revive story"><span>R</span> Revive</button>
          <button className="mobile-close" onClick={() => setSidebarOpen(false)} aria-label="Close navigation"><X size={18} /></button>
        </div>
        <div className="nav-section-label">OPERATE</div>
        <nav aria-label="Primary navigation">
          {navItems.map(({ id, label, icon: Icon, count }) => (
            <button className={view === id ? 'nav-item active' : 'nav-item'} key={id} onClick={() => chooseView(id)} aria-current={view === id ? 'page' : undefined}>
              <Icon size={17} strokeWidth={1.8} /><span>{label}</span>{count ? <b>{count}</b> : null}
            </button>
          ))}
        </nav>
        <div className="nav-section-label secondary-label">SYSTEM</div>
        <button className="nav-item" onClick={() => chooseView('proof')} aria-label="Inspect live backend connections"><Webhook size={17} /><span>Connections</span><i className="healthy-dot" /></button>
        <button className="nav-item" onClick={() => chooseView('audit')} aria-label="Inspect recovery guardrails"><Settings2 size={17} /><span>Guardrails</span></button>
        <div className="autopilot-card">
          <div className="status-line"><span className="pulse" /> AUTOPILOT LIVE</div>
          <strong>₹3.84L recovered</strong>
          <p>412 decisions · 98.7% within policy</p>
          <div className="mini-progress"><i /></div>
        </div>
        <button className="merchant-switcher">
          <span className="merchant-avatar">NL</span><span><strong>Northstar Labs</strong><small>Live workspace</small></span><ChevronDown size={15} />
        </button>
      </aside>

      <section className="workspace">
        <header className="topbar">
          <div><p className="eyebrow">{meta.eyebrow}</p><h1>{meta.title}</h1><span className="view-description">{meta.description}</span></div>
          <div className="topbar-actions">
            <label className="global-search"><Search size={15} /><input value={query} onChange={(event) => setQuery(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter' && query.trim()) chooseView('queue'); }} placeholder="Search customers" aria-label="Search customers" /><kbd>↵</kbd></label>
            <button className="backend-proof-link" onClick={() => chooseView('proof')}><i /> Backend live</button>
            <button className="icon-button" aria-label="Notifications"><Bell size={17} /><i /></button>
            <button className="demo-button" onClick={openDemo}><Play size={14} fill="currentColor" /> Run live demo</button>
            <button className="avatar" aria-label="Open account menu">AK</button>
          </div>
        </header>

        {view === 'command' && <CommandCenter onReview={() => setPlanOpen(true)} onSelectCase={setSelectedCase} onViewAudit={() => chooseView('audit')} onViewQueue={() => chooseView('queue')} />}
        {view === 'queue' && <RecoveryQueue cases={visibleCases} filter={queueFilter} onFilter={setQueueFilter} onSelectCase={setSelectedCase} />}
        {view === 'playbooks' && <Playbooks onToast={setToast} />}
        {view === 'experiments' && <Experiments />}
        {view === 'audit' && <AuditTrail />}
        {view === 'proof' && <SystemProof onToast={setToast} />}
      </section>

      {selectedCase && <CaseDrawer item={selectedCase} onClose={() => setSelectedCase(null)} onToast={setToast} />}
      {planOpen && <PlanDrawer onClose={() => setPlanOpen(false)} onSelectCase={(item) => { setPlanOpen(false); setSelectedCase(item); }} onToast={setToast} />}
      {demoOpen && <DemoModal step={demoStep} running={running} result={demoResult} error={demoError} onStart={startDemo} onClose={() => { setDemoOpen(false); setRunning(false); }} />}
      {toast && <div className="toast" role="status"><CheckCircle2 size={18} /><span>{toast}</span><button onClick={() => setToast('')} aria-label="Dismiss"><X size={15} /></button></div>}
    </main>
  );
}

function CommandCenter({ onReview, onSelectCase, onViewAudit, onViewQueue }: { onReview: () => void; onSelectCase: (item: RecoveryCase) => void; onViewAudit: () => void; onViewQueue: () => void }) {
  return (
    <div className="view-stack">
      <section className="briefing">
        <div className="agent-orb"><Bot size={20} /></div>
        <div><p>SIMULATED RECOVERY BRIEFING · LIVE ENGINE</p><h2>Good morning. I found <em>₹1.72L</em> at risk today.</h2><span>68 representative renewals are recoverable. I’ve safely queued 51 and held 17 for review.</span></div>
        <div className="briefing-tags"><span>14 issuer holds</span><span>6 approvals</span></div>
        <button className="primary-action" onClick={onReview}>Review agent plan <ArrowUpRight size={16} /></button>
      </section>

      <div className="metric-grid">
        <Metric icon={CircleDollarSign} label="Recovered this month" value="₹3,84,260" note="↑ 18.4% vs last month" positive />
        <Metric icon={TrendingUp} label="Incremental uplift" value="+26.3%" note="95% confidence" positive />
        <Metric icon={Clock3} label="Median time to recover" value="19.6h" note="11.2 hours faster" />
        <Metric icon={ShieldCheck} label="Safe autonomy" value="98.7%" note="406 of 412 actions" />
      </div>

      <div className="dashboard-grid">
        <section className="panel chart-panel">
          <div className="panel-heading"><div><p className="eyebrow">RECOVERY PERFORMANCE</p><h2>Revenue rescued over time</h2></div><button className="range-control">Last 30 days <ChevronDown size={13} /></button></div>
          <div className="chart-summary"><div><span>Recovered by Revive</span><strong>₹3.84L</strong></div><div><span>Expected baseline</span><strong>₹3.04L</strong></div><span className="uplift-badge">+₹80,310 incremental</span></div>
          <div className="recovery-chart" aria-label="Recovered revenue versus baseline over 30 days">
            <div className="y-axis"><span>₹4L</span><span>₹3L</span><span>₹2L</span><span>₹1L</span><span>₹0</span></div>
            <div className="bar-area">{chartBars.map((height, index) => <div className="bar-pair" key={index} title={`Day ${index + 1}`}><i style={{ height: `${baselineBars[index]}%` }} /><b style={{ height: `${height}%` }} /></div>)}<div className="chart-tooltip"><small>AUG 24</small><strong>₹31,840</strong><span>+₹7,420 uplift</span></div></div>
          </div>
          <div className="chart-days"><span>Aug 01</span><span>Aug 08</span><span>Aug 15</span><span>Aug 22</span><span>Aug 27</span></div>
        </section>

        <section className="panel action-feed">
          <div className="panel-heading"><div><p className="eyebrow">AGENT ACTIVITY</p><h2>What Revive is doing</h2></div><span className="live-indicator"><i /> LIVE</span></div>
          <div className="activity-list">{agentActions.map((action) => <div className="activity-row" key={action.time}><span className={`activity-icon ${action.tone}`}><Zap size={14} /></span><div><strong>{action.title}</strong><span>{action.detail}</span></div><time>{action.time}</time></div>)}</div>
          <button className="text-button" onClick={onViewAudit}>View full audit trail <ArrowRight size={14} /></button>
        </section>
      </div>

      <section className="panel priority-panel">
        <div className="panel-heading"><div><p className="eyebrow">PRIORITY QUEUE</p><h2>Highest-value recovery opportunities</h2></div><button className="text-button" onClick={onViewQueue}>View all 68 cases <ArrowRight size={14} /></button></div>
        <div className="case-list compact">{recoveryCases.slice(0, 4).map((item) => <CaseRow item={item} key={item.id} onClick={() => onSelectCase(item)} />)}</div>
      </section>
    </div>
  );
}

function Metric({ icon: Icon, label, value, note, positive }: { icon: typeof Activity; label: string; value: string; note: string; positive?: boolean }) {
  return <article><div className="metric-label"><Icon size={17} /> {label}<CircleAlert size={12} /></div><strong>{value}</strong><span className={positive ? 'positive' : ''}>{note}</span><div className="metric-spark">{[24, 31, 28, 40, 37, 48, 56].map((height, i) => <i key={i} style={{ height }} />)}</div></article>;
}

function RecoveryQueue({ cases, filter, onFilter, onSelectCase }: { cases: RecoveryCase[]; filter: string; onFilter: (filter: string) => void; onSelectCase: (item: RecoveryCase) => void }) {
  const filters = ['All cases', 'Queued', 'Review', 'Watching', 'Recovered'];
  return (
    <div className="view-stack">
      <section className="queue-hero"><div className="queue-hero-stat"><span>At risk today</span><strong>₹1,72,480</strong><small>across 68 renewals</small></div><div className="risk-strip"><div><span>Safe to automate</span><strong>51</strong><i><b style={{ width: '75%' }} /></i></div><div><span>Needs approval</span><strong>6</strong><i><b style={{ width: '32%' }} /></i></div><div><span>Monitoring</span><strong>11</strong><i><b style={{ width: '46%' }} /></i></div></div><button className="outline-action"><SlidersHorizontal size={15} /> Edit triage policy</button></section>
      <section className="panel queue-panel">
        <div className="queue-toolbar"><div className="filter-tabs">{filters.map((item) => <button key={item} className={filter === item ? 'active' : ''} onClick={() => onFilter(item)}>{item}{item === 'Review' && <b>6</b>}</button>)}</div><div className="toolbar-actions"><button><ListFilter size={14} /> Filters</button><button><ArrowUpRight size={14} /> Export</button></div></div>
        <div className="table-head"><span>Customer</span><span>Failure context</span><span>Amount</span><span>AI confidence</span><span>Next best action</span><span>Status</span><span /></div>
        <div className="case-list">{cases.map((item) => <CaseRow item={item} key={item.id} onClick={() => onSelectCase(item)} full />)}{!cases.length && <div className="empty-state"><Search size={24} /><strong>No matching cases</strong><span>Try a different search or status filter.</span></div>}</div>
      </section>
    </div>
  );
}

function CaseRow({ item, onClick, full = false }: { item: RecoveryCase; onClick: () => void; full?: boolean }) {
  return <button className={`case-row ${full ? 'full' : ''}`} onClick={onClick}><span className="customer-cell"><i style={{ background: item.accent }}>{item.initials}</i><span><strong>{item.customer}</strong><small>{item.plan} · {item.method}</small></span></span><span className="failure-cell"><strong>{item.failure}</strong><small>{item.id}</small></span><strong className="amount-cell">{formatMoney(item.amount)}</strong>{full && <span className="confidence-cell"><i><b style={{ width: `${item.confidence}%` }} /></i><strong>{item.confidence}%</strong></span>}<span className="action-cell"><strong>{item.action}</strong><small>ETA {item.eta}</small></span><span className={`status-pill ${item.status.toLowerCase()}`}>{item.status}</span><ChevronRight size={16} /></button>;
}

function Playbooks({ onToast }: { onToast: (message: string) => void }) {
  return (
    <div className="view-stack">
      <section className="orchestration-map"><div className="map-title"><span className="agent-orb"><Bot size={19} /></span><div><p className="eyebrow">MULTI-AGENT ORCHESTRATION</p><h2>One goal. Specialist agents. Guarded execution.</h2></div></div><div className="agent-flow"><FlowNode icon={Webhook} title="Event Listener" note="Verifies + deduplicates" /><ArrowRight size={18} /><FlowNode icon={Sparkles} title="Recovery Brain" note="Classifies + scores" /><ArrowRight size={18} /><FlowNode icon={ShieldCheck} title="Trust Guardian" note="Enforces policies" /><ArrowRight size={18} /><FlowNode icon={Send} title="Action Agents" note="Retry, route, message" /></div><div className="flow-health"><span><i /> 99.99% event processing</span><span>214 ms median decision time</span><span>0 policy breaches</span></div></section>
      <div className="section-heading-row"><div><p className="eyebrow">ACTIVE PLAYBOOKS</p><h2>Recovery strategies</h2></div><button className="primary-dark" onClick={() => onToast('New playbook draft created.')}>+ New playbook</button></div>
      <div className="playbook-grid">{playbooks.map((book) => <article className="playbook-card" key={book.name}><div className="playbook-top"><span className="playbook-icon" style={{ background: book.color }}><Zap size={17} /></span><span className={`mode-pill ${book.status.toLowerCase()}`}>{book.status}</span><button aria-label={`More options for ${book.name}`}><MoreHorizontal size={17} /></button></div><h3>{book.name}</h3><p>When <strong>{book.trigger.toLowerCase()}</strong> occurs, recover with {book.channel.toLowerCase()}.</p><div className="step-list">{book.steps.map((step, i) => <div key={step}><span>{i + 1}</span><p>{step}</p>{i < book.steps.length - 1 && <i />}</div>)}</div><div className="playbook-stats"><span><small>30D RECOVERY</small><strong>{book.recovery}</strong></span><span><small>VOLUME</small><strong>{book.attempts}</strong></span></div></article>)}</div>
    </div>
  );
}

function FlowNode({ icon: Icon, title, note }: { icon: typeof Webhook; title: string; note: string }) {
  return <div className="flow-node"><span><Icon size={17} /></span><div><strong>{title}</strong><small>{note}</small></div></div>;
}

function Experiments() {
  return (
    <div className="view-stack">
      <section className="experiment-hero"><div><p className="eyebrow">MEASURED WITH 10% HOLDOUT</p><h2>Revive created <em>₹80,310</em> in incremental revenue this month.</h2><span>Not correlation. The same customer mix without agent treatment recovered ₹3.04L.</span></div><div className="confidence-ring"><div><strong>95%</strong><span>confidence</span></div></div></section>
      <div className="experiment-grid">
        <section className="panel active-experiment"><div className="panel-heading"><div><p className="eyebrow">RUNNING · DAY 18 OF 30</p><h2>Salary-window retries</h2></div><span className="live-indicator"><i /> HEALTHY</span></div><p className="experiment-copy">Does retrying insufficient-balance failures near a predicted salary window outperform the standard next-day retry?</p><div className="variant-row"><div className="variant-label"><span>A</span><p><strong>Revive timing</strong><small>2,148 customers</small></p></div><strong className="variant-result">71.8% <small>recovered</small></strong><i><b style={{ width: '72%' }} /></i></div><div className="variant-row control"><div className="variant-label"><span>B</span><p><strong>Next-day retry</strong><small>239 holdout customers</small></p></div><strong className="variant-result">56.3% <small>recovered</small></strong><i><b style={{ width: '56%' }} /></i></div><div className="experiment-insight"><Sparkles size={17} /><p><strong>Likely winner: Variant A</strong><span>+15.5 pts absolute uplift · +₹42,670 incremental revenue</span></p></div></section>
        <section className="panel segment-panel"><div className="panel-heading"><div><p className="eyebrow">SEGMENT INSIGHT</p><h2>Where uplift comes from</h2></div><button className="icon-plain"><MoreHorizontal size={17} /></button></div><div className="segment-list">{[['UPI AutoPay', '+18.2 pts', 88], ['eMandate', '+13.7 pts', 68], ['Cards', '+9.4 pts', 49], ['High-LTV plans', '+21.1 pts', 100]].map(([name, value, width]) => <div key={name}><span>{name}</span><i><b style={{ width: `${width}%` }} /></i><strong>{value}</strong></div>)}</div><div className="methodology-note"><LockKeyhole size={16} /><p><strong>Guarded methodology</strong><span>Stable bucketing, minimum sample size and no mid-flight peeking.</span></p></div></section>
      </div>
      <section className="panel experiment-table"><div className="panel-heading"><div><p className="eyebrow">EXPERIMENT LIBRARY</p><h2>Recent learnings</h2></div><button className="outline-action"><FlaskConical size={14} /> Design experiment</button></div>{[['UPI-first recovery link', 'Winner', '+11.8 pts', '₹31,420', 'Completed 14 Aug'], ['Empathetic vs direct copy', 'Winner', '+5.2 pts', '₹12,860', 'Completed 03 Aug'], ['Two-hour bank-health hold', 'Promising', '+7.1 pts', '₹9,380', 'Running · day 9'], ['SMS after WhatsApp no-open', 'No lift', '+0.4 pts', '₹740', 'Completed 22 Jul']].map((row) => <div className="experiment-table-row" key={row[0]}><span><FlaskConical size={15} /><strong>{row[0]}</strong></span><span className={`result-tag ${row[1].toLowerCase().replace(' ', '-')}`}>{row[1]}</span><span><small>UPLIFT</small><strong>{row[2]}</strong></span><span><small>INCREMENTAL</small><strong>{row[3]}</strong></span><time>{row[4]}</time><ChevronRight size={16} /></div>)}</section>
    </div>
  );
}

function AuditTrail() {
  return (
    <div className="view-stack">
      <div className="audit-summary"><article><span><FileCheck2 size={17} /></span><div><small>DECISIONS LOGGED</small><strong>18,492</strong></div></article><article><span><ShieldCheck size={17} /></span><div><small>POLICY COMPLIANCE</small><strong>99.98%</strong></div></article><article><span><RefreshCw size={17} /></span><div><small>DUPLICATES BLOCKED</small><strong>347</strong></div></article><article><span><UserCheck size={17} /></span><div><small>HUMAN APPROVALS</small><strong>126</strong></div></article></div>
      <section className="panel audit-panel"><div className="audit-toolbar"><div className="filter-button"><RadioTower size={14} /><span>Live stream</span><i /></div><div><button><ListFilter size={14} /> All agents</button><button><ShieldCheck size={14} /> All policies</button><button><ArrowUpRight size={14} /> Export proof</button></div></div><div className="audit-head"><span>Decision ID / time</span><span>Agent</span><span>Action</span><span>Target</span><span>Policy result</span><span>Confidence</span><span>Proof hash</span></div>{auditEvents.map((event) => <div className="audit-row" key={event.id}><span><strong>{event.id}</strong><small>{event.time} IST</small></span><span className="agent-name"><Bot size={14} />{event.agent}</span><strong>{event.action}</strong><span>{event.target}</span><span className="policy-pass"><Check size={12} />{event.policy}</span><strong>{event.confidence}</strong><span className="hash-cell">{event.hash}<Copy size={12} /></span></div>)}</section>
      <div className="audit-bottom-grid"><section className="panel evidence-panel"><div className="panel-heading"><div><p className="eyebrow">DECISION ANATOMY</p><h2>Every action can explain itself</h2></div></div><div className="evidence-flow"><span><small>01 · INPUT</small><strong>Raw, signed webhook</strong></span><ChevronRight size={16} /><span><small>02 · EVIDENCE</small><strong>Signals + model score</strong></span><ChevronRight size={16} /><span><small>03 · POLICY</small><strong>Versioned rule check</strong></span><ChevronRight size={16} /><span><small>04 · OUTPUT</small><strong>Idempotent action</strong></span></div></section><section className="panel trust-panel"><span className="trust-icon"><LockKeyhole size={19} /></span><div><p className="eyebrow">TRUST GUARANTEE</p><h2>Revenue without regret.</h2><p>Contact caps, quiet hours, value gates, consent checks and instant kill-switches are evaluated before every action.</p></div></section></div>
    </div>
  );
}

function CaseDrawer({ item, onClose, onToast }: { item: RecoveryCase; onClose: () => void; onToast: (message: string) => void }) {
  return (
    <div className="overlay drawer-overlay" role="dialog" aria-modal="true" aria-label={`Recovery case for ${item.customer}`}><button className="overlay-dismiss" onClick={onClose} aria-label="Close case details" /><aside className="case-drawer"><div className="drawer-header"><div><p className="eyebrow">{item.id}</p><h2>Recovery decision</h2></div><button onClick={onClose} aria-label="Close"><X size={18} /></button></div><div className="drawer-customer"><i style={{ background: item.accent }}>{item.initials}</i><div><h3>{item.customer}</h3><span>{item.plan} · {item.method}</span></div><strong>{formatMoney(item.amount)}</strong></div><section className="decision-card"><div className="decision-card-head"><span className="agent-orb"><Sparkles size={18} /></span><div><p className="eyebrow">NEXT BEST ACTION</p><h3>{item.action}</h3></div><span className="confidence-large">{item.confidence}%<small>confidence</small></span></div><p>Revive selected this action after comparing recovery likelihood, customer friction, issuer health and your value guardrails.</p><div className="signal-list">{item.signals.map((signal) => <span key={signal}><CheckCircle2 size={14} />{signal}</span>)}</div></section><section className="drawer-section"><div className="section-heading-row"><div><p className="eyebrow">REASONING TRACE</p><h3>Why this path</h3></div><span className="version-pill">Policy v3.4</span></div><div className="reason-timeline"><div><i><Webhook size={14} /></i><p><strong>Failure classified</strong><span>{item.failure} · source verified from gateway event</span></p></div><div><i><Gauge size={14} /></i><p><strong>Recovery propensity scored</strong><span>{item.confidence}% likelihood within the next {item.eta}</span></p></div><div><i><ShieldCheck size={14} /></i><p><strong>Trust policies evaluated</strong><span>Contact cap, quiet hours, value gate and consent passed</span></p></div><div><i><Zap size={14} /></i><p><strong>Action prepared</strong><span>{item.action} · execution is duplicate-safe</span></p></div></div></section><section className="drawer-section"><p className="eyebrow">CUSTOMER CONTEXT</p><div className="context-grid"><span><small>LIFETIME VALUE</small><strong>₹1,48,200</strong></span><span><small>TENURE</small><strong>31 months</strong></span><span><small>PAST RECOVERIES</small><strong>2 / 2</strong></span><span><small>CONTACT PRESSURE</small><strong>Low</strong></span></div></section><div className="drawer-actions"><button className="outline-action" onClick={() => onToast(`${item.id} placed on a 24-hour hold.`)}><PauseCircle size={15} /> Hold 24h</button><button className="primary-dark" onClick={() => { onToast(`${item.action} approved for ${item.customer}.`); onClose(); }}><Check size={15} /> Approve action</button></div></aside></div>
  );
}

function PlanDrawer({ onClose, onSelectCase, onToast }: { onClose: () => void; onSelectCase: (item: RecoveryCase) => void; onToast: (message: string) => void }) {
  const reviewCases = recoveryCases.filter((item) => item.status === 'Review');
  return <div className="overlay drawer-overlay" role="dialog" aria-modal="true" aria-label="Agent plan review"><button className="overlay-dismiss" onClick={onClose} aria-label="Close agent plan" /><aside className="case-drawer plan-drawer"><div className="drawer-header"><div><p className="eyebrow">DAILY PLAN · 27 AUGUST</p><h2>51 actions ready. 6 need you.</h2></div><button onClick={onClose} aria-label="Close"><X size={18} /></button></div><div className="plan-summary"><span><strong>₹1.72L</strong><small>total at risk</small></span><ArrowRight size={17} /><span><strong>₹1.09L</strong><small>expected recovery</small></span><ArrowRight size={17} /><span><strong>63.4%</strong><small>forecast rate</small></span></div><section className="drawer-section"><div className="section-heading-row"><div><p className="eyebrow">SAFE AUTONOMY</p><h3>Already queued</h3></div><span className="version-pill">51 actions</span></div>{[['Balance-aware retries', '23 actions', '₹58,420'], ['Issuer health holds', '14 actions', '₹31,860'], ['Secure method updates', '8 actions', '₹20,600'], ['Soft-touch reminders', '6 actions', '₹12,240']].map((row) => <div className="plan-row" key={row[0]}><span><CheckCircle2 size={15} /><strong>{row[0]}</strong></span><small>{row[1]}</small><strong>{row[2]}</strong></div>)}</section><section className="drawer-section"><div className="section-heading-row"><div><p className="eyebrow">HUMAN CHECKPOINT</p><h3>Needs approval</h3></div><span className="review-count">6</span></div>{reviewCases.map((item) => <button className="review-row" key={item.id} onClick={() => onSelectCase(item)}><span className="customer-cell"><i style={{ background: item.accent }}>{item.initials}</i><span><strong>{item.customer}</strong><small>{item.failure}</small></span></span><strong>{formatMoney(item.amount)}</strong><ChevronRight size={15} /></button>)}</section><div className="policy-banner"><ShieldCheck size={18} /><p><strong>Your guardrails are active</strong><span>No customer will be contacted more than twice in 72 hours. Accounts over ₹40,000 require approval.</span></p></div><div className="drawer-actions"><button className="outline-action" onClick={onClose}>Review later</button><button className="primary-dark" onClick={() => { onToast('Daily plan approved. 51 safe actions are now executing.'); onClose(); }}><Zap size={15} /> Approve safe actions</button></div></aside></div>;
}

function DemoModal({ step, running, result, error, onStart, onClose }: { step: number; running: boolean; result: SimulationResponse | null; error: string; onStart: () => void; onClose: () => void }) {
  const steps = [{ icon: Webhook, title: 'Ingest failure', detail: 'Validate schema and persist idempotently' }, { icon: Sparkles, title: 'Reason over context', detail: 'Classify cause and score recovery paths' }, { icon: ShieldCheck, title: 'Apply guardrails', detail: 'Check trust, value and contact policies' }, { icon: Zap, title: 'Execute recovery', detail: 'Retry at predicted salary window' }];
  return <div className="overlay modal-overlay" role="dialog" aria-modal="true" aria-label="Live recovery demo"><button className="overlay-dismiss" onClick={onClose} aria-label="Close live demo" /><section className="demo-modal"><div className="drawer-header"><div><p className="eyebrow">INTERACTIVE RECOVERY SIMULATION</p><h2>Watch ₹11,999 come back.</h2></div><button onClick={onClose} aria-label="Close"><X size={18} /></button></div><p className="demo-intro">A realistic Razorpay <code>subscription.pending</code> event enters the hosted decision API. Every response is runtime-validated, policy-checked, idempotent and stored in a durable audit trail.</p><div className="incoming-event"><span className="event-icon"><RadioTower size={17} /></span><div><small>INCOMING WEBHOOK</small><strong>Nisha Menon · Pro annual</strong><span>Insufficient balance · UPI AutoPay</span></div><strong>₹11,999</strong></div><div className="demo-steps">{steps.map(({ icon: Icon, title, detail }, index) => { const complete = step > index; const active = running && step === index; return <div className={`demo-step ${complete ? 'complete' : ''} ${active ? 'active' : ''}`} key={title}><span>{complete ? <Check size={16} /> : <Icon size={16} />}</span><p><strong>{title}</strong><small>{detail}</small></p><i>{complete ? 'Done' : active ? 'Working…' : 'Waiting'}</i></div>; })}</div>{step >= 4 && result ? <><div className="demo-success"><div><CheckCircle2 size={24} /></div><p><small>SIMULATED PAYMENT CAPTURED</small><strong>₹11,999 recovered</strong><span>{result.plan.action.replaceAll('_', ' ')} · {Math.round(result.plan.confidence * 100)}% confidence · {result.plan.executionMode}</span></p></div><div className="demo-proof"><span><small>POLICY</small><strong>v{result.policyVersion}</strong></span><span><small>AUDIT STORE</small><strong>{result.persistence.replaceAll('_', ' ')}</strong></span><span><small>REQUEST PROOF</small><strong>{result.requestId.slice(0, 8)}…</strong></span></div></> : <div className="demo-controls"><div><ShieldCheck size={15} /><span>Simulation mode · no real payment or message will be sent</span></div><button className="primary-dark" onClick={onStart} disabled={running}><Play size={14} fill="currentColor" />{running ? 'Agents working…' : step ? 'Restart simulation' : 'Start simulation'}</button></div>}{error ? <div className="demo-error" role="alert"><CircleAlert size={15} /><span>{error} No recovery was claimed.</span></div> : null}<details className="demo-research"><summary>Why this simulation is realistic <ChevronDown size={14} /></summary>{researchFacts.map((fact) => <p key={fact}><Check size={13} />{fact}</p>)}</details></section></div>;
}
