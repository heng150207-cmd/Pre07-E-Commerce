"use strict";

// ================================================================
// auth-ui.js
// Controls navbar authentication state and protected-page redirects.
// api.js must load before this file.
// ================================================================

const LOGIN_PAGE_URL = "login.html";
const HOME_PAGE_URL = "../index.html";

document.addEventListener("DOMContentLoaded", () => {
  updateNavbarAuthState();
  protectPrivatePage();
});

/* ================================================================
   AUTH STATE
================================================================ */

function isUserLoggedIn() {
  const token = getAccessToken();
  const user = getStoredUser();

  return Boolean(token && getUserUuid(user));
}

function getCurrentUser() {
  if (!isUserLoggedIn()) {
    return null;
  }

  return getStoredUser();
}

function getUserUuid(user) {
  return (
    user?.uuid ||
    user?.userUuid ||
    user?.data?.uuid ||
    user?.data?.userUuid ||
    user?.user?.uuid ||
    user?.data?.user?.uuid ||
    user?.payload?.uuid ||
    user?.payload?.user?.uuid ||
    null
  );
}

function getUserDisplayName(user) {
  if (!user) {
    return "User";
  }

  const userData =
    user?.data?.user ||
    user?.data ||
    user?.user ||
    user?.payload?.user ||
    user?.payload ||
    user;

  const fullName = [
    userData?.firstName,
    userData?.lastName,
  ]
    .filter(Boolean)
    .join(" ")
    .trim();

  return (
    fullName ||
    userData?.username ||
    userData?.name ||
    userData?.email ||
    "User"
  );
}

/* ================================================================
   NAVBAR
================================================================ */

function updateNavbarAuthState() {
  const desktopAuthContainer =
    document.getElementById("navbar-auth");

  const mobileAuthContainer =
    document.getElementById("mobile-navbar-auth");

  const user = getCurrentUser();

  if (!user) {
    renderLoginLink(desktopAuthContainer, false);
    renderLoginLink(mobileAuthContainer, true);
    return;
  }

  const displayName = getUserDisplayName(user);

  renderUserMenu(
    desktopAuthContainer,
    displayName,
    false
  );

  renderUserMenu(
    mobileAuthContainer,
    displayName,
    true
  );
}

function renderLoginLink(container, isMobile) {
  if (!container) {
    return;
  }

  container.innerHTML = `
    <a
      href="${buildLoginUrl()}"
      class="${
        isMobile
          ? "flex items-center gap-2"
          : "hidden md:flex items-center gap-2"
      }
             text-gray-800 transition-colors
             hover:text-violet-600"
    >
      ${getUserIcon("h-6 w-6")}

      <span>Login</span>
    </a>
  `;
}

function renderUserMenu(
  container,
  displayName,
  isMobile
) {
  if (!container) {
    return;
  }

  const safeDisplayName =
    escapeHtml(displayName);

  if (isMobile) {
    container.innerHTML = `
      <div class="space-y-3">
        <div
          class="flex items-center gap-2
                 font-semibold text-gray-800"
        >
          ${getUserIcon("h-6 w-6")}

          <span>${safeDisplayName}</span>
        </div>

        <button
          type="button"
          data-action="logout"
          class="flex items-center gap-2
                 text-red-500 transition-colors
                 hover:text-red-600"
        >
          ${getLogoutIcon("h-5 w-5")}

          <span>Logout</span>
        </button>
      </div>
    `;
  } else {
    container.innerHTML = `
      <div class="relative hidden md:block">
        <button
          type="button"
          data-action="toggle-user-menu"
          aria-expanded="false"
          class="flex items-center gap-2
                 text-gray-800 transition-colors
                 hover:text-violet-600"
        >
          ${getUserIcon("h-7 w-7")}

          <span
            class="max-w-32 truncate font-medium"
            title="${safeDisplayName}"
          >
            ${safeDisplayName}
          </span>

          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-4 w-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            aria-hidden="true"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="m6 9 6 6 6-6"
            ></path>
          </svg>
        </button>

        <div
          data-user-menu
          class="absolute right-0 top-full z-50
                 mt-3 hidden min-w-44
                 rounded-xl border border-gray-200
                 bg-white p-2 shadow-xl"
        >
          <a
            href="cart.html"
            class="block rounded-lg px-4 py-2
                   text-sm text-gray-700
                   hover:bg-gray-100"
          >
            My Cart
          </a>

          <a
            href="wishlist.html"
            class="block rounded-lg px-4 py-2
                   text-sm text-gray-700
                   hover:bg-gray-100"
          >
            My Wishlist
          </a>

          <button
            type="button"
            data-action="logout"
            class="block w-full rounded-lg
                   px-4 py-2 text-left
                   text-sm text-red-500
                   hover:bg-red-50"
          >
            Logout
          </button>
        </div>
      </div>
    `;
  }

  bindAuthMenuEvents(container);
}

