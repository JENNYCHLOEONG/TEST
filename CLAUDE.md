# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Single-page marketing website for a fictional investment advisory firm, **Sterling & Vale
Advisory**. Built with **vanilla HTML/CSS/JS only** — no frameworks, no build tools, no
package manager, no external CSS/JS libraries. The only external dependency is Google Fonts
(Playfair Display + Inter), loaded via `<link>` in `index.html`.

## Running / "building"

There is no build, lint, or test step. Open the file directly:

```powershell
Start-Process .\index.html
```

No server is required — everything works from the local filesystem. After editing any file,
just refresh the browser.

## Architecture

Three files, intentionally split by concern (not bundled):

- `index.html` — all markup in one page, ordered: sticky navbar → hero → about → services →
  testimonials → enquiry form → footer. Sections are linked by `id` and reached via in-page
  anchors (`#home`, `#about`, `#testimonials`, `#contact`).
- `styles.css` — mobile-first. Design tokens live in `:root` (navy/slate/gold palette,
  spacing, radius, fonts) — **change colors/typography there, not inline**. Breakpoints widen
  the layout at 640/760/960px; the hamburger menu takes over **below 720px**
  (`@media (max-width: 719px)`).
- `script.js` — one IIFE wrapping three independent features: mobile menu toggle, the
  testimonial carousel, and the FormSubmit enquiry handler. Footer year is injected here too.

### Cross-file coupling to know about

JS reaches into the DOM by `id`, and CSS keys off specific classes. If you rename these,
update all three files together:

- Carousel: `#carouselTrack`, `#prevBtn`, `#nextBtn`, `#carouselDots`, `#carousel`. Dots are
  generated in JS; active state is the `aria-selected="true"` attribute (styled in CSS).
  Slides move via a `translateX` transform on `.carousel-track`. Auto-rotate, hover/focus
  pause, and arrow keys all live in `script.js`; it is disabled under
  `prefers-reduced-motion`.
- Sticky-header anchor offset is handled by `scroll-padding-top` on `html` in CSS — if the
  navbar height changes, update that value so anchored sections aren't hidden under it.

### Enquiry form (the one piece with real behavior)

Submits via **FormSubmit's AJAX endpoint** so the page never redirects. Flow in `script.js`:
client-side validation (required fields + email regex) → honeypot check (`_honey`) → JSON
`fetch` POST → on success hide `#enquiryForm` and reveal `#formSuccess`; on error re-enable
the button and show an inline message.

The target address is the `FORMSUBMIT_ENDPOINT` constant in `script.js`, currently the
placeholder `REPLACE_WITH_YOUR_EMAIL`. FormSubmit requires a **one-time activation**: the
first submission to a new address triggers a confirmation email, and delivery only works after
that link is clicked. The JSON body must keep the helper fields `_subject`, `_template`
("table"), and `_captcha` ("false").
