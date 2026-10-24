// ========== Theme (light / dark) ==========
const root = document.documentElement;
const themeToggle = document.querySelector(".theme-toggle");

function getStoredTheme() {
  try {
    return localStorage.getItem("theme");
  } catch {
    return null;
  }
}

function setTheme(theme) {
  root.setAttribute("data-theme", theme);
  try {
    localStorage.setItem("theme", theme);
  } catch {
    // Storage unavailable (e.g. private mode) — theme still applies for this visit
  }
}

const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
root.setAttribute("data-theme", getStoredTheme() || (prefersDark ? "dark" : "light"));

themeToggle.addEventListener("click", () => {
  setTheme(root.getAttribute("data-theme") === "dark" ? "light" : "dark");
});

// ========== Mobile menu ==========
const navToggle = document.querySelector(".nav-toggle");
const navLinks = document.querySelector(".nav-links");

navToggle.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("open");
  navToggle.setAttribute("aria-expanded", String(isOpen));
});

navLinks.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("open");
    navToggle.setAttribute("aria-expanded", "false");
  });
});

// ========== Header border on scroll ==========
const header = document.querySelector(".site-header");
window.addEventListener("scroll", () => {
  header.classList.toggle("scrolled", window.scrollY > 10);
}, { passive: true });

// ========== Reveal sections + highlight active nav link ==========
const sections = document.querySelectorAll("main section[id]");
const navAnchors = document.querySelectorAll(".nav-links a");

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add("visible");
    navAnchors.forEach((a) => {
      a.classList.toggle("active", a.getAttribute("href") === `#${entry.target.id}`);
    });
  });
}, { threshold: 0.2 });

sections.forEach((section) => observer.observe(section));

// ========== Contact form (placeholder) ==========
// This form has no backend. To make it send real messages, connect it to a
// service like Formspree or Netlify Forms, or replace it with a mailto: link.
const form = document.getElementById("contact-form");
const formStatus = form.querySelector(".form-status");

form.addEventListener("submit", (event) => {
  event.preventDefault();
  formStatus.textContent = "Thanks! Your message has been noted (demo — no backend connected yet).";
  form.reset();
});

// ========== Footer year ==========
document.getElementById("year").textContent = new Date().getFullYear();
