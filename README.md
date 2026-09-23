# Aditya Indoori's Profile

Deployed URL: https://adityaindoori.github.io/profile/

The site is plain HTML, CSS, and JavaScript. GitHub Pages publishes the repository root from `main`.

- `index.html` contains the profile content and structured data.
- `style.css` preserves the original VT323/neon design, reduced glow, animations, responsive details, and separate résumé print styles.
- `script.js` handles typing loops, scroll reveals, hover/touch details, click notifications, theme persistence, the year, and animated native QR/résumé dialogs.
- `Aditya_Indoori_Resume.pdf` is the two-page résumé generated from the same page.

Preserve the original design language when updating content: retro typography throughout, square dark-theme panels, animated typing/cursors, hover details, interactive skill tags, notifications, and pulsing modals. Commit `1e81be5` is the approved visual baseline. Reduced-motion preferences disable animation without hiding content or controls.

Preview locally with `python3 -m http.server 8765 --bind 127.0.0.1`, then open `http://localhost:8765/`.

After content changes, regenerate the PDF from the local page in Chromium using Print → Save as PDF, Letter paper, and the CSS-defined margins. Replace `Aditya_Indoori_Resume.pdf`; check page breaks and hyperlinks before publishing. The résumé source is the site, not a separate copy of the text.
