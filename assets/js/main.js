/**
 * Main JavaScript for Almog Shtaigmann's Portfolio
 */

/**
 * UTM Parameter Tracking
 * Captures and stores UTM parameters for Google Analytics
 */
function initUTMTracking() {
  const urlParams = new URLSearchParams(window.location.search);
  const utmParams = {
    source: urlParams.get("source") || urlParams.get("utm_source"),
    medium: urlParams.get("medium") || urlParams.get("utm_medium"),
    campaign: urlParams.get("campaign") || urlParams.get("utm_campaign"),
    term: urlParams.get("term") || urlParams.get("utm_term"),
    content: urlParams.get("content") || urlParams.get("utm_content"),
  };

  // Store UTM parameters in sessionStorage for tracking across pages
  const hasUTMParams = Object.values(utmParams).some((value) => value !== null);

  if (hasUTMParams) {
    sessionStorage.setItem("utm_params", JSON.stringify(utmParams));

    // Send to Google Analytics
    if (typeof gtag !== "undefined") {
      // Send custom event for tracking (appears in Events section)
      gtag("event", "utm_capture", {
        event_category: "UTM Tracking",
        event_label: `Source: ${utmParams.source || "direct"}`,
        // Custom parameters (useful for reports and explorations)
        campaign_source: utmParams.source,
        campaign_medium: utmParams.medium,
        campaign_name: utmParams.campaign,
        campaign_term: utmParams.term,
        campaign_content: utmParams.content,
      });
    }
  } else {
    // Check if we have stored UTMs from previous page
    const storedParams = sessionStorage.getItem("utm_params");
    if (storedParams) {
      console.log(
        "📌 Using stored UTM parameters from earlier in session:",
        JSON.parse(storedParams)
      );
    }
  }

  return utmParams;
}

/**
 * Get stored UTM parameters
 */
function getUTMParams() {
  try {
    const stored = sessionStorage.getItem("utm_params");
    return stored ? JSON.parse(stored) : null;
  } catch (e) {
    return null;
  }
}

/**
 * Track event with UTM parameters
 */
function trackEventWithUTM(
  eventName,
  eventCategory,
  eventLabel,
  additionalParams = {}
) {
  if (typeof gtag !== "undefined") {
    const utmParams = getUTMParams();

    gtag("event", eventName, {
      event_category: eventCategory,
      event_label: eventLabel,
      // Add UTM context as custom parameters (if available)
      ...(utmParams && {
        campaign_source: utmParams.source,
        campaign_medium: utmParams.medium,
        campaign_name: utmParams.campaign,
      }),
      ...additionalParams,
    });
  }
}

// Initialize UTM tracking on page load
const currentUTMParams = initUTMTracking();

