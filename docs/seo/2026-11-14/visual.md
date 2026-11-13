# Visual / Images audit (kkctools.com)
Screenshots NOT captured: Chromium failed to launch (spawn UNKNOWN) in this environment. Findings are from static HTML (curl) only; layout, tap-target sizes and overflow are unverified.

Findings
- No <img> elements on home, band-name-generator or square-footage-calculator; all visuals are inline SVG (22/41/11). No alt-text, sizing, CLS-from-image or LCP image risk. Verify decorative SVGs have aria-hidden.
- Viewport meta correct; fonts preloaded (next/font), limiting font-swap shift.
- Tools are server-rendered in HTML (chips, inputs with default values 20/12), so tool markup exists at first paint; whether it is above the fold on 375x812 is unverified.
- Controls labelled (aria-label on chips, hamburger, theme toggle). Inputs use inputMode=decimal (good for mobile). Chips/tabs sizes need measurement.
- og:image not checked here (see social-image findings elsewhere).
