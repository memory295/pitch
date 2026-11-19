"use strict";

const CONFIG = {
  clientName: "Ministry of Trade",
  clientShort: "MoT",
  preparedDate: "November 19, 2026",
  demoUrl: "#",
  contact: {
    location: "Blantyre, Malawi",
    email: "sales@mitra.mw",
    website: "www.mitrasystems.africa",
    websiteUrl: "https://www.mitrasystems.africa"
  }
};

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

document.documentElement.classList.add("js");

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}

function init() {
  renderConfig();
  initPlaceholders();
  initNavigation();
  initReveal();
  initStats();
  initTabs();
  initScrollSections();
  initPrivacy();
}

function renderConfig() {
  document.querySelectorAll("[data-client-name]").forEach((el) => {
    el.textContent = CONFIG.clientName;
  });

  document.querySelectorAll("[data-client-short]").forEach((el) => {
    el.textContent = CONFIG.clientShort;
  });

  document.querySelectorAll("[data-prepared-date]").forEach((el) => {
    el.textContent = CONFIG.preparedDate;
  });

  document.querySelectorAll("[data-contact-location]").forEach((el) => {
    el.textContent = CONFIG.contact.location;
  });

  const logo = document.querySelector("[data-client-logo]");
  if (logo) {
    logo.alt = CONFIG.clientName + " logo";
  }

  const demoLink = document.querySelector("[data-demo-url]");
  if (demoLink) {
    demoLink.href = CONFIG.demoUrl;
    demoLink.setAttribute("aria-label", "Launch the live helpdesk demo (opens in a new tab)");
  }

  const emailLink = document.querySelector("[data-contact-email]");
  if (emailLink) {
    emailLink.textContent = CONFIG.contact.email;
    emailLink.href = "mailto:" + CONFIG.contact.email;
  }

  const websiteLink = document.querySelector("[data-contact-website]");
  if (websiteLink) {
    websiteLink.textContent = CONFIG.contact.website;
    websiteLink.href = CONFIG.contact.websiteUrl;
  }

  document.title = "Mitra Helpdesk for the " + CONFIG.clientName;

  const description = document.querySelector('meta[name="description"]');
  if (description) {
    description.setAttribute(
      "content",
      "A private proposal for " +
        CONFIG.clientName +
        ": a dedicated, Ministry-branded customer support platform for managing stakeholder enquiries, complaints and service requests."
    );
  }
}

function initPlaceholders() {
  document.querySelectorAll("img").forEach((img) => {
    img.addEventListener("error", () => handleImageError(img));
    if (img.complete && img.naturalWidth === 0) {
      handleImageError(img);
    }
  });
}

function handleImageError(img) {
  if (img.dataset.missing === "true" || img.dataset.fallbackTried === "true") {
    markImageMissing(img);
    return;
  }

  const source = img.getAttribute("src") || "";
  let fallback = "";

  if (/\.jpe?g$/i.test(source)) {
    fallback = source.replace(/\.jpe?g$/i, ".png");
  } else if (/\.png$/i.test(source)) {
    fallback = source.replace(/\.png$/i, ".jpg");
  }

  if (!fallback) {
    markImageMissing(img);
    return;
  }

  img.dataset.fallbackTried = "true";
  img.setAttribute("src", fallback);
}

function markImageMissing(img) {
  if (img.dataset.missing === "true") {
    return;
  }

  img.dataset.missing = "true";
  img.hidden = true;

  const frame = img.parentElement;
  if (!frame) {
    return;
  }

  frame.classList.add("is-missing");

  const name =
    img.getAttribute("data-ph") ||
    (img.getAttribute("src") || "image").split("/").pop();

  const placeholder = document.createElement("div");
  placeholder.className = "img-ph";
  placeholder.setAttribute("role", "img");
  placeholder.setAttribute("aria-label", "Image placeholder: " + name);

  const label = document.createElement("span");
  label.textContent = name;
  placeholder.appendChild(label);
  frame.appendChild(placeholder);
}

