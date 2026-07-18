(function initializeTheme() {
  const storageKey = "almog-site-theme";

  try {
    const savedTheme = localStorage.getItem(storageKey);
    const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
    document.documentElement.dataset.theme =
      savedTheme === "dark" || savedTheme === "light"
        ? savedTheme
        : systemTheme;
  } catch (_error) {
    document.documentElement.dataset.theme = "light";
  }
})();
