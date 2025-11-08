/**
 * Main JavaScript for Almog Shtaigmann's Portfolio
 */

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
               class="popup-btn primary" target="_blank" rel="noopener">
              <i class="fab fa-whatsapp"></i>
              שלח הודעה 
            </a>
            <button class="popup-btn secondary" id="popupLater">
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

    function closePopup() {
      overlay.classList.remove("show");
      setTimeout(() => {
        overlay.remove();
      }, 300);
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
  initPopupAd();
});
