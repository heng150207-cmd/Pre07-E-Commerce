// theme.js — dark mode toggle for Cartora
// Relies on tailwind.config.darkMode = "class" (set in index.html),
// plus an inline pre-paint script in <head> that applies the saved
// theme before first render to avoid a flash of the wrong theme.

(function () {
  const toggleBtn = document.getElementById("theme-toggle");
  const moonIcon = document.getElementById("icon-moon");
  const sunIcon = document.getElementById("icon-sun");
  const root = document.documentElement;

  function syncIcons() {
    const isDark = root.classList.contains("dark");
    moonIcon.classList.toggle("hidden", isDark);
    sunIcon.classList.toggle("hidden", !isDark);
  }

  function setTheme(theme) {
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
    syncIcons();
  }

  // Reflect whatever the pre-paint script already applied
  syncIcons();

  toggleBtn.addEventListener("click", () => {
    const isDark = root.classList.contains("dark");
    setTheme(isDark ? "light" : "dark");
  });

  // Follow the OS theme automatically if the user hasn't picked one manually
  window
    .matchMedia("(prefers-color-scheme: dark)")
    .addEventListener("change", (e) => {
      if (!localStorage.getItem("theme")) {
        setTheme(e.matches ? "dark" : "light");
      }
    });
})();
