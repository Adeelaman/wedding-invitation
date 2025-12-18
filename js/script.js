// script.js
// Core interactivity for the Islamic wedding invitation SPA

// Util: Smooth scroll to target
function smoothScrollTo(targetSelector) {
  const el = document.querySelector(targetSelector);
  if (!el) return;
  el.scrollIntoView({ behavior: "smooth", block: "start" });
}

// Navigation: smooth scroll handling
function setupSmoothScroll() {
  document.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;

    const scrollTarget = target.getAttribute("data-scroll-target");
    if (!scrollTarget) return;

    event.preventDefault();
    smoothScrollTo(scrollTarget);
  });
}

// Mobile nav toggle
function setupMobileNav() {
  const toggle = document.querySelector(".nav-toggle");
  const menu = document.getElementById("nav-menu");

  if (!toggle || !menu) return;

  toggle.addEventListener("click", () => {
    const isExpanded = toggle.getAttribute("aria-expanded") === "true";
    toggle.setAttribute("aria-expanded", String(!isExpanded));
    menu.classList.toggle("open", !isExpanded);
  });

  // Close menu on link click (mobile)
  menu.addEventListener("click", (event) => {
    const target = event.target;
    if (target instanceof HTMLAnchorElement) {
      toggle.setAttribute("aria-expanded", "false");
      menu.classList.remove("open");
    }
  });
}

