// ============================================================
// 3rd Island Creations — interactions
// ============================================================
(function () {
  "use strict";

  // Mobile nav toggle
  const toggle = document.querySelector(".nav__toggle");
  const menu = document.getElementById("mobile-menu");
  if (toggle && menu) {
    toggle.addEventListener("click", function () {
      const open = menu.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.setAttribute("aria-label", open ? "Close menu" : "Menu");
    });
    // Close menu when a link is chosen
    menu.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        menu.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  // Footer year
  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();

  // Reveal-on-scroll
  const revealEls = document.querySelectorAll(
    ".card, .service, .about__stats li, .contact__card"
  );
  revealEls.forEach((el) => el.classList.add("reveal"));

  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("visible"));
  }

  // Store: filter products by category
  const grid = document.getElementById("product-grid");
  const filterBtns = document.querySelectorAll(".filter-btn");
  if (grid && filterBtns.length) {
    filterBtns.forEach(function (btn) {
      btn.addEventListener("click", function () {
        const filter = btn.getAttribute("data-filter");
        filterBtns.forEach((b) => {
          const active = b === btn;
          b.classList.toggle("is-active", active);
          b.setAttribute("aria-selected", active ? "true" : "false");
        });
        grid.querySelectorAll(".product").forEach(function (card) {
          const cat = card.getAttribute("data-category");
          const show = filter === "all" || cat === filter;
          card.classList.toggle("is-hidden", !show);
        });
      });
    });
    // Store: buy buttons are placeholders until Stripe links are added
    grid.querySelectorAll("[data-buy]").forEach(function (btn) {
      btn.addEventListener("click", function (e) {
        if (btn.getAttribute("href") === "#") {
          e.preventDefault();
          btn.textContent = "Coming soon";
        }
      });
    });
  }

  // Contact form (client-side validation + demo submission)
  const form = document.getElementById("contact-form");
  const status = document.getElementById("form-status");
  if (form && status) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      const name = form.querySelector("#name");
      const email = form.querySelector("#email");
      const message = form.querySelector("#message");

      let valid = true;
      [name, email, message].forEach(function (field) {
        const ok = field.value.trim().length > 0;
        field.classList.toggle("invalid", !ok);
        if (!ok) valid = false;
      });
      const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim());
      email.classList.toggle("invalid", !emailOk);
      if (!emailOk) valid = false;

      if (!valid) {
        status.textContent = "Please fill in every field with a valid email.";
        status.style.color = "var(--coral)";
        return;
      }

      // --------------------------------------------------
      // Formspree delivery
      const FORMSPREE_ID = "mgaewzkl";

      const payload = new FormData();
      payload.append("name", name.value.trim());
      payload.append("email", email.value.trim());
      payload.append("message", message.value.trim());
      payload.append("_replyto", email.value.trim());

      status.textContent = "Sending…";
      status.style.color = "var(--sea)";

      fetch("https://formspree.io/f/" + FORMSPREE_ID, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: payload,
      })
        .then((res) => {
          if (res.ok) {
            status.textContent =
              "Thanks, " + name.value.trim() + "! Your inquiry is on its way.";
            status.style.color = "var(--sea)";
            form.reset();
            [name, email, message].forEach((el) => el.classList.remove("invalid"));
          } else {
            throw new Error("formspree error " + res.status);
          }
        })
        .catch(() => {
          status.textContent = "Something went wrong — email us at jng@3rdislandcreations.com instead.";
          status.style.color = "var(--coral)";
        });
    });
  }
})();