'use client';

import dynamic from 'next/dynamic';
import Image from 'next/image';
import { useRef, useState } from 'react';
import {
  ArrowDown,
  ArrowRight,
  Ban,
  CalendarX2,
  Check,
  CircleCheck,
  CloudOff,
  Database,
  Fingerprint,
  Gauge,
  Link2,
  LockKeyhole,
  Play,
  RadioTower,
  ReceiptIndianRupee,
  RefreshCcw,
  Route,
  ScanLine,
  ShieldCheck,
  WalletCards,
  WifiOff,
} from 'lucide-react';
import { motion, useMotionValueEvent, useScroll, useSpring, useTransform } from 'motion/react';
import commandCenterImage from '../docs/assets/revive-command-center.png';

const RevenueCore = dynamic(
  () => import('./revenue-core').then((module) => module.RevenueCore),
  {
    ssr: false,
    loading: () => <div className="core-loading" aria-hidden="true"><i /> Calibrating recovery core</div>,
  },
);

type LandingPageProps = {
  onOpenCommand: () => void;
  onRunDemo: () => void;
};

const chapters = [
  { id: 'signal', number: '01', label: 'Signal' },
  { id: 'reason', number: '02', label: 'Reason' },
  { id: 'guardrail', number: '03', label: 'Guardrail' },
  { id: 'recovery', number: '04', label: 'Recovery' },
  { id: 'proof', number: '05', label: 'Proof' },
];

const failureSignals = [
  { label: 'Low balance', detail: 'Temporary funding gap', icon: WalletCards },
  { label: 'Card expired', detail: 'Credentials need refresh', icon: CalendarX2 },
  { label: 'Mandate revoked', detail: 'Consent is no longer valid', icon: Ban },
  { label: 'Issuer outage', detail: 'The bank is unavailable', icon: CloudOff },
  { label: 'Auth required', detail: 'Customer action is needed', icon: Fingerprint },
  { label: 'Network timeout', detail: 'The result is still unknown', icon: WifiOff },
];

const guardrails = [
  { label: 'Consent', value: 'Verified', icon: Fingerprint },
  { label: 'Contact cap', value: 'Within limit', icon: Gauge },
  { label: 'Quiet hours', value: 'Outside window', icon: LockKeyhole },
  { label: 'Duplicate safety', value: 'Armed', icon: Database },
];