function bindAuthMenuEvents(container) {
  const menuButton = container.querySelector(
    '[data-action="toggle-user-menu"]'
  );

  const userMenu = container.querySelector(
    "[data-user-menu]"
  );

  menuButton?.addEventListener("click", () => {
    const isHidden =
      userMenu?.classList.toggle("hidden");

    menuButton.setAttribute(
      "aria-expanded",
      String(!isHidden)
    );
  });

  container
    .querySelectorAll('[data-action="logout"]')
    .forEach((button) => {
      button.addEventListener("click", logoutUser);
    });
}

/* ================================================================
   LOGIN REDIRECTION
================================================================ */

function requireLogin() {
  if (isUserLoggedIn()) {
    return true;
  }

  saveReturnUrl();

  window.location.href = buildLoginUrl();

  return false;
}

function saveReturnUrl() {
  const currentUrl =
    window.location.pathname +
    window.location.search +
    window.location.hash;

  sessionStorage.setItem(
    "cartoraReturnUrl",
    currentUrl
  );
}

function buildLoginUrl() {
  const currentUrl =
    window.location.pathname +
    window.location.search +
    window.location.hash;

  return `${LOGIN_PAGE_URL}?redirect=${encodeURIComponent(
    currentUrl
  )}`;
}

function getLoginRedirectUrl() {
  const query =
    new URLSearchParams(window.location.search);

  const queryRedirect =
    query.get("redirect");

  const storedRedirect =
    sessionStorage.getItem("cartoraReturnUrl");

  return (
    queryRedirect ||
    storedRedirect ||
    HOME_PAGE_URL
  );
}

function clearLoginRedirectUrl() {
  sessionStorage.removeItem(
    "cartoraReturnUrl"
  );
}

/* ================================================================
   PROTECTED PAGES
================================================================ */

function protectPrivatePage() {
  const protectedPage =
    document.body.dataset.authRequired === "true";

  if (!protectedPage) {
    return;
  }

  if (!isUserLoggedIn()) {
    saveReturnUrl();
    window.location.replace(buildLoginUrl());
  }
}

/* ================================================================
   LOGOUT
================================================================ */

function logoutUser() {
  clearAuthStorage();

  localStorage.removeItem(
    "cartoraWishlist"
  );

  sessionStorage.removeItem(
    "cartoraReturnUrl"
  );

  window.location.href = HOME_PAGE_URL;
}

/* ================================================================
   ICONS
================================================================ */

function getUserIcon(className) {
  return `
    <svg
      xmlns="http://www.w3.org/2000/svg"
      class="${className}"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="1.8"
      stroke-linecap="round"
      stroke-linejoin="round"
      aria-hidden="true"
    >
      <path
        d="M20 21v-2a4 4 0 0 0-4-4H8
           a4 4 0 0 0-4 4v2"
      ></path>

      <circle cx="12" cy="7" r="4"></circle>
    </svg>
  `;
}

function getLogoutIcon(className) {
  return `
    <svg
      xmlns="http://www.w3.org/2000/svg"
      class="${className}"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="1.8"
      stroke-linecap="round"
      stroke-linejoin="round"
      aria-hidden="true"
    >
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
      <path d="m16 17 5-5-5-5"></path>
      <path d="M21 12H9"></path>
    </svg>
  `;
}

/* ================================================================
   SECURITY
================================================================ */

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}