function initNavigation() {
  const sections = Array.from(document.querySelectorAll("main > section"));
  const nav = document.getElementById("sectionNav");
  const progress = document.getElementById("navProgress");
  const counter = document.getElementById("navCounter");
  const prev = document.getElementById("navPrev");
  const next = document.getElementById("navNext");
  const exit = document.getElementById("navExit");
  const restore = document.getElementById("navRestore");

  if (!sections.length || !nav || !progress || !counter || !prev || !next || !exit || !restore) {
    return;
  }

  const segments = [];
  let activeIndex = 0;

  sections.forEach((section, index) => {
    const label = section.getAttribute("data-nav") || "Section " + (index + 1);
    const segment = document.createElement("button");
    segment.type = "button";
    segment.className = "nav-seg";
    segment.setAttribute("aria-label", "Go to section " + (index + 1) + ": " + label);
    segment.title = label;
    segment.addEventListener("click", () => goToSection(index));
    progress.appendChild(segment);
    segments.push(segment);
  });

  function goToSection(index) {
    const target = sections[Math.max(0, Math.min(sections.length - 1, index))];
    if (!target) {
      return;
    }
    target.scrollIntoView({
      behavior: reducedMotion.matches ? "auto" : "smooth",
      block: "start"
    });
  }

  function setActive(index) {
    activeIndex = index;
    segments.forEach((segment, i) => {
      const isActive = i === index;
      segment.classList.toggle("is-active", isActive);
      if (isActive) {
        segment.setAttribute("aria-current", "step");
      } else {
        segment.removeAttribute("aria-current");
      }
    });
    counter.textContent = index + 1 + "/" + sections.length;
    prev.disabled = index === 0;
    next.disabled = index === sections.length - 1;
  }

  function activeFromGeometry() {
    let index = 0;
    sections.forEach((section, i) => {
      const rect = section.getBoundingClientRect();
      if (rect.top <= 2) {
        index = i;
      }
    });
    setActive(index);
  }

  let navTicking = false;

  function onNavScroll() {
    if (navTicking) {
      return;
    }
    navTicking = true;
    requestAnimationFrame(() => {
      activeFromGeometry();
      navTicking = false;
    });
  }

  prev.addEventListener("click", () => goToSection(activeIndex - 1));
  next.addEventListener("click", () => goToSection(activeIndex + 1));

  exit.addEventListener("click", () => {
    nav.classList.add("is-hidden");
    nav.setAttribute("inert", "");
    restore.hidden = false;
    restore.focus();
  });

  restore.addEventListener("click", () => {
    nav.classList.remove("is-hidden");
    nav.removeAttribute("inert");
    restore.hidden = true;
    exit.focus();
  });

  if ("IntersectionObserver" in window) {
    const navObserver = new IntersectionObserver(activeFromGeometry, {
      rootMargin: "-42% 0px -52% 0px",
      threshold: 0
    });
    sections.forEach((section) => navObserver.observe(section));
  } else {
    window.addEventListener("scroll", activeFromGeometry, { passive: true });
  }

  window.addEventListener("scroll", onNavScroll, { passive: true });
  window.addEventListener("resize", activeFromGeometry);
  setActive(0);
  activeFromGeometry();
}

function initReveal() {
  const items = document.querySelectorAll(".reveal");
  if (!items.length) {
    return;
  }

  if (reducedMotion.matches || !("IntersectionObserver" in window)) {
    items.forEach((item) => item.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -6% 0px" }
  );

  items.forEach((item) => observer.observe(item));
}

function initStats() {
  const grid = document.getElementById("statsGrid");
  if (!grid) {
    return;
  }

  const counters = Array.from(grid.querySelectorAll("[data-count-to]"));
  let started = false;

  function start() {
    if (started) {
      return;
    }
    started = true;
    counters.forEach((el, i) => {
      const target = parseInt(el.getAttribute("data-count-to"), 10);
      if (Number.isNaN(target)) {
        return;
      }
      if (reducedMotion.matches) {
        el.textContent = String(target);
      } else {
        animateCount(el, target, 1300 + i * 120);
      }
    });
  }

  if (!("IntersectionObserver" in window)) {
    start();
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        start();
        observer.disconnect();
      }
    },
    { threshold: 0.35 }
  );

  observer.observe(grid);
}

function animateCount(el, target, duration) {
  const startTime = performance.now();

  function frame(now) {
    const progress = Math.min(1, (now - startTime) / duration);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = String(Math.round(target * eased));
    if (progress < 1) {
      requestAnimationFrame(frame);
    } else {
      el.textContent = String(target);
    }
  }

  requestAnimationFrame(frame);
}

function initTabs() {
  const tablist = document.querySelector('[role="tablist"]');
  if (!tablist) {
    return;
  }

  const tabs = Array.from(tablist.querySelectorAll('[role="tab"]'));
  const panels = tabs.map((tab) => document.getElementById(tab.getAttribute("aria-controls")));

  if (!tabs.length || panels.some((panel) => !panel)) {
    return;
  }

  function activate(index, moveFocus) {
    tabs.forEach((tab, i) => {
      const selected = i === index;
      tab.setAttribute("aria-selected", selected ? "true" : "false");
      tab.tabIndex = selected ? 0 : -1;
      panels[i].hidden = !selected;
    });
    if (moveFocus) {
      tabs[index].focus();
    }
  }

  tabs.forEach((tab, index) => {
    tab.addEventListener("click", () => activate(index, false));
  });

  tablist.addEventListener("keydown", (event) => {
    const current = tabs.indexOf(document.activeElement);
    if (current === -1) {
      return;
    }

    let nextIndex = null;

    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      nextIndex = (current + 1) % tabs.length;
    } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      nextIndex = (current - 1 + tabs.length) % tabs.length;
    } else if (event.key === "Home") {
      nextIndex = 0;
    } else if (event.key === "End") {
      nextIndex = tabs.length - 1;
    }

    if (nextIndex !== null) {
      event.preventDefault();
      activate(nextIndex, true);
    }
  });

  activate(0, false);
}

