/**
 * theme.js — Light/Dark theme toggle + localStorage persistence
 * Also handles: Bulma mobile burger menu + reading progress bar (post page)
 */

(function () {
  // ─── Theme Initialization ────────────────────────────────────────────────────
  // Apply theme before page paints to prevent FOUC (Flash of Unstyled Content)
  const saved = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const initialTheme = saved || (prefersDark ? 'dark' : 'light');
  document.documentElement.setAttribute('data-theme', initialTheme);

  // ─── DOM Ready ───────────────────────────────────────────────────────────────
  document.addEventListener('DOMContentLoaded', function () {

    // ── Theme Toggle ──────────────────────────────────────────────────────────
    const toggleBtn = document.getElementById('theme-toggle');
    if (toggleBtn) {
      updateToggleIcon(document.documentElement.getAttribute('data-theme'));
      toggleBtn.addEventListener('click', toggleTheme);
    }

    // ── Bulma Burger Menu ─────────────────────────────────────────────────────
    const burgers = document.querySelectorAll('.navbar-burger');
    burgers.forEach(function (burger) {
      burger.addEventListener('click', function () {
        const targetId = burger.dataset.target;
        const target = document.getElementById(targetId);
        burger.classList.toggle('is-active');
        if (target) target.classList.toggle('is-active');
      });
    });

    // ── Reading Progress Bar (post.html only) ─────────────────────────────────
    const progressBar = document.getElementById('reading-progress');
    if (progressBar) {
      window.addEventListener('scroll', updateReadingProgress);
      updateReadingProgress(); // set initial state
    }

    // ── Navbar scroll shadow ──────────────────────────────────────────────────
    const navbar = document.querySelector('.site-navbar');
    if (navbar) {
      window.addEventListener('scroll', function () {
        navbar.classList.toggle('is-scrolled', window.scrollY > 10);
      });
    }

  });

  // ─── Functions ───────────────────────────────────────────────────────────────

  function toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
    updateToggleIcon(next);
  }

  function updateToggleIcon(theme) {
    const btn = document.getElementById('theme-toggle');
    if (!btn) return;
    const isDark = theme === 'dark';
    btn.innerHTML = isDark
      ? '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>'
      : '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';
    btn.setAttribute('aria-label', `Switch to ${isDark ? 'light' : 'dark'} mode`);
    btn.setAttribute('title', `Switch to ${isDark ? 'light' : 'dark'} mode`);
  }

  function updateReadingProgress() {
    const progressBar = document.getElementById('reading-progress');
    if (!progressBar) return;
    const article = document.querySelector('.article-body');
    if (!article) return;

    const articleTop = article.offsetTop;
    const articleHeight = article.offsetHeight;
    const windowHeight = window.innerHeight;
    const scrollY = window.scrollY;

    const start = articleTop - windowHeight * 0.2;
    const end = articleTop + articleHeight - windowHeight * 0.8;
    const progress = Math.min(Math.max((scrollY - start) / (end - start), 0), 1);

    progressBar.style.width = (progress * 100) + '%';
  }

})();