// Intersection Observer for reveal animations
function setupRevealOnScroll() {
  const elements = document.querySelectorAll(".reveal");
  if (!("IntersectionObserver" in window) || elements.length === 0) {
    elements.forEach((el) => el.classList.add("reveal-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("reveal-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      root: null,
      threshold: 0.2,
    }
  );

  elements.forEach((el) => observer.observe(el));
}

// Countdown timer to first event (Barat)
function setupCountdown() {
  const container = document.getElementById("countdown-timer");
  if (!container) return;

  // January 1st, 2026, 18:00 local time
  const eventDate = new Date("2026-01-01T18:00:00");

  function updateCountdown() {
    const now = new Date();
    let diff = eventDate.getTime() - now.getTime();

    if (diff <= 0) {
      container.innerHTML =
        "<span><strong>00</strong><small>Days</small></span>" +
        "<span><strong>00</strong><small>Hours</small></span>" +
        "<span><strong>00</strong><small>Minutes</small></span>" +
        "<span><strong>00</strong><small>Seconds</small></span>";
      return;
    }

    const seconds = Math.floor(diff / 1000);
    const days = Math.floor(seconds / (60 * 60 * 24));
    const hours = Math.floor((seconds % (60 * 60 * 24)) / (60 * 60));
    const minutes = Math.floor((seconds % (60 * 60)) / 60);
    const secs = seconds % 60;

    const pad = (n) => String(n).padStart(2, "0");

    container.innerHTML = `
      <span><strong>${pad(days)}</strong><small>Days</small></span>
      <span><strong>${pad(hours)}</strong><small>Hours</small></span>
      <span><strong>${pad(minutes)}</strong><small>Minutes</small></span>
      <span><strong>${pad(secs)}</strong><small>Seconds</small></span>
    `;
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);
}

// Add-to-calendar (.ics) generation
function createICSContent({ title, description, location, start, end }) {
  const pad = (n) => String(n).padStart(2, "0");

  function toICSDateString(date) {
    return (
      date.getUTCFullYear().toString() +
      pad(date.getUTCMonth() + 1) +
      pad(date.getUTCDate()) +
      "T" +
      pad(date.getUTCHours()) +
      pad(date.getUTCMinutes()) +
      pad(date.getUTCSeconds()) +
      "Z"
    );
  }

  const dtStart = toICSDateString(start);
  const dtEnd = toICSDateString(end);
  const dtStamp = toICSDateString(new Date());
  const uid = `${Date.now()}-${Math.random().toString(36).slice(2)}@wedding-invitation`;

  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Wedding Invitation//EN",
    "CALSCALE:GREGORIAN",
    "BEGIN:VEVENT",
    `UID:${uid}`,
    `DTSTAMP:${dtStamp}`,
    `DTSTART:${dtStart}`,
    `DTEND:${dtEnd}`,
    `SUMMARY:${title}`,
    `DESCRIPTION:${description}`,
    `LOCATION:${location}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
}

function downloadICS(filename, content) {
  const blob = new Blob([content], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function setupCalendarButtons() {
  const buttons = document.querySelectorAll("[data-calendar]");
  if (!buttons.length) return;

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      const type = button.getAttribute("data-calendar");
      if (!type) return;

      let title = "";
      let description = "";
      let location = "";
      let start;
      let end;

      switch (type) {
        case "barat": {
          title = "Barat Ceremony - Mian Adeel Ur Rehman";
          description =
            "Barat Ceremony of Mian Adeel Ur Rehman with Daughter of Mirza Arshad Baig. IN SHA ALLAH.";
          location = "Marquesina, Garrison Country and Golf Club, Lahore Cantt";
          start = new Date("2026-01-01T18:00:00");
          end = new Date("2026-01-01T21:00:00");
          break;
        }
        case "walima": {
          title = "Walima Ceremony - Mian Adeel Ur Rehman";
          description =
            "Walima Ceremony of Mian Adeel Ur Rehman with Daughter of Mirza Arshad Baig. IN SHA ALLAH.";
          location = "Shafaq Lucky Marquee, Burewala Road, Vehari";
          start = new Date("2026-01-03T18:00:00");
          end = new Date("2026-01-03T21:00:00");
          break;
        }
        case "sisterBarat": {
          title = "Barat Ceremony - Beloved Daughter";
          description =
            "Barat Ceremony of beloved Daughter of Mian Aman Ullah Saleem with Taimoor Ahmed. IN SHA ALLAH.";
          location = "Shafaq Lucky Marquee, Burewala Road, Vehari";
          start = new Date("2026-01-03T18:00:00");
          end = new Date("2026-01-03T21:30:00");
          break;
        }
        default:
          return;
      }

      const icsContent = createICSContent({
        title,
        description,
        location,
        start,
        end,
      });

      downloadICS(`${type}-event.ics`, icsContent);
    });
  });
}

// Lazy loading hook (for potential future dynamic content)
function setupLazyLoading() {
  // Images already use native loading="lazy".
  // This hook can be extended for background images or heavier assets.
}

// Show / hide Barat section depending on URL parameter
function setupConditionalBaratVisibility() {
  const baratSection = document.getElementById("barat");
  if (!baratSection) return;

  const params = new URLSearchParams(window.location.search);
  const baratParam = params.get("barat");

  // Usage examples:
  //   ?barat=hide  -> hides the Barat section
  //   ?barat=show  -> explicitly shows it (default)
  if (baratParam === "hide") {
    baratSection.style.display = "none";
  } else if (baratParam === "show") {
    baratSection.style.display = "";
  }
}

// Footer year
function setCurrentYear() {
  const yearEl = document.getElementById("current-year");
  if (!yearEl) return;
  yearEl.textContent = String(new Date().getFullYear());
}

// Keyboard navigation: close mobile menu with Escape
function setupKeyboardShortcuts() {
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      const toggle = document.querySelector(".nav-toggle");
      const menu = document.getElementById("nav-menu");
      if (!toggle || !menu) return;

      toggle.setAttribute("aria-expanded", "false");
      menu.classList.remove("open");
    }
  });
}

// Initialize all features once DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  setupSmoothScroll();
  setupMobileNav();
  setupRevealOnScroll();
  setupCountdown();
  setupCalendarButtons();
  setupLazyLoading();
  setupConditionalBaratVisibility();
  setCurrentYear();
  setupKeyboardShortcuts();
});


