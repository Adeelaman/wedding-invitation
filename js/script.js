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

// Helper: Create date in Pakistan Standard Time (PKT = UTC+5)
function createDateInPKT(year, month, day, hour, minute = 0, second = 0) {
  // Create date string in ISO format with PKT offset (UTC+5)
  // Note: month is 0-indexed in JS Date, but we'll use 1-indexed for clarity
  const dateStr = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}T${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}:${String(second).padStart(2, "0")}+05:00`;
  return new Date(dateStr);
}

// Countdown timer to first event (Barat)
function setupCountdown() {
  const container = document.getElementById("countdown-timer");
  if (!container) return;

  // January 1st, 2026, 18:00 PKT (Pakistan Standard Time, UTC+5)
  const eventDate = createDateInPKT(2026, 1, 1, 18, 0, 0);

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
// ICS format requires UTC times, so we convert PKT (UTC+5) to UTC
function createICSContent({ title, description, location, start, end }) {
  const pad = (n) => String(n).padStart(2, "0");

  function toICSDateString(date) {
    // Convert to UTC for ICS format
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

  // Ensure dates are treated as UTC for ICS generation
  // start and end are already in PKT, so we convert to UTC
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
          title = "Barat Ceremony - Dr. Mian Adeel Ur Rehman Burana";
          description =
            "Barat Ceremony of Dr. Mian Adeel Ur Rehman Burana with Daughter of Mirza Arshad Baig. IN SHA ALLAH.";
          location = "Marquesina, Garrison Country and Golf Club, Lahore Cantt";
          // January 1st, 2026, 18:00 PKT (UTC+5) - 3 hour event
          start = createDateInPKT(2026, 1, 1, 18, 0, 0);
          end = createDateInPKT(2026, 1, 1, 21, 0, 0);
          break;
        }
        case "walima": {
          title = "Walima Ceremony - Dr. Mian Adeel Ur Rehman Burana";
          description =
            "Walima Ceremony of Dr. Mian Adeel Ur Rehman Burana with Daughter of Mirza Arshad Baig. IN SHA ALLAH.";
          location = "Shafaq Lucky Marquee, Burewala Road, Vehari";
          // January 3rd, 2026, 18:00 PKT (UTC+5) - Reception at 6pm, Dinner at 7pm
          start = createDateInPKT(2026, 1, 3, 18, 0, 0);
          end = createDateInPKT(2026, 1, 3, 21, 0, 0);
          break;
        }
        case "sisterBarat": {
          title = "Barat Ceremony - Beloved Daughter";
          description =
            "Barat Ceremony of beloved Daughter of Mian Aman Ullah Saleem with Taimoor Ahmed. IN SHA ALLAH.";
          location = "Shafaq Lucky Marquee, Burewala Road, Vehari";
          // January 3rd, 2026, 18:00 PKT (UTC+5) - Reception at 6pm, Dinner at 7pm, Rukhsati at 8:30pm
          start = createDateInPKT(2026, 1, 3, 18, 0, 0);
          end = createDateInPKT(2026, 1, 3, 21, 30, 0);
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
document.addEventListener('click', function (e) {
  const card = e.target.closest('.js-contact--call-toggle');
  if (!card) return;

  const href = card.getAttribute('data-href');
  if (!href) return;

  const a = document.createElement('a');
  a.href = href;
  a.style.display = 'none';

  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
});
