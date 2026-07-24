const siteAssetsBase = document.currentScript?.src
  ? new URL("../", document.currentScript.src)
  : new URL("./assets/", document.baseURI);

document.addEventListener("DOMContentLoaded", () => {
  const storageKey = "almog-site-theme";
  const themeHost = document.querySelector(
    ".site-header__inner, .header-container"
  );
  let themeButton = document.querySelector("[data-theme-toggle]");

  if (!themeButton && themeHost) {
    themeButton = document.createElement("button");
    themeButton.type = "button";
    themeButton.className = "theme-toggle";
    themeButton.setAttribute("data-theme-toggle", "");
    themeButton.innerHTML =
      '<span class="theme-toggle__icon" aria-hidden="true"></span>' +
      '<span class="theme-toggle__label"></span>';

    const navigation = themeHost.querySelector("nav");
    themeHost.insertBefore(themeButton, navigation || null);
  }

  const updateThemeControl = () => {
    if (!themeButton) return;
    const isDark = document.documentElement.dataset.theme === "dark";
    const nextTheme = isDark ? "light" : "dark";
    const isHebrew = document.documentElement.lang.toLowerCase().startsWith("he");
    const accessibleLabel = isHebrew
      ? isDark
        ? "מעבר לערכת נושא בהירה"
        : "מעבר לערכת נושא כהה"
      : `Switch to ${nextTheme} theme`;
    themeButton.setAttribute("aria-label", accessibleLabel);
    themeButton.setAttribute("title", accessibleLabel);
    themeButton.querySelector(".theme-toggle__icon").textContent = isDark
      ? "☀"
      : "☾";
    themeButton.querySelector(".theme-toggle__label").textContent = isHebrew
      ? isDark
        ? "בהיר"
        : "כהה"
      : isDark
        ? "Light"
        : "Dark";
  };

  if (themeButton) {
    updateThemeControl();
    themeButton.addEventListener("click", () => {
      const nextTheme =
        document.documentElement.dataset.theme === "dark" ? "light" : "dark";
      document.documentElement.dataset.theme = nextTheme;
      try {
        localStorage.setItem(storageKey, nextTheme);
      } catch (_error) {
        // The selected theme still applies for the current page view.
      }
      updateThemeControl();
    });
  }

  const menuButton = document.querySelector("[data-site-menu-button]");
  const navigation = document.querySelector("[data-site-navigation]");

  if (menuButton && navigation) {
    const closeNavigation = () => {
      navigation.classList.remove("is-open");
      menuButton.setAttribute("aria-expanded", "false");
    };

    menuButton.addEventListener("click", () => {
      const isOpen = navigation.classList.toggle("is-open");
      menuButton.setAttribute("aria-expanded", String(isOpen));
    });

    navigation.addEventListener("click", (event) => {
      if (event.target.closest("a")) closeNavigation();
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeNavigation();
    });
  }

  document.querySelectorAll("[data-current-year], #current-year").forEach((element) => {
    element.textContent = String(new Date().getFullYear());
  });

  const popupSessionKey = "almog-session-popup-shown";
  const hasShownSessionPopup = () => {
    try {
      return sessionStorage.getItem(popupSessionKey) === "true";
    } catch (_error) {
      return false;
    }
  };

  const markSessionPopupShown = () => {
    try {
      sessionStorage.setItem(popupSessionKey, "true");
    } catch (_error) {
      // The popup still works when session storage is unavailable.
    }
  };

  const showSessionPopup = () => {
    if (hasShownSessionPopup() || document.querySelector("[data-session-popup]")) {
      return;
    }

    const previouslyFocused = document.activeElement;
    const overlay = document.createElement("div");
    overlay.className = "session-popup";
    overlay.dataset.sessionPopup = "";
    overlay.innerHTML = `
      <section
        class="session-popup__dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="session-popup-title"
        aria-describedby="session-popup-description"
        dir="rtl"
        lang="he"
      >
        <button
          class="session-popup__close"
          type="button"
          aria-label="סגירת החלון"
          data-session-popup-close
        >×</button>
        <p class="session-popup__eyebrow">אפשר לעזור?</p>
        <h2 id="session-popup-title">צריכים הכוונה בדרך?</h2>
        <div id="session-popup-description" class="session-popup__description">
          <p>שיעור פרטי, הכנה למציאת עבודה ראשונה או שאלה מקצועית - אפשר לדבר איתי ישירות.</p>
          <p><strong>כבר עזרתי למאות סטודנטים ובוגרים.</strong></p>
        </div>
        <div class="session-popup__actions">
          <a
            class="session-popup__primary"
            href="https://wa.me/972586669888?text=%D7%A9%D7%9C%D7%95%D7%9D%2C%20%D7%90%D7%A0%D7%99%20%D7%90%D7%A9%D7%9E%D7%97%20%D7%9C%D7%A2%D7%96%D7%A8%D7%94"
            target="_blank"
            rel="noopener noreferrer"
          >
            <span aria-hidden="true">↗</span>
            שליחת הודעה ב-WhatsApp
          </a>
          <button
            class="session-popup__secondary"
            type="button"
            data-session-popup-close
          >אולי מאוחר יותר</button>
        </div>
      </section>`;

    const dialog = overlay.querySelector(".session-popup__dialog");
    const closeButtons = overlay.querySelectorAll("[data-session-popup-close]");
    const focusable = Array.from(
      overlay.querySelectorAll("a[href], button:not([disabled])")
    );
    let isClosing = false;

    const closePopup = () => {
      if (isClosing) return;
      isClosing = true;
      overlay.classList.remove("is-visible");
      document.body.classList.remove("has-session-popup");
      window.setTimeout(() => {
        overlay.remove();
        if (previouslyFocused instanceof HTMLElement) previouslyFocused.focus();
      }, 220);
    };

    closeButtons.forEach((button) => button.addEventListener("click", closePopup));
    overlay.addEventListener("click", (event) => {
      if (event.target === overlay) closePopup();
    });
    overlay.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        closePopup();
        return;
      }
      if (event.key !== "Tab" || focusable.length < 2) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    });

    document.body.appendChild(overlay);
    document.body.classList.add("has-session-popup");
    markSessionPopupShown();
    window.requestAnimationFrame(() => {
      overlay.classList.add("is-visible");
      dialog.querySelector("[data-session-popup-close]").focus();
    });
  };

  if (!hasShownSessionPopup()) {
    window.setTimeout(showSessionPopup, 3000);
  }

  const courseCountBaseline = {
    count: 240,
    date: new Date(Date.UTC(2026, 6, 18)),
    monthlyIncrease: 10,
  };
  const now = new Date();
  let completedMonths =
    (now.getUTCFullYear() - courseCountBaseline.date.getUTCFullYear()) * 12 +
    now.getUTCMonth() -
    courseCountBaseline.date.getUTCMonth();

  if (now.getUTCDate() < courseCountBaseline.date.getUTCDate()) {
    completedMonths -= 1;
  }

  const estimatedCourseCount =
    courseCountBaseline.count +
    Math.max(0, completedMonths) * courseCountBaseline.monthlyIncrease;

  document.querySelectorAll("[data-course-student-count]").forEach((element) => {
    element.textContent = `${estimatedCourseCount}+`;
  });

  const courseVideoProof = document.querySelector(
    ".course-spotlight[data-course-video] .course-spotlight__proof"
  );
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;
  const savesData = navigator.connection?.saveData === true;

  if (courseVideoProof && !prefersReducedMotion && !savesData) {
    const language = courseVideoProof.closest("[lang]")?.lang || document.documentElement.lang;
    const isHebrew = language.toLowerCase().startsWith("he");
    const media = document.createElement("div");
    const video = document.createElement("video");
    const control = document.createElement("button");
    let sourcesLoaded = false;

    media.className = "course-spotlight__media";
    video.muted = true;
    video.defaultMuted = true;
    video.playsInline = true;
    video.preload = "none";
    video.poster = new URL(
      "images/zero-to-hero-main-logo.png",
      siteAssetsBase
    ).href;
    video.setAttribute("aria-hidden", "true");
    video.tabIndex = -1;

    control.type = "button";
    control.className = "course-spotlight__media-control";
    control.hidden = true;

    const updateControl = (state) => {
      const labels = isHebrew
        ? {
            pause: "השהיית האנימציה",
            play: "המשך האנימציה",
            replay: "הפעלת האנימציה מחדש",
          }
        : {
            pause: "Pause animation",
            play: "Resume animation",
            replay: "Replay animation",
          };
      control.dataset.state = state;
      control.setAttribute("aria-label", labels[state]);
      control.setAttribute("title", labels[state]);
      control.textContent = state === "pause" ? "Ⅱ" : state === "replay" ? "↻" : "▶";
    };

    const loadAndPlay = () => {
      if (!sourcesLoaded) {
        [
          ["media/zero-to-hero-intro.webm", "video/webm"],
          ["media/zero-to-hero-intro.mp4", "video/mp4"],
        ].forEach(([path, type]) => {
          const source = document.createElement("source");
          source.src = new URL(path, siteAssetsBase).href;
          source.type = type;
          video.appendChild(source);
        });
        sourcesLoaded = true;
        video.load();
      }

      video.play().catch(() => {
        updateControl("play");
        control.hidden = false;
      });
    };

    video.addEventListener("playing", () => {
      updateControl("pause");
      control.hidden = false;
    });
    video.addEventListener("pause", () => {
      if (!video.ended) updateControl("play");
    });
    video.addEventListener("ended", () => updateControl("replay"));

    control.addEventListener("click", () => {
      if (video.ended || control.dataset.state === "replay") {
        video.load();
        loadAndPlay();
        return;
      }
      if (video.paused) loadAndPlay();
      else video.pause();
    });

    media.append(video, control);
    courseVideoProof.classList.add("has-course-video");
    courseVideoProof.prepend(media);

    if ("IntersectionObserver" in window) {
      const videoObserver = new IntersectionObserver(
        (entries) => {
          if (!entries.some((entry) => entry.isIntersecting)) return;
          videoObserver.disconnect();
          loadAndPlay();
        },
        { rootMargin: "180px 0px", threshold: 0.15 }
      );
      videoObserver.observe(media);
    } else {
      loadAndPlay();
    }
  }

  const learningPage = document.querySelector("[data-learning-page]");

  if (learningPage) {
    const pageId = learningPage.dataset.learningId || window.location.pathname;
    const completionKey = `almog-learning-complete:${pageId}`;
    const positionKey = `almog-learning-position:${pageId}`;
    const content = learningPage.querySelector(
      "[data-learning-content], .article-content, .card"
    );

    const safelyRead = (key) => {
      try {
        return localStorage.getItem(key);
      } catch (_error) {
        return null;
      }
    };

    const safelyWrite = (key, value) => {
      try {
        localStorage.setItem(key, value);
      } catch (_error) {
        // Learning controls remain usable even when storage is unavailable.
      }
    };

    const slugify = (value, index) => {
      const slug = value
        .trim()
        .toLowerCase()
        .replace(/[\s/]+/g, "-")
        .replace(/[^\p{L}\p{N}-]/gu, "")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "");
      return slug || `learning-section-${index + 1}`;
    };

    if (content) {
      const headings = Array.from(
        content.querySelectorAll(
          "[data-learning-heading], :scope > h2, .question > h3"
        )
      );

      headings.forEach((heading, index) => {
        if (!heading.id) heading.id = slugify(heading.textContent, index);
      });

      const layout = document.createElement("div");
      layout.className = "learning-layout";
      content.parentNode.insertBefore(layout, content);

      const sidebar = document.createElement("aside");
      sidebar.className = "learning-sidebar";
      sidebar.setAttribute("aria-label", "ניווט בתוכן הלימוד");

      const sidebarTitle = document.createElement("p");
      sidebarTitle.className = "learning-sidebar__title";
      sidebarTitle.textContent = "בעמוד הזה";
      sidebar.appendChild(sidebarTitle);

      const toc = document.createElement("nav");
      toc.className = "learning-toc";
      toc.setAttribute("aria-label", "תוכן העניינים");

      headings.forEach((heading) => {
        const link = document.createElement("a");
        link.href = `#${heading.id}`;
        link.textContent = heading.textContent.trim();
        link.dataset.learningTocLink = heading.id;
        toc.appendChild(link);
      });

      sidebar.appendChild(toc);
      layout.append(sidebar, content);

      const overview = document.createElement("section");
      overview.className = "learning-overview";
      overview.setAttribute("aria-label", "פרטי יחידת הלימוד");
      overview.innerHTML = `
        <div>
          <span class="learning-overview__eyebrow">יחידת לימוד</span>
          <h2>${learningPage.dataset.learningTitle || document.title}</h2>
          <p>${learningPage.dataset.learningSummary || "לומדים בקצב שלכם ושומרים את ההתקדמות במכשיר הזה."}</p>
        </div>
        <dl class="learning-overview__meta">
          <div><dt>זמן</dt><dd>${learningPage.dataset.learningDuration || "10 דקות"}</dd></div>
          <div><dt>רמה</dt><dd>${learningPage.dataset.learningLevel || "בסיס"}</dd></div>
          <div><dt>פרקים</dt><dd>${headings.length}</dd></div>
        </dl>`;
      layout.parentNode.insertBefore(overview, layout);

      const completion = document.createElement("section");
      completion.className = "learning-completion";
      completion.innerHTML = `
        <div>
          <span class="learning-completion__icon" aria-hidden="true">✓</span>
          <div><h2>סיימתם את היחידה?</h2><p>סמנו השלמה כדי שתוכלו להמשיך בדיוק מהמקום הנכון.</p></div>
        </div>
        <button type="button" class="learning-completion__button" data-learning-complete></button>`;
      layout.parentNode.insertBefore(completion, layout.nextSibling);

      const completeButton = completion.querySelector("[data-learning-complete]");
      const updateCompletion = (isComplete) => {
        completion.classList.toggle("is-complete", isComplete);
        completeButton.setAttribute("aria-pressed", String(isComplete));
        completeButton.textContent = isComplete ? "היחידה הושלמה" : "סימון כהושלם";
      };
      updateCompletion(safelyRead(completionKey) === "true");
      completeButton.addEventListener("click", () => {
        const nextState = completeButton.getAttribute("aria-pressed") !== "true";
        safelyWrite(completionKey, String(nextState));
        updateCompletion(nextState);
      });

      const nextUrl = learningPage.dataset.learningNextUrl;
      const previousUrl = learningPage.dataset.learningPreviousUrl;
      if (nextUrl || previousUrl) {
        const pager = document.createElement("nav");
        pager.className = "learning-pager";
        pager.setAttribute("aria-label", "מעבר בין יחידות לימוד");
        if (previousUrl) {
          const previous = document.createElement("a");
          previous.href = previousUrl;
          previous.innerHTML = `<span>הקודם</span><strong>${learningPage.dataset.learningPreviousTitle || "ליחידה הקודמת"}</strong>`;
          pager.appendChild(previous);
        }
        if (nextUrl) {
          const next = document.createElement("a");
          next.href = nextUrl;
          next.className = "learning-pager__next";
          next.innerHTML = `<span>ממשיכים מכאן</span><strong>${learningPage.dataset.learningNextTitle || "ליחידה הבאה"}</strong>`;
          pager.appendChild(next);
        }
        completion.insertAdjacentElement("afterend", pager);
      }

      const progress = document.createElement("div");
      progress.className = "learning-progress";
      progress.setAttribute("aria-hidden", "true");
      progress.innerHTML = '<span data-learning-progress></span>';
      document.body.appendChild(progress);
      const progressBar = progress.firstElementChild;

      let saveTimer;
      const updateProgress = () => {
        const start = overview.offsetTop;
        const end = completion.offsetTop + completion.offsetHeight - window.innerHeight;
        const percentage = Math.max(
          0,
          Math.min(100, ((window.scrollY - start) / Math.max(1, end - start)) * 100)
        );
        progressBar.style.width = `${percentage}%`;
        window.clearTimeout(saveTimer);
        saveTimer = window.setTimeout(() => {
          safelyWrite(positionKey, String(Math.round(percentage)));
        }, 250);
      };
      updateProgress();
      window.addEventListener("scroll", updateProgress, { passive: true });
      window.addEventListener("resize", updateProgress);

      const savedPosition = Number(safelyRead(positionKey));
      if (savedPosition >= 5 && savedPosition < 95) {
        const resumeButton = document.createElement("button");
        resumeButton.type = "button";
        resumeButton.className = "learning-resume";
        resumeButton.textContent = `המשך מהמקום האחרון (${savedPosition}%)`;
        resumeButton.addEventListener("click", () => {
          const start = overview.offsetTop;
          const end = completion.offsetTop + completion.offsetHeight - window.innerHeight;
          window.scrollTo({
            top: start + ((end - start) * savedPosition) / 100,
            behavior: "smooth",
          });
        });
        overview.firstElementChild.appendChild(resumeButton);
      }

      if ("IntersectionObserver" in window && headings.length) {
        const observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (!entry.isIntersecting) return;
              toc.querySelectorAll("a").forEach((link) => {
                const isCurrent = link.dataset.learningTocLink === entry.target.id;
                link.classList.toggle("is-current", isCurrent);
                if (isCurrent) link.setAttribute("aria-current", "location");
                else link.removeAttribute("aria-current");
              });
            });
          },
          { rootMargin: "-18% 0px -68% 0px" }
        );
        headings.forEach((heading) => observer.observe(heading));
      }

      content.querySelectorAll("pre").forEach((pre) => {
        const copyButton = document.createElement("button");
        copyButton.type = "button";
        copyButton.className = "learning-copy";
        copyButton.textContent = "העתקה";
        copyButton.addEventListener("click", async () => {
          try {
            await navigator.clipboard.writeText(pre.innerText);
            copyButton.textContent = "הועתק";
            window.setTimeout(() => (copyButton.textContent = "העתקה"), 1600);
          } catch (_error) {
            copyButton.textContent = "לא ניתן להעתיק";
          }
        });
        pre.appendChild(copyButton);
      });

      const courseSpotlight = document.querySelector(".course-spotlight");
      if (courseSpotlight) {
        const pager = document.querySelector(".learning-pager");
        (pager || completion).insertAdjacentElement("afterend", courseSpotlight);
        courseSpotlight.classList.add("course-spotlight--learning-end");
      }
    }

    learningPage.querySelectorAll("[data-learning-term]").forEach((term) => {
      term.tabIndex = 0;
      term.setAttribute("role", "button");
      term.setAttribute("aria-label", `${term.textContent}: ${term.dataset.learningTerm}`);
    });

    learningPage.querySelectorAll(".question[data-target]").forEach((question) => {
      const answer = document.getElementById(question.dataset.target);
      if (!answer) return;
      question.setAttribute("role", "button");
      question.tabIndex = 0;
      question.setAttribute("aria-controls", answer.id);
      question.setAttribute("aria-expanded", String(question.classList.contains("active")));
      const syncState = () => {
        question.setAttribute("aria-expanded", String(question.classList.contains("active")));
      };
      question.addEventListener("click", () => window.setTimeout(syncState));
      question.addEventListener("keydown", (event) => {
        if (event.key !== "Enter" && event.key !== " ") return;
        event.preventDefault();
        question.click();
      });
    });
  }
});
