# Revive Landing Page — Design QA

- Source visual truth: `C:\\Users\\Aman\\.codex-cli\\generated_images\\01a0493a-6cc6-7d63-941a-64e256ecd084\\exec-dab6db30-813f-4058-8f12-b6519ff793cb.png`
- Iteration baseline: `output/playwright/three-baseline-hero.png`, `output/playwright/continue-local-02-reason.png`, `output/playwright/continue-audit-05-mobile-hero.png`, and the selected source visual above
- Implementation: `http://127.0.0.1:3000/`
- Desktop viewport: 1440 × 900 CSS px at deviceScaleFactor 1
- Mobile viewport: 390 × 844 CSS px at deviceScaleFactor 1
- Source dimensions: 840 × 1872 px
- State coverage: hero, signal, reason, guardrail, recovery, proof, command-center transition, live demo, compact mobile, short landscape, and reduced motion

## Findings

No open P0, P1, or P2 issues.

- [P3] The procedural WebGL Revenue Core remains intentionally more abstract than the source concept's richly machined orb. The live implementation now adds a shader-lit inner core, curved signal paths, moving packets, depth streaks, spiral disassembly, and recovery shockwaves while preserving the source's ceramic shell, brass details, green energy, and minimal editorial composition.

## Fidelity Surfaces

- Typography: Playfair Display supplies the editorial display voice; Geist and Geist Mono carry interface and telemetry text. Desktop and mobile wrapping were checked visually.
- Layout rhythm: the fixed story rail, five full-viewport chapters, alternating copy/object composition, proof window, and mobile reflow match the selected direction.
- Color: deep forest, warm ivory, brass, and acid lime remain consistent. Vignette and local scrims preserve contrast without flattening the gradients.
- Assets: the proof chapter uses the real Revive command-center screenshot. The Revenue Core is rendered in WebGL rather than represented by a placeholder.
- Copy: the failure classification, guardrails, recovery amount, audit proof, and honest simulated-portfolio label are all present.

## Full-view Evidence

- Smoothed desktop hero: `output/playwright/revive-smooth-hero.png`
- Smoothed desktop signal: `output/playwright/revive-smooth-signal.png`
- Smoothed desktop proof: `output/playwright/revive-smooth-proof.png`
- Smoothed mobile hero: `output/playwright/revive-smooth-mobile-hero.png`
- Smoothed mobile proof: `output/playwright/revive-smooth-mobile-proof-2.png`
- Smoothed 375 px portrait: `output/playwright/revive-smooth-375-settled.png`
- Smoothed 844 × 390 landscape: `output/playwright/revive-smooth-landscape-final.png`
- Smoothed reduced-motion state: `output/playwright/revive-smooth-reduced-motion.png`
- Continued-polish desktop hero: `output/playwright/continue-local-01-hero.png`
- Continued-polish reason chapter: `output/playwright/continue-local-02-reason.png`
- Continued-polish demo success: `output/playwright/continue-local-03-demo-success.png`
- Continued-polish mobile hero: `output/playwright/continue-local-04-mobile-hero.png`
- Continued-polish mobile demo success: `output/playwright/continue-local-05-mobile-demo-success.png`
- Continued-polish 844 × 390 landscape: `output/playwright/continue-local-06-landscape.png`
- Continued-polish reduced-motion state: `output/playwright/continue-local-07-reduced-motion.png`
- Continued-polish 375 px portrait: `output/playwright/continue-local-08-375.png`
- Desktop hero: `output/playwright/revive-desktop-hero-final.png`
- Desktop signal: `output/playwright/revive-desktop-signal-final.png`
- Desktop reason: `output/playwright/revive-desktop-reason-final.png`
- Desktop proof: `output/playwright/revive-desktop-proof-final.png`
- Mobile hero: `output/playwright/revive-mobile-hero-final.png`
- Mobile signal: `output/playwright/revive-mobile-signal-final.png`
- Mobile proof: `output/playwright/revive-mobile-proof-final.png`
- Mobile command center: `output/playwright/revive-mobile-command-center.png`
- Mobile live demo: `output/playwright/revive-mobile-demo-final.png`
- Live-3D README/hero capture: `docs/assets/revive-cinematic-core.png`
- Live-3D signal chapter: `output/playwright/three-local-signal-02.png`
- Live-3D reason chapter: `output/playwright/three-local-reason-final.png`
- Live-3D guardrail chapter: `output/playwright/three-local-guardrail-02.png`
- Live-3D recovery chapter: `output/playwright/three-local-recovery-final.png`
- Live-3D 390 × 844 mobile hero: `output/playwright/three-local-mobile-390.png`
- Live-3D 844 × 390 landscape hero: `output/playwright/three-local-landscape.png`
- Live-3D reduced-motion state: `output/playwright/three-local-reduced-motion.png`

## Combined Source Comparisons

