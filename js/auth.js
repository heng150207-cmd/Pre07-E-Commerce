"use strict";

// ================================================================
// auth.js
// Martify API authentication for login.html
// api.js must be loaded before this file.
// ================================================================

const HOME_PAGE_URL = "../index.html";

document.addEventListener("DOMContentLoaded", () => {
  initAuthForms();
});

/* ================================================================
   INITIALIZATION
================================================================ */

function initAuthForms() {
  const signupForm =
    document.getElementById("signup-form");

  const signinForm =
    document.getElementById("signin-form");

  signupForm?.addEventListener(
    "submit",
    handleSignup
  );

  signinForm?.addEventListener(
    "submit",
    handleSignin
  );
}

/* ================================================================
   MESSAGES
================================================================ */

function getMessageContainer(type) {
  return document.getElementById(
    `${type}-message`
  );
}

function showMessage(
  container,
  text,
  type = "error"
) {
  if (!container) {
    return;
  }

  container.textContent = text;

  container.classList.remove(
    "hidden",
    "text-red-600",
    "text-green-600"
  );

  container.classList.add(
    type === "success"
      ? "text-green-600"
      : "text-red-600"
  );
}

function clearMessage(container) {
  if (!container) {
    return;
  }

  container.textContent = "";

  container.classList.remove(
    "text-red-600",
    "text-green-600"
  );

  container.classList.add("hidden");
}

/* ================================================================
   VALIDATION
================================================================ */

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
    email
  );
}

/* ================================================================
   FORM LOADING
================================================================ */

function setFormLoading(
  form,
  isLoading,
  loadingText
) {
  if (!form) {
    return;
  }

  const submitButton = form.querySelector(
    'button[type="submit"]'
  );

  if (!submitButton) {
    return;
  }

  if (!submitButton.dataset.originalText) {
    submitButton.dataset.originalText =
      submitButton.textContent.trim();
  }

  submitButton.disabled = isLoading;

  submitButton.textContent = isLoading
    ? loadingText
    : submitButton.dataset.originalText;
}

/* ================================================================
   PANEL SWITCHING
================================================================ */

function switchToSigninPanel(email = "") {
  const authCard =
    document.getElementById("authCard");

  const signinEmailInput =
    document.getElementById(
      "signin-email"
    );

  authCard?.classList.remove(
    "right-panel-active"
  );

  if (signinEmailInput && email) {
    signinEmailInput.value = email;
  }

  window.setTimeout(() => {
    signinEmailInput?.focus();
  }, 300);
}

/* ================================================================
   RESPONSE HELPERS
================================================================ */

function findToken(response) {
  const possibleTokens = [
    response?.accessToken,
    response?.token,
    response?.data?.accessToken,
    response?.data?.token,
    response?.data?.data?.accessToken,
    response?.data?.data?.token,
    response?.payload?.accessToken,
    response?.payload?.token,
  ];

  return (
    possibleTokens.find(
      (value) =>
        typeof value === "string" &&
        value.trim()
    ) || null
  );
}

function findUser(response) {
  const possibleUsers = [
    response?.user,
    response?.data?.user,
    response?.data?.data?.user,
    response?.payload?.user,
    response?.data,
    response?.data?.data,
    response?.payload,
    response,
  ];

  return (
    possibleUsers.find((value) => {
      return (
        value &&
        typeof value === "object" &&
        !Array.isArray(value) &&
        (
          value.uuid ||
          value.userUuid ||
          value.email ||
          value.username
        )
      );
    }) || null
  );
}

function findUserUuid(user) {
  return (
    user?.uuid ||
    user?.userUuid ||
    user?.data?.uuid ||
    user?.user?.uuid ||
    null
  );
}

function normalizeUser(user) {
  if (
    !user ||
    typeof user !== "object" ||
    Array.isArray(user)
  ) {
    return null;
  }

  const uuid = findUserUuid(user);

  if (!uuid) {
    return null;
  }

  return {
    ...user,
    uuid,
  };
}

/* ================================================================
   SIGNUP
================================================================ */