const reveal = {
  initial: { opacity: 0, y: 36 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { amount: 0.36, once: true },
  transition: { duration: 0.82, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
};

export function LandingPage({ onOpenCommand, onRunDemo }: LandingPageProps) {
  const storyRef = useRef<HTMLElement>(null);
  const [activeChapter, setActiveChapter] = useState(0);
  const { scrollYProgress } = useScroll({
    target: storyRef,
    offset: ['start start', 'end end'],
  });
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    mass: 0.7,
    restDelta: 0.0001,
    restSpeed: 0.0001,
    skipInitialAnimation: true,
  });
  const progressScale = useTransform(smoothProgress, [0.07, 0.95], [0, 1]);
  const limeGlow = useTransform(smoothProgress, [0, 0.3, 0.58, 0.82, 1], [0.5, 0.16, 0.42, 0.72, 0.2]);
  const warmGlow = useTransform(smoothProgress, [0, 0.45, 0.78, 1], [0.26, 0.5, 0.76, 0.3]);

  useMotionValueEvent(smoothProgress, 'change', (latest) => {
    const next = latest < 0.25 ? 0 : latest < 0.41 ? 1 : latest < 0.59 ? 2 : latest < 0.76 ? 3 : 4;
    setActiveChapter((current) => (current === next ? current : next));
  });

  const scrollTo = (id: string) => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    document.getElementById(id)?.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'start' });
  };

  return (
    <main className="revive-landing">
      <a className="landing-skip-link" href="#signal">Skip to how recovery works</a>
      <header className="landing-nav">
        <button className="landing-brand" onClick={() => scrollTo('top')} aria-label="Back to the top">
          <span>R</span><strong>Revive</strong>
        </button>
        <nav aria-label="Landing page navigation">
          <button
            className={activeChapter < 4 ? 'active' : ''}
            onClick={() => scrollTo('signal')}
            aria-current={activeChapter < 4 ? 'location' : undefined}
          >How it works</button>
          <button
            className={activeChapter === 4 ? 'active' : ''}
            onClick={() => scrollTo('proof')}
            aria-current={activeChapter === 4 ? 'location' : undefined}
          >Proof</button>
          <button onClick={onOpenCommand}>Command center</button>
        </nav>
        <button className="nav-demo" onClick={onRunDemo}>Run live demo <ArrowRight size={15} /></button>
        <div className="landing-progress" aria-hidden="true"><motion.i style={{ scaleX: progressScale }} /></div>
      </header>

      <aside className="chapter-rail" aria-label="Recovery story progress">
        <div className="rail-track"><motion.i style={{ scaleY: progressScale }} /></div>
        {chapters.map((chapter, index) => (
          <button
            key={chapter.id}
            className={activeChapter === index ? 'active' : ''}
            onClick={() => scrollTo(chapter.id)}
            aria-current={activeChapter === index ? 'step' : undefined}
          >
            <span>{chapter.number}</span>
            <small>{chapter.label}</small>
          </button>
        ))}
      </aside>

      <section className="cinematic-story" ref={storyRef} id="top">
        <div className="core-stage" aria-hidden="false">
          <RevenueCore progress={scrollYProgress} />
          <div className="stage-vignette" />
          <motion.div className="stage-glow lime" style={{ opacity: limeGlow }} />
          <motion.div className="stage-glow warm" style={{ opacity: warmGlow }} />
          <div className="stage-grain" />
          <div className="stage-telemetry" aria-hidden="true">
            <ScanLine size={13} />
            <span>Live 3D engine</span>
            <b>Scroll + pointer</b>
          </div>
        </div>

        <section className="story-panel hero-panel" aria-labelledby="hero-title">
          <motion.div className="hero-copy" {...reveal}>
            <p className="landing-kicker"><i /> Revenue recovery, explained</p>
            <h1 id="hero-title">One failed payment.<br /><em>Six very different</em><br />next moves.</h1>
            <p className="hero-description">Revive reads the reason, chooses the right rail, enforces trust policies, and measures the revenue it truly creates.</p>
            <div className="hero-actions">
              <button className="landing-primary" onClick={() => scrollTo('signal')}>Follow a recovery <ArrowDown size={16} /></button>
              <button className="landing-secondary" onClick={onOpenCommand}>Open command center <ArrowRight size={16} /></button>
            </div>
            <p className="truth-label"><i /> Simulated portfolio <span /> Live backend</p>
          </motion.div>
          <div className="scroll-cue" aria-hidden="true"><span>Scroll to enter</span><i><b /></i></div>
        </section>

        <section className="story-panel signal-panel" id="signal" aria-labelledby="signal-title">
          <motion.div className="chapter-copy wide" {...reveal}>
            <p className="chapter-kicker">01 · Incoming signal</p>
            <div className="chapter-heading-row">
              <div>
                <h2 id="signal-title">A failure is not<br />a diagnosis.</h2>
                <p>As the outer shell separates, one event resolves into six fundamentally different recovery contexts.</p>
              </div>
              <span className="event-stamp"><RadioTower size={15} /> payment.failed <b>₹11,999</b></span>
            </div>
            <div className="failure-grid">
              {failureSignals.map(({ label, detail, icon: Icon }, index) => (
                <motion.article
                  key={label}
                  initial={{ opacity: 0, y: 22 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ amount: 0.62, once: true }}
                  transition={{ delay: index * 0.045, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                >
                  <span><Icon size={17} /></span>
                  <strong>{label}</strong>
                  <small>{detail}</small>
                </motion.article>
              ))}
            </div>
          </motion.div>
        </section>

        <section className="story-panel reason-panel" id="reason" aria-labelledby="reason-title">
          <motion.div className="chapter-copy reason-copy right" {...reveal}>
            <p className="chapter-kicker">02 · Reason classification</p>
            <h2 id="reason-title">Classified<br /><em>before action.</em></h2>
            <p>Revive converts a noisy processor event into an explainable recovery route—with confidence, evidence, and a safe fallback.</p>
            <div className="reason-path">
              <span><RadioTower size={15} /><small>Signal</small><strong>insufficient_balance</strong></span>
              <ArrowRight size={15} />
              <span className="active"><Route size={15} /><small>Best rail</small><strong>Smart retry</strong></span>
              <ArrowRight size={15} />
              <span><ShieldCheck size={15} /><small>Confidence</small><strong>94.2%</strong></span>
            </div>
            <p className="evidence-note"><CircleCheck size={14} /> Issuer healthy · zero contacts in 72h · consent valid</p>
          </motion.div>
        </section>

        <section className="story-panel guardrail-panel" id="guardrail" aria-labelledby="guardrail-title">
          <motion.div className="chapter-copy" {...reveal}>
            <p className="chapter-kicker">03 · Policy gates</p>
            <h2 id="guardrail-title">Autonomy,<br /><em>with hard edges.</em></h2>
            <p>Every action must pass a concentric set of trust policies. A good recovery never comes at the cost of customer confidence.</p>
            <div className="guardrail-list">
              {guardrails.map(({ label, value, icon: Icon }) => (
                <div key={label}><span><Icon size={15} /></span><p><small>{label}</small><strong>{value}</strong></p><Check size={14} /></div>
              ))}
            </div>
            <button className="text-link" onClick={onOpenCommand}>Inspect the policy engine <ArrowRight size={15} /></button>
          </motion.div>
        </section>

        <section className="story-panel recovery-panel" id="recovery" aria-labelledby="recovery-title">
          <motion.div className="chapter-copy recovery-copy" {...reveal}>
            <p className="chapter-kicker">04 · Recovery outcome</p>
            <h2 id="recovery-title">The system<br /><em>comes back together.</em></h2>
            <p>The right action lands on the right rail, at the right time—and every separated layer resolves around one measurable outcome.</p>
            <div className="recovered-amount">
              <span><ReceiptIndianRupee size={18} /> Recovered</span>
              <strong>₹11,999</strong>
              <p><RefreshCcw size={14} /> Smart retry · low-balance-aware timing</p>
            </div>
            <div className="impact-row"><span>Incremental impact</span><strong>+₹11,999</strong><i><b /></i></div>
          </motion.div>
        </section>

        <section className="story-panel proof-panel" id="proof" aria-labelledby="proof-title">
          <motion.div className="chapter-copy proof-copy wide" {...reveal}>
            <div className="proof-intro">
              <div>
                <p className="chapter-kicker">05 · System proof</p>
                <h2 id="proof-title">Proven.<br />Verified.<br /><em>Auditable.</em></h2>
                <p>Every decision is policy-checked, idempotent, and stored in an immutable trail you can challenge live.</p>
              </div>
              <div className="duplicate-proof">
                <p><Fingerprint size={15} /> Immutable audit trail</p>
                <strong>stored <ArrowRight size={15} /> duplicate_suppressed</strong>
                <div>
                  <span><b>01</b><small>First request</small><strong>Durable write</strong><CircleCheck size={16} /></span>
                  <ArrowRight size={17} />
                  <span><b>02</b><small>Identical replay</small><strong>No double action</strong><ShieldCheck size={16} /></span>
                </div>
              </div>
            </div>
            <button className="product-window" onClick={onOpenCommand} aria-label="Open the interactive Revive command center">
              <span className="window-bar"><i /><i /><i /><small>LIVE PRODUCT · COMMAND CENTER</small><b>Open product <ArrowRight size={13} /></b></span>
              <Image src={commandCenterImage} alt="Revive revenue command center showing recovery metrics and agent activity" priority={false} sizes="(max-width: 760px) 92vw, 68vw" />
            </button>
          </motion.div>
        </section>

        <section className="story-panel final-panel" id="final" aria-labelledby="final-title">
          <motion.div className="final-copy" {...reveal}>
            <p className="chapter-kicker">The recovery engine is ready</p>
            <h2 id="final-title">See every decision.<br /><em>Challenge every claim.</em></h2>
            <p>Revive is an autonomous revenue-recovery control plane for recurring-payment failures—explainable from signal to proof.</p>
            <div className="hero-actions final-actions">
              <button className="landing-primary" onClick={onRunDemo}><Play size={15} fill="currentColor" /> Run live demo</button>
              <button className="landing-secondary" onClick={onOpenCommand}>View system proof <Fingerprint size={15} /></button>
            </div>
            <p className="truth-label"><i /> Simulated portfolio <span /> Live backend</p>
          </motion.div>
          <footer className="landing-footer"><span>Revive © 2026</span><span><Link2 size={13} /> Built to make recovery explainable</span></footer>
        </section>
      </section>
    </main>
  );
}