- Smoothed hero source crop beside implementation: `output/playwright/revive-smooth-comparison-hero.png`
- Smoothed proof source crop beside implementation: `output/playwright/revive-smooth-comparison-proof.png`
- Continued-polish hero baseline beside implementation: `output/playwright/continue-compare-hero.png`
- Continued-polish reason baseline beside implementation: `output/playwright/continue-compare-reason.png`
- Continued-polish demo baseline beside implementation: `output/playwright/continue-compare-demo.png`
- Hero source crop beside implementation: `output/playwright/revive-comparison-hero.png`
- Proof source crop beside implementation: `output/playwright/revive-comparison-proof.png`
- Live-3D hero baseline beside implementation: `output/playwright/three-compare-hero-final.png`
- Live-3D Reason baseline beside implementation: `output/playwright/three-compare-reason-final.png`
- Live-3D mobile baseline beside implementation: `output/playwright/three-compare-mobile.png`

The source is a tall presentation board, so focused source regions were normalized beside matching live viewport states. The comparison confirms the intended editorial hierarchy, cinematic object scale, lime conversion controls, left-side progress rail, proof transition, and embedded command center.

## Primary Interaction Checks

- `Follow a recovery` scrolls to the incoming-signal chapter.
- `Open command center` and the proof-window CTA open the existing product dashboard.
- The dashboard logo returns to the scroll story.
- Both landing-page and dashboard `Run live demo` controls open the recovery simulation.
- `Start simulation` completes all four stages, calls the hosted recovery route, returns `₹11,999 recovered`, records request proof, and shows the verification toast.
- The success state exposes `Inspect audit proof`, closes the modal, and opens the live System proof view.
- The mobile dashboard header remains above scrolled content and its live-demo control is clickable.
- Mobile document width is 375 CSS px inside a 390 CSS px viewport; no horizontal overflow is present.
- Reduced-motion mode renders a stable landing state and suppresses long transitions.
- Two reduced-motion screenshots captured several seconds apart produced the same SHA-256 hash, confirming that ambient time-based movement is frozen.
- The 375 × 812 portrait and 844 × 390 landscape layouts both report document widths exactly equal to their viewports.
- Browser console: 0 errors and 0 warnings after the complete primary journey.
- Desktop motion benchmark, same Chrome/viewport/scroll curve: current production averaged 27.75 ms per frame with a 50.2 ms p95; the smoothed implementation averaged 8.01 ms with a 13.1 ms p95 and no frames above 33 ms.
- Mobile motion benchmark at 390 × 844: 10.55 ms average, 22.6 ms p95, and a document width exactly matching the 390 px viewport.

## Comparison History

- Iteration 1: implementation completed, but browser evidence was unavailable.
- Iteration 2: desktop review found P1 object/copy crowding in hero, signal, reason, and proof. The camera path, scene offsets, chapter-specific opacity, gradients, and content scrims were corrected.
- Iteration 3: mobile review found the dashboard header CTA could be intercepted after scroll. The mobile header was made fixed, layered, and translucent; the interaction was repeated successfully.
- Iteration 4: combined hero and proof comparisons passed with no remaining P0/P1/P2 findings.
- Iteration 5: replaced frame-dependent interpolation with delta-time damping, stabilized transparent materials, added adaptive render resolution and a lightweight energy spine, reduced mobile scene complexity, removed the expensive full-screen blur pass, and stopped replaying entry animations. A temporary mobile hash-position regression from off-screen paint containment was found and fixed by limiting containment to desktop. The short-landscape hero was tightened so both primary actions remain visible. Final desktop, 375 px portrait, short-landscape, mobile proof, reduced-motion, and main-demo checks passed again.
- Iteration 6: audited the deployed recruiter journey, added a continuous story-progress line and active navigation state, expanded desktop chapter labels, corrected the Reason headline's copy and wrap, enlarged the recovery simulation's critical text, added live state announcements and initial modal focus, and created a direct success-to-proof continuation. Same-viewport hero, Reason, and demo comparisons found no new P0/P1/P2 drift. Desktop, 390 px mobile, 844 × 390 landscape, reduced-motion, console, build, and end-to-end proof checks passed.
- Iteration 7: upgraded the live Three.js scene with a custom Fresnel/scan-line shader, six Catmull–Rom signal paths, moving energy packets, scroll-velocity depth streaks, spiral shell separation, variable-FOV camera entry, pointer lighting, and recovery shockwaves. A full-frame bloom experiment was removed after profiling so glow remains material-local and the renderer keeps its adaptive-resolution path without screen-sized post-processing. The README was rebuilt around the cinematic story and recruiter demo. Same-viewport hero, Reason, and mobile comparisons found no P0/P1/P2 drift; 375 px portrait, 844 × 390 landscape, frozen reduced-motion output, console, lint, tests, and production build passed.

final result: passed
