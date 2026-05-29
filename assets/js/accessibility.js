/**
 * Accessibility Widget (תפריט נגישות)
 * Self-contained, Hebrew RTL accessibility menu for the whole site.
 * Conforms to expectations of Israeli Standard IS 5568 (WCAG 2.0 AA).
 *
 * Loaded once per page (via main.js) and works at any directory depth.
 * All user choices persist in localStorage under a single namespaced key.
 */
(function () {
  "use strict";

  if (window.__a11yWidgetLoaded) return;
  window.__a11yWidgetLoaded = true;

  var STORAGE_KEY = "a11y_prefs";
  var MIN_FONT = 90;
  var MAX_FONT = 160;
  var FONT_STEP = 10;

  var DEFAULT_PREFS = {
    fontScale: 100,
    highContrast: false,
    invert: false,
    grayscale: false,
    readableFont: false,
    highlightLinks: false,
    spacing: false,
    stopAnimations: false,
    bigCursor: false,
  };

  /**
   * Resolve the base path of this script so links (e.g. the statement page)
   * work at any directory depth on GitHub Pages.
   */
  function getBaseDir() {
    var src = (document.currentScript && document.currentScript.src) || "";
    if (!src) {
      var scripts = document.getElementsByTagName("script");
      for (var i = 0; i < scripts.length; i++) {
        if (/accessibility\.js(\?|$)/.test(scripts[i].src)) {
          src = scripts[i].src;
          break;
        }
      }
    }
    // src points at <base>/assets/js/accessibility.js -> strip 3 segments
    var marker = "/assets/js/";
    var idx = src.indexOf(marker);
    if (idx !== -1) {
      return src.substring(0, idx + 1); // includes trailing slash
    }
    return "/";
  }

  var BASE_DIR = getBaseDir();
  var STATEMENT_URL = BASE_DIR + "pages/accessibility-statement/index.html";

  /* ----------------------------- Preferences ----------------------------- */

  function loadPrefs() {
    var prefs = {};
    for (var k in DEFAULT_PREFS) prefs[k] = DEFAULT_PREFS[k];
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        var saved = JSON.parse(raw);
        for (var key in saved) {
          if (key in prefs) prefs[key] = saved[key];
        }
      }
    } catch (e) {
      /* ignore corrupt storage */
    }
    return prefs;
  }

  function savePrefs(prefs) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
    } catch (e) {
      /* storage may be unavailable */
    }
  }

  var prefs = loadPrefs();

  /* ----------------------------- Apply state ----------------------------- */

  function applyPrefs() {
    var root = document.documentElement;
    root.style.setProperty("--a11y-font-scale", prefs.fontScale + "%");
    applyFontScale(prefs.fontScale);

    toggleClass(root, "a11y-high-contrast", prefs.highContrast);
    toggleClass(root, "a11y-invert", prefs.invert);
    toggleClass(root, "a11y-grayscale", prefs.grayscale);
    toggleClass(root, "a11y-readable-font", prefs.readableFont);
    toggleClass(root, "a11y-highlight-links", prefs.highlightLinks);
    toggleClass(root, "a11y-spacing", prefs.spacing);
    toggleClass(root, "a11y-stop-animations", prefs.stopAnimations);
    toggleClass(root, "a11y-big-cursor", prefs.bigCursor);
  }

  /**
   * Reliable per-element font scaling.
   * Each text element's *original* computed size (in px) is measured once and
   * stored; the displayed size is then base * scale/100. This preserves the
   * natural type hierarchy and avoids the cascade/compounding problems of
   * em-based scaling.
   */
  var FONT_SELECTOR =
    "p,li,span,a,h1,h2,h3,h4,h5,h6,td,th,label,button,input,textarea,select,blockquote,figcaption,dd,dt,strong,em,small,b,abbr,cite,code,th,caption";

  function applyFontScale(scale) {
    var body = document.body;
    if (!body) return;

    var nodes = body.querySelectorAll(FONT_SELECTOR);
    for (var i = 0; i < nodes.length; i++) {
      var el = nodes[i];

      // Never scale the widget's own UI.
      if (el.closest("#a11y-panel,#a11y-toggle,#a11y-backdrop")) continue;

      // Measure and cache the original size once (from natural state).
      var base = parseFloat(el.getAttribute("data-a11y-base-font"));
      if (isNaN(base)) {
        base = parseFloat(window.getComputedStyle(el).fontSize);
        if (isNaN(base) || base <= 0) continue;
        el.setAttribute("data-a11y-base-font", base);
      }

      if (scale === 100) {
        el.style.removeProperty("font-size");
      } else {
        el.style.setProperty(
          "font-size",
          (base * scale) / 100 + "px",
          "important"
        );
      }
    }
  }

  function toggleClass(el, cls, on) {
    if (on) el.classList.add(cls);
    else el.classList.remove(cls);
  }

  /* ------------------------------- Styles -------------------------------- */

  var STYLE_TEXT = [
    ":root{--a11y-font-scale:100%;--a11y-accent:#8b5cf6;}",

    /* High contrast */
    "html.a11y-high-contrast body{background:#000 !important;color:#fff !important;}",
    "html.a11y-high-contrast body :is(p,li,span,h1,h2,h3,h4,h5,h6,td,th,label,blockquote,figcaption,dd,dt,strong,em){color:#fff !important;}",
    "html.a11y-high-contrast body :is(section,header,footer,main,article,aside,div,nav){background-color:transparent !important;border-color:#fff !important;}",
    "html.a11y-high-contrast body a{color:#ffff00 !important;}",
    "html.a11y-high-contrast body :is(button,input,textarea,select){background:#000 !important;color:#fff !important;border:1px solid #fff !important;}",
    "html.a11y-high-contrast #a11y-panel,html.a11y-high-contrast #a11y-toggle{filter:none !important;}",

    /* Invert / negative colors */
    "html.a11y-invert{background:#fff;}",
    "html.a11y-invert body{filter:invert(100%) hue-rotate(180deg) !important;}",
    "html.a11y-invert body img,html.a11y-invert body video,html.a11y-invert body i,html.a11y-invert body .fab,html.a11y-invert body .fas{filter:invert(100%) hue-rotate(180deg) !important;}",
    /* keep the widget readable when inverted */
    "html.a11y-invert #a11y-panel,html.a11y-invert #a11y-toggle{filter:invert(100%) hue-rotate(180deg) !important;}",

    /* Grayscale */
    "html.a11y-grayscale body{filter:grayscale(100%) !important;}",
    "html.a11y-grayscale #a11y-panel,html.a11y-grayscale #a11y-toggle{filter:none !important;}",

    /* Readable font */
    "html.a11y-readable-font body :is(p,li,span,a,h1,h2,h3,h4,h5,h6,td,th,label,button,input,textarea,blockquote,figcaption,dd,dt){",
    "font-family:Arial,'Segoe UI',Tahoma,sans-serif !important;letter-spacing:.3px !important;}",

    /* Highlight links */
    "html.a11y-highlight-links body a{text-decoration:underline !important;outline:2px solid #ffbf00 !important;outline-offset:2px;background:rgba(255,191,0,.18) !important;}",

    /* Increased spacing */
    "html.a11y-spacing body :is(p,li,span,a,h1,h2,h3,h4,h5,h6,td,th,label,blockquote,dd,dt){",
    "line-height:2 !important;letter-spacing:1.5px !important;word-spacing:3px !important;}",
    "html.a11y-spacing #a11y-panel *{line-height:normal !important;letter-spacing:normal !important;word-spacing:normal !important;}",

    /* Stop animations */
    "html.a11y-stop-animations *,html.a11y-stop-animations *::before,html.a11y-stop-animations *::after{",
    "animation:none !important;transition:none !important;scroll-behavior:auto !important;}",
    "html.a11y-stop-animations .animate-on-scroll{opacity:1 !important;transform:none !important;}",

    /* Big cursor */
    "html.a11y-big-cursor,html.a11y-big-cursor *{cursor:url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='48' height='48' viewBox='0 0 24 24'%3E%3Cpath fill='%23000' stroke='%23fff' stroke-width='1' d='M5 2l14 11-6 1 4 8-3 1-4-8-5 4z'/%3E%3C/svg%3E\") 4 4,auto !important;}",

    /* ---- Toggle button ---- */
    "#a11y-toggle{position:fixed;bottom:165px;left:20px;z-index:99998;width:54px;height:54px;border-radius:50%;",
    "border:none;background:var(--a11y-accent);color:#fff;font-size:26px;line-height:1;cursor:pointer;",
    "box-shadow:0 4px 14px rgba(0,0,0,.35);display:flex;align-items:center;justify-content:center;",
    "transition:transform .2s ease,box-shadow .2s ease;}",
    "#a11y-toggle:hover{transform:scale(1.08);box-shadow:0 6px 20px rgba(0,0,0,.45);}",
    "#a11y-toggle:focus-visible{outline:3px solid #ffbf00;outline-offset:3px;}",

    /* ---- Panel ---- */
    "#a11y-panel{position:fixed;top:0;right:0;height:100%;width:330px;max-width:90vw;z-index:99999;",
    "background:#1b1b22;color:#f3f3f7;direction:rtl;text-align:right;font-family:Arial,'Segoe UI',Tahoma,sans-serif;",
    "box-shadow:-4px 0 24px rgba(0,0,0,.5);transform:translateX(100%);transition:transform .28s ease;",
    "overflow-y:auto;padding:0 0 24px;}",
    "#a11y-panel.open{transform:translateX(0);}",
    "#a11y-panel header{position:sticky;top:0;background:var(--a11y-accent);color:#fff;padding:16px 18px;",
    "display:flex;align-items:center;justify-content:space-between;}",
    "#a11y-panel header h2{margin:0;font-size:19px;font-weight:700;}",
    "#a11y-close{background:transparent;border:none;color:#fff;font-size:26px;line-height:1;cursor:pointer;padding:4px 8px;border-radius:6px;}",
    "#a11y-close:hover{background:rgba(255,255,255,.2);}",
    "#a11y-close:focus-visible{outline:3px solid #ffbf00;outline-offset:2px;}",

    "#a11y-panel .a11y-section{padding:14px 18px 4px;}",
    "#a11y-panel .a11y-section-title{font-size:13px;opacity:.7;margin:0 0 8px;font-weight:700;}",

    "#a11y-panel .a11y-fontrow{display:flex;align-items:center;gap:8px;}",
    "#a11y-panel .a11y-fontrow button{flex:1;}",
    "#a11y-panel .a11y-fontval{min-width:54px;text-align:center;font-weight:700;}",

    "#a11y-panel button.a11y-opt{display:flex;align-items:center;gap:10px;width:100%;text-align:right;",
    "background:#26262f;color:#f3f3f7;border:1px solid #3a3a45;border-radius:10px;padding:11px 13px;",
    "margin:7px 0;font-size:15px;cursor:pointer;font-family:inherit;transition:background .15s ease,border-color .15s ease;}",
    "#a11y-panel button.a11y-opt:hover{background:#32323d;}",
    "#a11y-panel button.a11y-opt:focus-visible{outline:3px solid #ffbf00;outline-offset:2px;}",
    "#a11y-panel button.a11y-opt[aria-pressed='true']{background:var(--a11y-accent);border-color:var(--a11y-accent);color:#fff;}",
    "#a11y-panel button.a11y-opt .a11y-ico{font-size:18px;width:22px;text-align:center;flex:0 0 auto;}",
    "#a11y-panel button.a11y-opt .a11y-lbl{flex:1;}",
    "#a11y-panel button.a11y-opt .a11y-state{font-size:12px;opacity:.85;}",

    "#a11y-panel .a11y-reset{background:#b91c1c;border-color:#b91c1c;color:#fff;justify-content:center;font-weight:700;}",
    "#a11y-panel .a11y-reset:hover{background:#dc2626;}",

    "#a11y-panel .a11y-statement{display:block;text-align:center;margin:10px 18px 0;padding:11px;",
    "background:#26262f;border:1px solid #3a3a45;border-radius:10px;color:#cbb6ff;text-decoration:none;font-size:14px;}",
    "#a11y-panel .a11y-statement:hover{background:#32323d;text-decoration:underline;}",
    "#a11y-panel .a11y-note{font-size:11px;opacity:.55;padding:12px 18px 0;line-height:1.5;}",

    /* Backdrop */
    "#a11y-backdrop{position:fixed;inset:0;background:rgba(0,0,0,.45);z-index:99997;opacity:0;",
    "visibility:hidden;transition:opacity .25s ease,visibility .25s ease;}",
    "#a11y-backdrop.open{opacity:1;visibility:visible;}",

    /* Strong focus indicator site-wide while panel exists */
    "a:focus-visible,button:focus-visible,input:focus-visible,textarea:focus-visible,select:focus-visible,[tabindex]:focus-visible{outline:3px solid #ffbf00 !important;outline-offset:2px;}",

    /* Responsive */
    "@media(max-width:480px){#a11y-toggle{bottom:140px;left:14px;width:50px;height:50px;font-size:24px;}}",
  ].join("\n");

  function injectStyles() {
    var style = document.createElement("style");
    style.id = "a11y-styles";
    style.appendChild(document.createTextNode(STYLE_TEXT));
    (document.head || document.documentElement).appendChild(style);
  }

  /* ------------------------------- Markup -------------------------------- */

  // Boolean feature options [prefKey, icon, label]
  var OPTIONS = [
    ["highContrast", "◐", "ניגודיות גבוהה"],
    ["invert", "🌗", "היפוך צבעים"],
    ["grayscale", "⬛", "גווני אפור"],
    ["readableFont", "🔤", "גופן קריא"],
    ["highlightLinks", "🔗", "הדגשת קישורים"],
    ["spacing", "↔", "ריווח מוגדל"],
    ["stopAnimations", "⏸", "עצירת אנימציות"],
    ["bigCursor", "🖱", "סמן עכבר גדול"],
  ];

  var toggleBtn, panel, backdrop, fontValueEl;

  function buildUI() {
    // Toggle button
    toggleBtn = document.createElement("button");
    toggleBtn.id = "a11y-toggle";
    toggleBtn.type = "button";
    toggleBtn.setAttribute("aria-label", "פתיחת תפריט נגישות");
    toggleBtn.setAttribute("aria-haspopup", "dialog");
    toggleBtn.setAttribute("aria-expanded", "false");
    toggleBtn.innerHTML = "<span aria-hidden=\"true\">♿</span>";
    toggleBtn.addEventListener("click", openPanel);

    // Backdrop
    backdrop = document.createElement("div");
    backdrop.id = "a11y-backdrop";
    backdrop.addEventListener("click", closePanel);

    // Panel
    panel = document.createElement("div");
    panel.id = "a11y-panel";
    panel.setAttribute("role", "dialog");
    panel.setAttribute("aria-modal", "true");
    panel.setAttribute("aria-label", "תפריט נגישות");
    panel.setAttribute("aria-hidden", "true");

    var html = "";
    html +=
      '<header><h2>תפריט נגישות</h2>' +
      '<button id="a11y-close" type="button" aria-label="סגירת תפריט נגישות">×</button></header>';

    // Font size section
    html += '<div class="a11y-section">';
    html += '<p class="a11y-section-title">גודל טקסט</p>';
    html += '<div class="a11y-fontrow">';
    html +=
      '<button class="a11y-opt" type="button" data-action="font-dec" aria-label="הקטנת טקסט">א-</button>';
    html += '<span class="a11y-fontval" id="a11y-fontval" aria-live="polite">100%</span>';
    html +=
      '<button class="a11y-opt" type="button" data-action="font-inc" aria-label="הגדלת טקסט">א+</button>';
    html += "</div></div>";

    // Display options
    html += '<div class="a11y-section">';
    html += '<p class="a11y-section-title">תצוגה</p>';
    for (var i = 0; i < OPTIONS.length; i++) {
      var key = OPTIONS[i][0];
      var ico = OPTIONS[i][1];
      var lbl = OPTIONS[i][2];
      html +=
        '<button class="a11y-opt" type="button" data-toggle="' +
        key +
        '" aria-pressed="false">' +
        '<span class="a11y-ico" aria-hidden="true">' +
        ico +
        "</span>" +
        '<span class="a11y-lbl">' +
        lbl +
        "</span>" +
        '<span class="a11y-state" aria-hidden="true"></span>' +
        "</button>";
    }
    html += "</div>";

    // Reset + statement
    html += '<div class="a11y-section">';
    html +=
      '<button class="a11y-opt a11y-reset" type="button" data-action="reset">איפוס הגדרות נגישות</button>';
    html += "</div>";
    html +=
      '<a class="a11y-statement" href="' +
      STATEMENT_URL +
      '">הצהרת נגישות</a>';
    html +=
      '<p class="a11y-note">האתר שואף לעמוד בתקן הישראלי ת"י 5568 (WCAG 2.0 ברמה AA). נתקלתם בבעיית נגישות? נשמח לשמוע.</p>';

    panel.innerHTML = html;

    document.body.appendChild(backdrop);
    document.body.appendChild(panel);
    document.body.appendChild(toggleBtn);

    fontValueEl = panel.querySelector("#a11y-fontval");

    // Wire controls
    panel.querySelector("#a11y-close").addEventListener("click", closePanel);
    panel.addEventListener("click", onPanelClick);
    panel.addEventListener("keydown", onPanelKeydown);

    syncUI();
  }

  function onPanelClick(e) {
    var btn = e.target.closest("button");
    if (!btn) return;

    var toggleKey = btn.getAttribute("data-toggle");
    if (toggleKey) {
      prefs[toggleKey] = !prefs[toggleKey];
      commit();
      return;
    }

    var action = btn.getAttribute("data-action");
    if (action === "font-inc") {
      prefs.fontScale = Math.min(MAX_FONT, prefs.fontScale + FONT_STEP);
      commit();
    } else if (action === "font-dec") {
      prefs.fontScale = Math.max(MIN_FONT, prefs.fontScale - FONT_STEP);
      commit();
    } else if (action === "reset") {
      for (var k in DEFAULT_PREFS) prefs[k] = DEFAULT_PREFS[k];
      commit();
    }
  }

  function commit() {
    savePrefs(prefs);
    applyPrefs();
    syncUI();
  }

  function syncUI() {
    if (fontValueEl) fontValueEl.textContent = prefs.fontScale + "%";
    var btns = panel.querySelectorAll("button[data-toggle]");
    for (var i = 0; i < btns.length; i++) {
      var key = btns[i].getAttribute("data-toggle");
      var on = !!prefs[key];
      btns[i].setAttribute("aria-pressed", on ? "true" : "false");
      var state = btns[i].querySelector(".a11y-state");
      if (state) state.textContent = on ? "פעיל" : "";
    }
  }

  /* --------------------------- Open / close ------------------------------ */

  var lastFocused = null;

  function openPanel() {
    lastFocused = document.activeElement;
    panel.classList.add("open");
    backdrop.classList.add("open");
    panel.setAttribute("aria-hidden", "false");
    toggleBtn.setAttribute("aria-expanded", "true");
    var closeBtn = panel.querySelector("#a11y-close");
    if (closeBtn) closeBtn.focus();
    document.addEventListener("keydown", onGlobalKeydown);
  }

  function closePanel() {
    panel.classList.remove("open");
    backdrop.classList.remove("open");
    panel.setAttribute("aria-hidden", "true");
    toggleBtn.setAttribute("aria-expanded", "false");
    document.removeEventListener("keydown", onGlobalKeydown);
    if (lastFocused && typeof lastFocused.focus === "function") {
      lastFocused.focus();
    } else {
      toggleBtn.focus();
    }
  }

  function onGlobalKeydown(e) {
    if (e.key === "Escape") {
      e.preventDefault();
      closePanel();
    }
  }

  // Focus trap inside the panel
  function onPanelKeydown(e) {
    if (e.key !== "Tab") return;
    var focusable = panel.querySelectorAll(
      'button, a[href], input, [tabindex]:not([tabindex="-1"])'
    );
    if (!focusable.length) return;
    var first = focusable[0];
    var last = focusable[focusable.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }

  /* ------------------------------- Init ---------------------------------- */

  function init() {
    injectStyles();
    applyPrefs(); // apply saved visual state ASAP
    buildUI();
  }

  // Apply saved state on <html> as early as possible to reduce flash.
  applyPrefs();

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
