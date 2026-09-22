# Aditya Indoori's Profile

Deployed URL: https://adityaindoori.github.io/profile/

The site is plain HTML, CSS, and JavaScript. GitHub Pages publishes the repository root from `main`.

- `index.html` contains the profile content and structured data.
- `style.css` contains dark/light themes, responsive layout, and résumé print styles.
- `script.js` handles theme persistence, the year, and the native LinkedIn QR dialog.
- `Aditya_Indoori_Resume.pdf` is the two-page résumé generated from the same page.

Preview locally with `python3 -m http.server 8765 --bind 127.0.0.1`, then open `http://localhost:8765/`.

After content changes, regenerate the PDF from the local page in Chromium using Print → Save as PDF, Letter paper, and the CSS-defined margins. Replace `Aditya_Indoori_Resume.pdf`; check page breaks and hyperlinks before publishing. The résumé source is the site, not a separate copy of the text.