function initScrollSections() {
  const aiSection = document.getElementById("ai");
  const aiSteps = aiSection ? Array.from(aiSection.querySelectorAll("[data-ai-step]")) : [];
  const aiFrames = aiSection ? Array.from(aiSection.querySelectorAll("[data-ai-frame]")) : [];

  const timelineSection = document.getElementById("timeline");
  const timelineTrack = document.getElementById("timelineTrack");
  const timelineFill = document.getElementById("timelineFill");
  const timelineSteps = timelineSection
    ? Array.from(timelineSection.querySelectorAll("[data-tl-step]"))
    : [];

  let aiIndex = -1;
  let timelineIndex = -1;
  let ticking = false;

  function computeProgress(section) {
    const rect = section.getBoundingClientRect();
    const scrollable = section.offsetHeight - window.innerHeight;
    if (scrollable <= 0) {
      return 0;
    }
    return Math.min(1, Math.max(0, -rect.top / scrollable));
  }

  function updateAI() {
    if (!aiSection || !aiSteps.length || !aiFrames.length) {
      return;
    }

    const line = window.innerHeight * 0.3;
    let index = 0;

    aiSteps.forEach((step, i) => {
      const rect = step.getBoundingClientRect();
      if (rect.top <= line && rect.bottom > line) {
        index = i;
      }
    });

    if (index === aiIndex) {
      return;
    }

    aiIndex = index;

    aiFrames.forEach((frame, i) => {
      const active = i === index;
      frame.classList.toggle("is-active", active);
      if (active) {
        frame.removeAttribute("aria-hidden");
      } else {
        frame.setAttribute("aria-hidden", "true");
      }
    });
  }

  function updateTimeline() {
    if (!timelineSection || !timelineSteps.length) {
      return;
    }

    const progress = computeProgress(timelineSection);
    const index = Math.min(
      timelineSteps.length - 1,
      Math.floor(progress * timelineSteps.length)
    );

    if (index === timelineIndex) {
      return;
    }

    timelineIndex = index;

    timelineSteps.forEach((step, i) => {
      step.classList.toggle("is-active", i === index);
      step.classList.toggle("is-done", i < index);
    });

    layoutTimeline();
  }

  function layoutTimeline() {
    if (!timelineTrack || !timelineFill || !timelineSteps.length) {
      return;
    }

    const firstNumber = timelineSteps[0].querySelector(".tl-num");
    const lastNumber = timelineSteps[timelineSteps.length - 1].querySelector(".tl-num");
    if (!firstNumber || !lastNumber) {
      return;
    }

    const trackRect = timelineTrack.getBoundingClientRect();
    const firstRect = firstNumber.getBoundingClientRect();
    const lastRect = lastNumber.getBoundingClientRect();
    const start = firstRect.top - trackRect.top + firstRect.height / 2;
    const end = lastRect.top - trackRect.top + lastRect.height / 2;

    timelineTrack.style.setProperty("--tl-start", start + "px");
    timelineTrack.style.setProperty("--tl-length", Math.max(0, end - start) + "px");

    if (timelineIndex < 0) {
      return;
    }

    const activeNumber = timelineSteps[timelineIndex].querySelector(".tl-num");
    if (!activeNumber) {
      return;
    }

    const activeRect = activeNumber.getBoundingClientRect();
    const activeCenter = activeRect.top - trackRect.top + activeRect.height / 2;

    timelineFill.style.height = Math.max(0, activeCenter - start) + "px";
  }

  function updateAll() {
    updateAI();
    updateTimeline();
  }

  function onScroll() {
    if (ticking) {
      return;
    }
    ticking = true;
    requestAnimationFrame(() => {
      updateAll();
      ticking = false;
    });
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", () => {
    updateAll();
    layoutTimeline();
  });
  window.addEventListener("load", () => {
    updateAll();
    layoutTimeline();
  });

  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(() => {
      updateAll();
      layoutTimeline();
    });
  }

  updateAll();
  requestAnimationFrame(layoutTimeline);
}

function initPrivacy() {
  const privacy = document.getElementById("privacyLink");
  if (!privacy) {
    return;
  }

  privacy.addEventListener("click", (event) => {
    event.preventDefault();
  });
}
