# Revive Landing Page — Design QA

- Source visual truth: `C:\\Users\\Aman\\.codex-cli\\generated_images\\01a0493a-6cc6-7d63-941a-64e256ecd084\\exec-dab6db30-813f-4058-8f12-b6519ff793cb.png`
- Implementation: `http://127.0.0.1:3000/`
- Desktop viewport: 1440 × 900 CSS px at deviceScaleFactor 1
- Mobile viewport: 390 × 844 CSS px at deviceScaleFactor 1
- Source dimensions: 840 × 1872 px
- State coverage: hero, signal, reason, proof, command-center transition, live demo, and reduced motion

## Findings

No open P0, P1, or P2 issues.

- [P3] The procedural WebGL Revenue Core is intentionally cleaner and more abstract than the source concept's richly machined orb. The implemented object preserves the source's scale, ceramic shell, brass details, green energy, and dismantling narrative while remaining performant and fully scroll-controlled.

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
- Desktop hero: `output/playwright/revive-desktop-hero-final.png`
- Desktop signal: `output/playwright/revive-desktop-signal-final.png`
- Desktop reason: `output/playwright/revive-desktop-reason-final.png`
- Desktop proof: `output/playwright/revive-desktop-proof-final.png`
- Mobile hero: `output/playwright/revive-mobile-hero-final.png`
- Mobile signal: `output/playwright/revive-mobile-signal-final.png`
- Mobile proof: `output/playwright/revive-mobile-proof-final.png`
- Mobile command center: `output/playwright/revive-mobile-command-center.png`
- Mobile live demo: `output/playwright/revive-mobile-demo-final.png`

## Combined Source Comparisons

- Smoothed hero source crop beside implementation: `output/playwright/revive-smooth-comparison-hero.png`
- Smoothed proof source crop beside implementation: `output/playwright/revive-smooth-comparison-proof.png`
- Hero source crop beside implementation: `output/playwright/revive-comparison-hero.png`
- Proof source crop beside implementation: `output/playwright/revive-comparison-proof.png`

The source is a tall presentation board, so focused source regions were normalized beside matching live viewport states. The comparison confirms the intended editorial hierarchy, cinematic object scale, lime conversion controls, left-side progress rail, proof transition, and embedded command center.

## Primary Interaction Checks

- `Follow a recovery` scrolls to the incoming-signal chapter.
- `Open command center` and the proof-window CTA open the existing product dashboard.
- The dashboard logo returns to the scroll story.
- Both landing-page and dashboard `Run live demo` controls open the recovery simulation.
- `Start simulation` completes all four stages, calls the hosted recovery route, returns `₹11,999 recovered`, records request proof, and shows the verification toast.
- The mobile dashboard header remains above scrolled content and its live-demo control is clickable.
- Mobile document width is 375 CSS px inside a 390 CSS px viewport; no horizontal overflow is present.
- Reduced-motion mode renders a stable landing state and suppresses long transitions.
- Browser console: 0 errors and 0 warnings after the complete primary journey.
- Desktop motion benchmark, same Chrome/viewport/scroll curve: current production averaged 27.75 ms per frame with a 50.2 ms p95; the smoothed implementation averaged 8.01 ms with a 13.1 ms p95 and no frames above 33 ms.
- Mobile motion benchmark at 390 × 844: 10.55 ms average, 22.6 ms p95, and a document width exactly matching the 390 px viewport.

## Comparison History

- Iteration 1: implementation completed, but browser evidence was unavailable.
- Iteration 2: desktop review found P1 object/copy crowding in hero, signal, reason, and proof. The camera path, scene offsets, chapter-specific opacity, gradients, and content scrims were corrected.
- Iteration 3: mobile review found the dashboard header CTA could be intercepted after scroll. The mobile header was made fixed, layered, and translucent; the interaction was repeated successfully.
- Iteration 4: combined hero and proof comparisons passed with no remaining P0/P1/P2 findings.
- Iteration 5: replaced frame-dependent interpolation with delta-time damping, stabilized transparent materials, added adaptive render resolution and a lightweight energy spine, reduced mobile scene complexity, removed the expensive full-screen blur pass, and stopped replaying entry animations. A temporary mobile hash-position regression from off-screen paint containment was found and fixed by limiting containment to desktop. The short-landscape hero was tightened so both primary actions remain visible. Final desktop, 375 px portrait, short-landscape, mobile proof, reduced-motion, and main-demo checks passed again.

final result: passed
