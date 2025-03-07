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
});
