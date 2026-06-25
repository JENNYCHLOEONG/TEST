# Sterling & Vale Advisory — One-Page Website

A polished, responsive single-page marketing site for a fictional investment advisory firm,
built with **vanilla HTML, CSS, and JavaScript** — no frameworks, no build tools, no external
libraries (only Google Fonts).

The page uses a berry/rose **pink** brand palette with a champagne accent, and is built as a
**lead magnet**: every section ladders toward one action — claiming a free, no-obligation
portfolio review via the enquiry form. It also ships on-page SEO basics (descriptive title +
meta description, canonical, Open Graph/Twitter cards, and `FinancialService` JSON-LD).

## Preview

![Screenshot of the Sterling & Vale Advisory site](screenshot.png)

> **Live site:** https://JENNYCHLOEONG.github.io/TEST/

## Files

- `index.html` — full markup: navbar, hero, about, services, testimonials, enquiry form, footer
- `styles.css` — mobile-first design system, responsive layout, hamburger menu, carousel & form styles
- `script.js` — mobile menu, testimonial carousel, footer year, and the FormSubmit AJAX handler
- `.github/workflows/deploy.yml` — GitHub Actions workflow that deploys to GitHub Pages on push to `main`

## Run it locally

Just open `index.html` in a browser — double-click it, or from PowerShell:

```powershell
Start-Process .\index.html
```

No server, install, or build step is required. Edit any file and refresh the browser.

## Enquiry form setup (important)

The form submits via **FormSubmit's AJAX endpoint**, so the page never redirects. The recipient
is the `FORMSUBMIT_ENDPOINT` constant in `script.js`:

```js
var FORMSUBMIT_ENDPOINT = "https://formsubmit.co/ajax/your@email.com";
```

To change who receives enquiries, swap the address there.

**One-time activation:** the *first* submission to a new address triggers a FormSubmit
confirmation email. The form only delivers messages **after** you click that activation link.
Once activated, submissions arrive in your inbox (formatted as a table) with no page redirect.

> **Note:** with FormSubmit's AJAX endpoint the recipient address is visible in the public
> client-side source. To avoid exposing it, use FormSubmit's hashed token endpoint instead
> (`https://formsubmit.co/ajax/<your-token>`).

## Deployment

Pushes to `main` trigger `.github/workflows/deploy.yml`, which uploads the site and publishes it
to GitHub Pages at **https://JENNYCHLOEONG.github.io/TEST/**.

## Notes

- Honeypot field (`_honey`) is hidden via CSS to reduce spam.
- Client-side validation (required fields + email regex) runs before any network request.
- Fully responsive (mobile-first), keyboard-accessible, and respects `prefers-reduced-motion`.
- This site is fictional and for demo purposes only; it does not constitute financial advice.

## License

No license specified. Add a `LICENSE` file if you want to set terms.
