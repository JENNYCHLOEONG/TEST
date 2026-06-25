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
  // Enquiries are emailed here via FormSubmit.
  // NOTE: FormSubmit requires a one-time activation. The FIRST submission
  // to this address triggers a confirmation email — the form only delivers
  // messages after you click that activation link. To change the recipient,
  // swap the address below.
  // ─────────────────────────────────────────────────────────────
  var FORMSUBMIT_ENDPOINT = "https://formsubmit.co/ajax/joln79@yahoo.co.uk";

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

    if (!name) { setFieldError("name", "Please enter your name."); ok = false; }
    else setFieldError("name", "");

    if (!email) { setFieldError("email", "Please enter your email."); ok = false; }
    else if (!EMAIL_RE.test(email)) { setFieldError("email", "Please enter a valid email address."); ok = false; }
    else setFieldError("email", "");

    // Message is optional — keeping the form low-friction lifts conversions.
    return ok;
  }

  function setStatus(msg, isError) {
    if (!statusEl) return;
    statusEl.textContent = msg || "";
    statusEl.classList.toggle("error", Boolean(isError));
  }

  /* ---------- Success celebration: voice + balloons ---------- */
  var SUCCESS_MESSAGE =
    "Hurray, thank you for your submission, we will get back to you in 1 business day.";

  function speakThankYou() {
    try {
      if (!("speechSynthesis" in window) || typeof SpeechSynthesisUtterance === "undefined") return;
      // The submit click is a user gesture, so speech is allowed to start.
      window.speechSynthesis.cancel();
      var utter = new SpeechSynthesisUtterance(SUCCESS_MESSAGE);
      utter.lang = "en-US";
      utter.rate = 1;
      utter.pitch = 1.1;
      utter.volume = 1;
      window.speechSynthesis.speak(utter);
    } catch (err) {
      /* Speech unsupported or blocked — fail silently. */
    }
  }

  function launchBalloons() {
    var layer = document.createElement("div");
    layer.className = "balloon-layer";
    layer.setAttribute("aria-hidden", "true");
    document.body.appendChild(layer);

    var colors = [
      "var(--rose-600)", "var(--rose-400)", "var(--rose-800)",
      "var(--champagne)", "#6D28D9", "#25D366"
    ];
    var TOTAL = 18;

    for (var i = 0; i < TOTAL; i++) {
      var balloon = document.createElement("span");
      balloon.className = "balloon";
      var size = 30 + Math.round(Math.random() * 26);
      balloon.style.left = (Math.random() * 96 + 2) + "vw";
      balloon.style.width = size + "px";
      balloon.style.height = Math.round(size * 1.25) + "px";
      balloon.style.background = colors[i % colors.length];
      balloon.style.animationDuration = (4.2 + Math.random() * 3).toFixed(2) + "s";
      balloon.style.animationDelay = (Math.random() * 0.9).toFixed(2) + "s";
      layer.appendChild(balloon);
    }

    // Remove the layer once every balloon has finished rising.
    window.setTimeout(function () {
      if (layer.parentNode) layer.parentNode.removeChild(layer);
    }, 9000);
  }

  function celebrateSuccess() {
    speakThankYou();
    // Skip the balloon animation for visitors who prefer reduced motion.
    var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!reduce) launchBalloons();
  }

  if (form) {
    // Clear an individual field error as the user corrects it
    ["name", "email"].forEach(function (id) {
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
        interest: form.interest.value,
        message: form.message.value.trim(),
        _subject: "New free-review request from Sterling & Vale website",
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
        .then(function (data) {
          // FormSubmit returns HTTP 200 even on failure — the real result is in
          // data.success ("true"/"false"). Only treat an explicit success as sent.
          var sent = data && (data.success === true || String(data.success).toLowerCase() === "true");
          if (!sent) {
            throw new Error((data && data.message) || "Submission was not accepted.");
          }
          // Success: hide the form, reveal the friendly confirmation.
          form.reset();
          form.hidden = true;
          if (successEl) {
            successEl.hidden = false;
            successEl.scrollIntoView({ behavior: "smooth", block: "center" });
          }
          // Celebrate: speak a thank-you and float balloons.
          celebrateSuccess();
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

  /* ============================================================
     WhatsApp floating widget
     ============================================================ */
  var WHATSAPP_NUMBER = "6596869598"; // +65 9686 9598 (no "+" or spaces)

  // Suggested questions — each opens WhatsApp with the message pre-filled.
  var WA_SUGGESTIONS = [
    "I'd like a free portfolio review",
    "How much does a consultation cost?",
    "Help me plan for retirement",
    "I have an estate planning question"
  ];

  var waWidget = document.getElementById("waWidget");
  var waLauncher = document.getElementById("waLauncher");
  var waPanel = document.getElementById("waPanel");
  var waClose = document.getElementById("waClose");
  var waChips = document.getElementById("waChips");

  if (waWidget && waLauncher && waPanel) {
    function waLink(text) {
      return "https://wa.me/" + WHATSAPP_NUMBER + "?text=" + encodeURIComponent(text);
    }

    // Build the suggested-question chips
    if (waChips) {
      WA_SUGGESTIONS.forEach(function (text) {
        var a = document.createElement("a");
        a.className = "wa-chip";
        a.href = waLink(text);
        a.target = "_blank";
        a.rel = "noopener";
        a.textContent = text;
        waChips.appendChild(a);
      });
    }

    function openPanel() {
      waWidget.classList.add("wa-open");
      waPanel.hidden = false;
      waLauncher.setAttribute("aria-expanded", "true");
    }
    function closePanel() {
      waWidget.classList.remove("wa-open");
      waPanel.hidden = true;
      waLauncher.setAttribute("aria-expanded", "false");
    }
    function togglePanel() {
      if (waWidget.classList.contains("wa-open")) closePanel();
      else openPanel();
    }

    waLauncher.addEventListener("click", togglePanel);
    if (waClose) waClose.addEventListener("click", closePanel);

    // Close on Escape
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && waWidget.classList.contains("wa-open")) closePanel();
    });

    // Close when clicking outside the widget
    document.addEventListener("click", function (e) {
      if (waWidget.classList.contains("wa-open") && !waWidget.contains(e.target)) closePanel();
    });
  }

  /* ============================================================
     Social share strip
     ============================================================ */
  var SHARE_URL  = "https://JENNYCHLOEONG.github.io/TEST/";
  var SHARE_TEXT = "Sterling & Vale Advisory offer a free, no-obligation portfolio review. Worth a look if you want a calm, independent second opinion on your finances.";
  var SHARE_SUBJECT = "Free portfolio review from Sterling & Vale Advisory";

  var shareLinkedIn  = document.getElementById("shareLinkedIn");
  var shareX         = document.getElementById("shareX");
  var shareWhatsApp  = document.getElementById("shareWhatsApp");
  var shareEmail     = document.getElementById("shareEmail");
  var shareCopy      = document.getElementById("shareCopy");
  var shareCopyLabel = document.getElementById("shareCopyLabel");

  if (shareLinkedIn) {
    shareLinkedIn.href =
      "https://www.linkedin.com/sharing/share-offsite/?url=" +
      encodeURIComponent(SHARE_URL);
  }

  if (shareX) {
    shareX.href =
      "https://twitter.com/intent/tweet?url=" +
      encodeURIComponent(SHARE_URL) +
      "&text=" +
      encodeURIComponent(SHARE_TEXT);
  }

  if (shareWhatsApp) {
    shareWhatsApp.href =
      "https://wa.me/?text=" +
      encodeURIComponent(SHARE_TEXT + " " + SHARE_URL);
  }

  if (shareEmail) {
    shareEmail.href =
      "mailto:?subject=" +
      encodeURIComponent(SHARE_SUBJECT) +
      "&body=" +
      encodeURIComponent(SHARE_TEXT + "\n\n" + SHARE_URL);
  }

  if (shareCopy && shareCopyLabel) {
    shareCopy.addEventListener("click", function () {
      if (!navigator.clipboard) {
        // Fallback for older browsers: select a temporary textarea
        var ta = document.createElement("textarea");
        ta.value = SHARE_URL;
        ta.style.position = "fixed";
        ta.style.left = "-9999px";
        document.body.appendChild(ta);
        ta.select();
        try { document.execCommand("copy"); } catch (err) { /* silent */ }
        document.body.removeChild(ta);
        showCopied();
        return;
      }
      navigator.clipboard.writeText(SHARE_URL).then(showCopied, function () {
        // If clipboard write is rejected (e.g. no user gesture), do nothing
      });
    });

    function showCopied() {
      shareCopyLabel.textContent = "Copied!";
      shareCopy.setAttribute("data-copied", "true");
      shareCopy.setAttribute("aria-label", "Link copied to clipboard");
      var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      window.setTimeout(function () {
        shareCopyLabel.textContent = "Copy link";
        shareCopy.removeAttribute("data-copied");
        shareCopy.setAttribute("aria-label", "Copy page link");
      }, reduceMotion ? 800 : 2000);
    }
  }
})();
