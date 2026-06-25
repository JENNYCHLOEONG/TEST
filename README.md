# Sterling & Vale Advisory — One-Page Website

A polished, responsive one-page investment advisory site built with **vanilla HTML, CSS, and
JavaScript** — no frameworks, no build tools, no external libraries (only Google Fonts).

## Files
- `index.html` — markup (navbar, hero, about, services, testimonials, enquiry form, footer)
- `styles.css` — design system, responsive layout, mobile hamburger menu, carousel & form styles
- `script.js` — mobile menu, testimonial carousel, footer year, and the FormSubmit AJAX handler

## Run it
Just open `index.html` in a browser — double-click it, or from PowerShell:

```powershell
Start-Process .\index.html
```

No server or install step is required.

## Wiring up the enquiry form (important)

The form submits via **FormSubmit's AJAX endpoint**, so the page never redirects.

1. Open `script.js` and find the line marked `REPLACE_WITH_YOUR_EMAIL`:

   ```js
   var FORMSUBMIT_ENDPOINT = "https://formsubmit.co/ajax/REPLACE_WITH_YOUR_EMAIL";
   ```

   Replace `REPLACE_WITH_YOUR_EMAIL` with your real email address, e.g.
   `https://formsubmit.co/ajax/you@example.com`.

2. **One-time activation:** FormSubmit requires a one-time confirmation. The *very first*
   submission to a new email address triggers a confirmation email from FormSubmit. The form
   only delivers messages **after** you click the activation link in that email.

That's it — once activated, submissions arrive in your inbox (formatted as a table), with no
page redirect.

## Notes
- Honeypot field (`_honey`) is included and hidden via CSS to reduce spam.
- Client-side validation runs (required fields + email regex) before any network request.
- Fully responsive (mobile-first), keyboard-accessible, and respects `prefers-reduced-motion`.
- This site is fictional and for informational/demo purposes only; it does not constitute
  financial advice.
# TEST