async function handleSignup(event) {
  event.preventDefault();

  const form = event.currentTarget;

  const message =
    getMessageContainer("signup");

  clearMessage(message);

  const firstName = document
    .getElementById("signup-firstname")
    ?.value.trim();

  const lastName = document
    .getElementById("signup-lastname")
    ?.value.trim();

  const username = document
    .getElementById("signup-username")
    ?.value.trim();

  const phone = document
    .getElementById("signup-phone")
    ?.value.trim();

  const email = document
    .getElementById("signup-email")
    ?.value.trim()
    .toLowerCase();

  const password =
    document.getElementById(
      "signup-password"
    )?.value;

  const confirmPassword =
    document.getElementById(
      "signup-confirm-password"
    )?.value;

  if (
    !firstName ||
    !lastName ||
    !username ||
    !phone ||
    !email ||
    !password ||
    !confirmPassword
  ) {
    showMessage(
      message,
      "Please fill in all fields."
    );

    return;
  }

  if (!isValidEmail(email)) {
    showMessage(
      message,
      "Please enter a valid email."
    );

    return;
  }

  if (password.length < 6) {
    showMessage(
      message,
      "Password must be at least 6 characters."
    );

    return;
  }

  if (password !== confirmPassword) {
    showMessage(
      message,
      "Passwords do not match."
    );

    return;
  }

  setFormLoading(
    form,
    true,
    "SIGNING UP..."
  );

  try {
    const response = await apiRequest(
      "/auth/signup",
      {
        method: "POST",

        body: JSON.stringify({
          firstName,
          lastName,
          username,
          email,
          password,
          confirmPassword,
          phone,
        }),
      }
    );

    console.log(
      "Signup response:",
      response
    );

    showMessage(
      message,
      response?.message ||
        "Account created successfully. You can now sign in.",
      "success"
    );

    form.reset();

    window.setTimeout(() => {
      switchToSigninPanel(email);
    }, 900);
  } catch (error) {
    console.error(
      "Signup failed:",
      error
    );

    showMessage(
      message,
      error.message ||
        "Unable to create account."
    );
  } finally {
    setFormLoading(
      form,
      false,
      "SIGN UP"
    );
  }
}

/* ================================================================
   SIGNIN
================================================================ */

async function handleSignin(event) {
  event.preventDefault();

  const form = event.currentTarget;

  const message =
    getMessageContainer("signin");

  clearMessage(message);

  const email = document
    .getElementById("signin-email")
    ?.value.trim()
    .toLowerCase();

  const password =
    document.getElementById(
      "signin-password"
    )?.value;

  if (!email || !password) {
    showMessage(
      message,
      "Please enter your email and password."
    );

    return;
  }

  if (!isValidEmail(email)) {
    showMessage(
      message,
      "Please enter a valid email."
    );

    return;
  }

  setFormLoading(
    form,
    true,
    "SIGNING IN..."
  );

  try {
    clearAuthStorage();

    const response = await apiRequest(
      "/auth/login",
      {
        method: "POST",

        body: JSON.stringify({
          email,
          password,
        }),
      }
    );

    console.log(
      "Login response:",
      response
    );

    const token = findToken(response);

    if (!token) {
      throw new Error(
        "Login succeeded, but no access token was returned."
      );
    }

    saveAccessToken(token);

    let user = normalizeUser(
      findUser(response)
    );

    if (!user) {
      const meResponse =
        await apiRequest(
          "/auth/me",
          {
            method: "GET",
          }
        );

      console.log(
        "Auth me response:",
        meResponse
      );

      user = normalizeUser(
        findUser(meResponse)
      );
    }

    if (!user) {
      throw new Error(
        "Login succeeded, but the user UUID could not be loaded."
      );
    }

    saveUser(user);

    console.log(
      "Authenticated user saved:",
      user
    );

    console.log(
      "Authenticated user UUID:",
      user.uuid
    );

    showMessage(
      message,
      "Sign in successful. Redirecting...",
      "success"
    );

    form.reset();

    window.setTimeout(() => {
      window.location.href =
        HOME_PAGE_URL;
    }, 900);
  } catch (error) {
    console.error(
      "Signin failed:",
      error
    );

    clearAuthStorage();

    showMessage(
      message,
      error.message ||
        "Unable to sign in."
    );
  } finally {
    setFormLoading(
      form,
      false,
      "SIGN IN"
    );
  }
}