document.addEventListener("DOMContentLoaded", () => {
  // Mobile menu toggle
  const menuToggle = document.querySelector(".menu-toggle");
  const navMain = document.querySelector(".nav-main");

  if (menuToggle && navMain) {
    menuToggle.addEventListener("click", () => {
      navMain.classList.toggle("collapsed");

      // Change aria-expanded attribute for accessibility
      const isExpanded = navMain.classList.contains("collapsed")
        ? "false"
        : "true";
      menuToggle.setAttribute("aria-expanded", isExpanded);
    });
  }

  // Smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();

      const targetId = this.getAttribute("href");

      if (targetId === "#") return;

      const targetElement = document.querySelector(targetId);

      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });

        // Update URL without page reload
        history.pushState(null, null, targetId);
      }
    });
  });

  // Expandable sections (like FAQ accordions)
  const expandableTriggers = document.querySelectorAll(".expandable-trigger");

  expandableTriggers.forEach((trigger) => {
    trigger.addEventListener("click", () => {
      const target = document.querySelector(
        trigger.getAttribute("data-target")
      );

      if (target) {
        target.classList.toggle("active");

        // Update aria-expanded for accessibility
        const isExpanded = target.classList.contains("active")
          ? "true"
          : "false";
        trigger.setAttribute("aria-expanded", isExpanded);
      }
    });
  });

  // Form validation
  const contactForm = document.querySelector(".contact-form");

  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      let isValid = true;
      const requiredFields = contactForm.querySelectorAll("[required]");

      requiredFields.forEach((field) => {
        if (!field.value.trim()) {
          isValid = false;
          field.classList.add("error");

          // Add error message if it doesn't exist
          const errorMsgId = `${field.id}-error`;
          let errorMsg = document.getElementById(errorMsgId);

          if (!errorMsg) {
            errorMsg = document.createElement("span");
            errorMsg.id = errorMsgId;
            errorMsg.className = "error-message";
            errorMsg.textContent = "This field is required";
            field.parentNode.appendChild(errorMsg);
          }
        } else {
          field.classList.remove("error");
          const errorMsg = document.getElementById(`${field.id}-error`);
          if (errorMsg) {
            errorMsg.remove();
          }
        }
      });

      if (!isValid) {
        e.preventDefault();
      }
    });
  }

  // Add animations when elements come into view
  const animatedElements = document.querySelectorAll(".animate-on-scroll");

  const animateOnScroll = () => {
    const triggerBottom = window.innerHeight * 0.8;

    animatedElements.forEach((element) => {
      const elementTop = element.getBoundingClientRect().top;

      if (elementTop < triggerBottom) {
        element.classList.add("animated");
      }
    });
  };

  // Run once on page load
  animateOnScroll();

  // Run on scroll
  window.addEventListener("scroll", animateOnScroll);

  // Setup dark mode toggle if present
  const darkModeToggle = document.querySelector(".dark-mode-toggle");

  if (darkModeToggle) {
    // Check for user preference
    const prefersDarkMode = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    const storedTheme = localStorage.getItem("theme");

    // Set initial state based on user preference or stored setting
    if (storedTheme === "dark" || (!storedTheme && prefersDarkMode)) {
      document.body.classList.add("dark-theme");
      darkModeToggle.checked = true;
    }

    darkModeToggle.addEventListener("change", () => {
      if (darkModeToggle.checked) {
        document.body.classList.add("dark-theme");
        localStorage.setItem("theme", "dark");
      } else {
        document.body.classList.remove("dark-theme");
        localStorage.setItem("theme", "light");
      }
    });
  }

  // WhatsApp Floating Button Setup
  function createWhatsAppButton() {
    // Check if WhatsApp button already exists
    if (document.querySelector(".whatsapp-fab")) return;

    const whatsappBtn = document.createElement("a");
    whatsappBtn.className = "whatsapp-fab";
    whatsappBtn.href =
      "https://wa.me/972586669888?text=היי%20אני%20אשמח%20לעזרה";
    whatsappBtn.target = "_blank";
    whatsappBtn.rel = "noopener";
    whatsappBtn.setAttribute("aria-label", "Contact via WhatsApp");

    // Add Google Analytics event tracking with UTM parameters
    whatsappBtn.addEventListener("click", function () {
      trackEventWithUTM(
        "click",
        "WhatsApp",
        "Floating Button - Personal Contact",
        { page_path: window.location.pathname }
      );
    });

    // Create icon
    const icon = document.createElement("i");
    icon.className = "fab fa-whatsapp";

    // Create tooltip
    const tooltip = document.createElement("span");
    tooltip.className = "tooltip";
    tooltip.textContent = "צריכים עזרה? שאלו אותנו!";

    whatsappBtn.appendChild(icon);
    whatsappBtn.appendChild(tooltip);

    document.body.appendChild(whatsappBtn);
  }

  // Popup Ad Management
  function initPopupAd() {
    const hasShownPopup = sessionStorage.getItem("popupShown");

    // Only show popup once per session
    if (hasShownPopup) return;

    // Wait 3 seconds before showing popup
    setTimeout(() => {
      showPopupAd();
      sessionStorage.setItem("popupShown", "true");
    }, 3000);
  }

  function createPopupAd() {
    const popupHTML = `
      <div class="popup-overlay" id="popupOverlay">
        <div class="popup-content">
          <button class="popup-close" id="popupClose" aria-label="Close popup">×</button>
          
          <div class="popup-header">
            <h2 class="popup-title">צריכים עזרה?</h2>
            <p class="popup-subtitle">בואו נדבר!</p>
          </div>
          
          <div class="popup-description">
            <p>צריכים שיעור פרטי?</p>
            <p>צריכים עזרה במציאת עבודה?</p>
            <p>או סתם להתייעץ?</p>
            <p><strong>עזרתי כבר למאות סטודנטים!</strong></p>
            <br>
            <p>שלחו הודעה ונדבר :)</p>
          </div>
          
          <div class="popup-actions">
            <a href="https://wa.me/972586669888?text=שלום%2C%20אני%20מעוניין%20לשמוע%20עליך%20ועל%20איך%20אתה%20יכול%20לעזור%20לי" 
               class="popup-btn popup-btn-primary" 
               id="popupWhatsAppBtn"
               target="_blank" rel="noopener">
              <i class="fab fa-whatsapp"></i>
              שלח הודעה 
            </a>
            <button class="popup-btn popup-btn-secondary" id="popupLater">
              אולי מאוחר יותר
            </button>
          </div>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML("beforeend", popupHTML);

    // Add event listeners
    const overlay = document.getElementById("popupOverlay");
    const closeBtn = document.getElementById("popupClose");
    const laterBtn = document.getElementById("popupLater");
    const whatsappPopupBtn = document.getElementById("popupWhatsAppBtn");

    function closePopup() {
      overlay.classList.remove("show");
      setTimeout(() => {
        overlay.remove();
      }, 300);
    }

    // Track WhatsApp popup button click with UTM parameters
    if (whatsappPopupBtn) {
      whatsappPopupBtn.addEventListener("click", function () {
        trackEventWithUTM("click", "WhatsApp", "Popup Ad - Contact Request", {
          page_path: window.location.pathname,
        });
      });
    }

    closeBtn.addEventListener("click", closePopup);
    laterBtn.addEventListener("click", closePopup);

    // Close on overlay click
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) {
        closePopup();
      }
    });

    // Close on escape key
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && overlay.classList.contains("show")) {
        closePopup();
      }
    });
  }

  function showPopupAd() {
    createPopupAd();

    // Small delay to ensure DOM is ready
    setTimeout(() => {
      const overlay = document.getElementById("popupOverlay");
      if (overlay) {
        overlay.classList.add("show");
      }
    }, 100);
  }

  // Initialize all features
  createWhatsAppButton();
  if (!document.body.classList.contains("site-2026")) {
    initPopupAd();
  }
});

// ============================================
// Workshop Page Analytics Tracking
// ============================================

/**
 * Track workshop guide page navigation
 * @param {string} guideName - Name of the guide being accessed
 * @param {string} targetUrl - URL to navigate to
 */
window.trackWorkshopNavigation = function (guideName, targetUrl) {
  // Track the card click with UTM parameters
  trackEventWithUTM("click", "Workshop Navigation", guideName, {
    page_path: window.location.pathname,
    destination_url: targetUrl,
  });

  // Navigate after a brief delay to ensure tracking is sent
  setTimeout(function () {
    location.href = targetUrl;
  }, 100);
};

/**
 * Track "Back to Workshop" button clicks from guide pages
 * @param {string} currentPage - Current guide page name
 */
window.trackBackToWorkshop = function (currentPage) {
  trackEventWithUTM("click", "Workshop Navigation", "Back to Workshop Index", {
    page_path: window.location.pathname,
    source_page: currentPage,
  });

  // Navigate after a brief delay
  setTimeout(function () {
    location.href = "../index.html";
  }, 100);
};

/**
 * Track interactions within workshop guide pages
 * @param {string} action - The action being performed (e.g., "Download", "View Code", "Copy Code")
 * @param {string} element - The element being interacted with
 */
window.trackWorkshopInteraction = function (action, element) {
  trackEventWithUTM(
    action.toLowerCase().replace(/\s+/g, "_"),
    "Workshop Interaction",
    element,
    { page_path: window.location.pathname }
  );
};

/**
 * Track page view on workshop guide pages
 * Call this from each guide page to track views
 * @param {string} guideName - Name of the guide
 */
window.trackWorkshopPageView = function (guideName) {
  const utmParams = getUTMParams();

  if (typeof gtag !== "undefined") {
    gtag("event", "page_view", {
      page_title: guideName,
      page_path: window.location.pathname,
      page_location: window.location.href,
      content_group: "Database Workshop",
      ...(utmParams && {
        utm_source: utmParams.source,
        utm_medium: utmParams.medium,
        utm_campaign: utmParams.campaign,
      }),
    });
  }
};

// ============================================
// Accessibility Widget Loader (תפריט נגישות)
// Loads the site-wide accessibility menu on every page.
// Path is resolved from this script's own src so it works at any depth.
// ============================================
(function loadAccessibilityWidget() {
  function resolveScriptBase() {
    const current =
      document.currentScript ||
      Array.prototype.slice
        .call(document.getElementsByTagName("script"))
        .filter((s) => /\/main\.js(\?|$)/.test(s.src))[0];

    const src = (current && current.src) || "";
    const marker = "/main.js";
    const idx = src.indexOf(marker);
    return idx !== -1 ? src.substring(0, idx + 1) : "assets/js/";
  }

  if (window.__a11yWidgetLoaded || document.getElementById("a11y-widget-script")) {
    return;
  }

  const script = document.createElement("script");
  script.id = "a11y-widget-script";
  script.src = resolveScriptBase() + "accessibility.js";
  script.defer = true;
  (document.head || document.documentElement).appendChild(script);
})();
