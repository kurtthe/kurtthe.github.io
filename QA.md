# Quality checks (13 Nov 2026)
- `node --check js/main.js` passed.
- Chromium (Playwright) at 1440px and 390px: no console errors, no horizontal overflow.
- Visual review of every section at both widths, including an opened project.
- Tabs follow the ARIA tabs pattern (arrow keys, Home/End). Filters use aria-pressed; counts announced via aria-live.
- Decode effect keeps the real text in a screen-reader-only span; the animated copy is aria-hidden.
- Still to test by hand: keyboard-only pass, VoiceOver/NVDA, Safari/Firefox, Lighthouse on the live host.
