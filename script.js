/* ============================================================
   Sterling & Vale Advisory — script.js
   Vanilla JS. No dependencies.
   ============================================================ */
(function () {
  "use strict";

  /* ---------- Footer year (auto-updates) ---------- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ============================================================
     Mobile navigation (hamburger)
     ============================================================ */
  var navToggle = document.getElementById("navToggle");
  var navMenu = document.getElementById("navMenu");

  function closeMenu() {
    if (!navMenu) return;
    navMenu.classList.remove("open");
    navToggle.setAttribute("aria-expanded", "false");
    navToggle.setAttribute("aria-label", "Open menu");
  }

  if (navToggle && navMenu) {
    navToggle.addEventListener("click", function () {
      var open = navMenu.classList.toggle("open");
      navToggle.setAttribute("aria-expanded", String(open));
      navToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    });

    // Close the menu after tapping a link (anchors handle their own scroll)
    navMenu.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", closeMenu);
    });

    // Close on Escape
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeMenu();
    });
  }

  /* ============================================================
     Testimonials carousel
     ============================================================ */
  var track = document.getElementById("carouselTrack");
  var prevBtn = document.getElementById("prevBtn");
  var nextBtn = document.getElementById("nextBtn");
  var dotsWrap = document.getElementById("carouselDots");
  var carousel = document.getElementById("carousel");

  if (track && carousel) {
    var slides = Array.prototype.slice.call(track.children);
    var count = slides.length;
    var index = 0;
    var timer = null;
    var INTERVAL = 6000;
    var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Build dot controls
    var dots = [];
    if (dotsWrap) {
      for (var i = 0; i < count; i++) {
        (function (i) {
          var dot = document.createElement("button");
          dot.setAttribute("role", "tab");
          dot.setAttribute("aria-label", "Go to testimonial " + (i + 1));
          dot.addEventListener("click", function () {
            goTo(i);
            restart();
          });
          dotsWrap.appendChild(dot);
          dots.push(dot);
        })(i);
      }
    }

    function update() {
      track.style.transform = "translateX(" + (-index * 100) + "%)";
      slides.forEach(function (s, i) {
        s.setAttribute("aria-hidden", String(i !== index));
      });
      dots.forEach(function (d, i) {
        d.setAttribute("aria-selected", String(i === index));
      });
    }

    function goTo(i) {
      index = (i + count) % count;
      update();
    }
    function next() { goTo(index + 1); }
    function prev() { goTo(index - 1); }

    function start() {
      if (reduceMotion || count < 2) return;
      stop();
      timer = window.setInterval(next, INTERVAL);
    }
    function stop() {
      if (timer) { window.clearInterval(timer); timer = null; }
    }
    function restart() { stop(); start(); }

    if (nextBtn) nextBtn.addEventListener("click", function () { next(); restart(); });
    if (prevBtn) prevBtn.addEventListener("click", function () { prev(); restart(); });

    // Pause auto-rotation on hover / focus within
    carousel.addEventListener("mouseenter", stop);
    carousel.addEventListener("mouseleave", start);
    carousel.addEventListener("focusin", stop);
    carousel.addEventListener("focusout", start);

    // Keyboard arrows when carousel is focused
    carousel.addEventListener("keydown", function (e) {
      if (e.key === "ArrowRight") { next(); restart(); }
      else if (e.key === "ArrowLeft") { prev(); restart(); }
    });

    update();
    start();
  }

  /* ============================================================
     Enquiry form — FormSubmit AJAX submission
     ============================================================ */

  // ─────────────────────────────────────────────────────────────
  // REPLACE_WITH_YOUR_EMAIL: put your real address below.
  // NOTE: FormSubmit requires a one-time activation. The FIRST submission
  // to a new email triggers a confirmation email — the form only delivers
  // messages after you click that activation link.
  // ─────────────────────────────────────────────────────────────
  var FORMSUBMIT_ENDPOINT = "https://formsubmit.co/ajax/REPLACE_WITH_YOUR_EMAIL";

  var form = document.getElementById("enquiryForm");
  var submitBtn = document.getElementById("submitBtn");
  var statusEl = document.getElementById("formStatus");
  var successEl = document.getElementById("formSuccess");

  var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function setFieldError(name, message) {
    var input = form.querySelector("#" + name);
    var errEl = form.querySelector('[data-error-for="' + name + '"]');
    var field = input ? input.closest(".field") : null;
    if (field) field.classList.toggle("invalid", Boolean(message));
    if (errEl) errEl.textContent = message || "";
  }

  function validate() {
    var ok = true;
    var name = form.name.value.trim();
    var email = form.email.value.trim();
    var message = form.message.value.trim();

    if (!name) { setFieldError("name", "Please enter your name."); ok = false; }
    else setFieldError("name", "");

    if (!email) { setFieldError("email", "Please enter your email."); ok = false; }
    else if (!EMAIL_RE.test(email)) { setFieldError("email", "Please enter a valid email address."); ok = false; }
    else setFieldError("email", "");

    if (!message) { setFieldError("message", "Please tell us a little about your enquiry."); ok = false; }
    else setFieldError("message", "");

    return ok;
  }

  function setStatus(msg, isError) {
    if (!statusEl) return;
    statusEl.textContent = msg || "";
    statusEl.classList.toggle("error", Boolean(isError));
  }

  if (form) {
    // Clear an individual field error as the user corrects it
    ["name", "email", "message"].forEach(function (id) {
      var el = form.querySelector("#" + id);
      if (el) el.addEventListener("input", function () { setFieldError(id, ""); });
    });

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      setStatus("");

      // Honeypot: if a bot filled the hidden field, silently abort.
      if (form._honey && form._honey.value) return;

      if (!validate()) {
        setStatus("Please fix the highlighted fields and try again.", true);
        return;
      }

      var payload = {
        name: form.name.value.trim(),
        email: form.email.value.trim(),
        phone: form.phone.value.trim(),
        interest: form.interest.value,
        message: form.message.value.trim(),
        _subject: "New enquiry from Sterling & Vale website",
        _template: "table",
        _captcha: "false"
      };

      var originalLabel = submitBtn.textContent;
      submitBtn.disabled = true;
      submitBtn.textContent = "Sending…";

      fetch(FORMSUBMIT_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json"
        },
        body: JSON.stringify(payload)
      })
        .then(function (res) {
          if (!res.ok) throw new Error("Request failed with status " + res.status);
          return res.json();
        })
        .then(function () {
          // Success: hide the form, reveal the friendly confirmation.
          form.reset();
          form.hidden = true;
          if (successEl) {
            successEl.hidden = false;
            successEl.scrollIntoView({ behavior: "smooth", block: "center" });
          }
        })
        .catch(function () {
          setStatus(
            "Sorry — something went wrong sending your enquiry. Please try again, or email us directly.",
            true
          );
          submitBtn.disabled = false;
          submitBtn.textContent = originalLabel;
        });
    });
  }
})();
