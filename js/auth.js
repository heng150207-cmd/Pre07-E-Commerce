// ================================================================
// auth.js
// Local authentication demo and authentication page animations
// ================================================================

const STORAGE_KEY_USERS = "cartoraUsers";
const STORAGE_KEY_SESSION = "cartoraSession";

const SIGNIN_PAGE = "signin.html";
const HOME_PAGE = "index.html";

/* ----------------------------------------------------------------
   Local storage helpers
---------------------------------------------------------------- */

function getStoredUsers() {
  try {
    const rawUsers = localStorage.getItem(STORAGE_KEY_USERS);

    if (!rawUsers) {
      return [];
    }

    const parsedUsers = JSON.parse(rawUsers);

    return Array.isArray(parsedUsers) ? parsedUsers : [];
  } catch (error) {
    console.error("Failed to read stored users:", error);
    return [];
  }
}

function saveUsers(users) {
  try {
    localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(users));
    return true;
  } catch (error) {
    console.error("Failed to save users:", error);
    return false;
  }
}

function saveSession(user) {
  try {
    const session = {
      name: user.name,
      email: user.email,
    };

    localStorage.setItem(
      STORAGE_KEY_SESSION,
      JSON.stringify(session)
    );

    return true;
  } catch (error) {
    console.error("Failed to save session:", error);
    return false;
  }
}

/* ----------------------------------------------------------------
   Message helpers
---------------------------------------------------------------- */

function getMessageContainer(formType) {
  return document.getElementById(`${formType}-message`);
}

function showMessage(container, text, type = "error") {
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

/* ----------------------------------------------------------------
   Validation helpers
---------------------------------------------------------------- */

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function setFormLoading(form, isLoading) {
  if (!form) {
    return;
  }

  const submitButton = form.querySelector(
    'button[type="submit"]'
  );

  if (!submitButton) {
    return;
  }

  submitButton.disabled = isLoading;
  submitButton.classList.toggle("opacity-60", isLoading);
  submitButton.classList.toggle(
    "cursor-not-allowed",
    isLoading
  );
}

/* ----------------------------------------------------------------
   Signup
---------------------------------------------------------------- */

function handleSignup(event) {
  event.preventDefault();

  const form = event.currentTarget;
  const nameInput =
    document.getElementById("signup-name");
  const emailInput =
    document.getElementById("signup-email");
  const passwordInput =
    document.getElementById("signup-password");
  const message = getMessageContainer("signup");

  clearMessage(message);

  if (!nameInput || !emailInput || !passwordInput) {
    showMessage(
      message,
      "Signup form is not configured correctly."
    );
    return;
  }

  const name = nameInput.value.trim();
  const email = emailInput.value.trim().toLowerCase();
  const password = passwordInput.value;

  if (!name || !email || !password) {
    showMessage(message, "Please fill in all fields.");
    return;
  }

  if (!isValidEmail(email)) {
    showMessage(message, "Please enter a valid email.");
    return;
  }

  if (password.length < 6) {
    showMessage(
      message,
      "Password must be at least 6 characters."
    );
    return;
  }

  const users = getStoredUsers();

  const existingUser = users.find(
    (user) => user.email === email
  );

  if (existingUser) {
    showMessage(
      message,
      "This email is already registered. Try signing in instead."
    );
    return;
  }

  setFormLoading(form, true);

  const newUser = {
    name,
    email,
    password,
  };

  users.push(newUser);

  const savedSuccessfully = saveUsers(users);

  if (!savedSuccessfully) {
    showMessage(
      message,
      "Unable to create your account. Please try again."
    );

    setFormLoading(form, false);
    return;
  }

  showMessage(
    message,
    "Account created successfully! Redirecting to Sign In...",
    "success"
  );

  form.reset();

  setTimeout(() => {
    window.location.href = SIGNIN_PAGE;
  }, 1200);
}

/* ----------------------------------------------------------------
   Signin
---------------------------------------------------------------- */

function handleSignin(event) {
  event.preventDefault();

  const form = event.currentTarget;
  const emailInput =
    document.getElementById("signin-email");
  const passwordInput =
    document.getElementById("signin-password");
  const message = getMessageContainer("signin");

  clearMessage(message);

  if (!emailInput || !passwordInput) {
    showMessage(
      message,
      "Signin form is not configured correctly."
    );
    return;
  }

  const email = emailInput.value.trim().toLowerCase();
  const password = passwordInput.value;

  if (!email || !password) {
    showMessage(
      message,
      "Please enter your email and password."
    );
    return;
  }

  setFormLoading(form, true);

  const users = getStoredUsers();

  const user = users.find(
    (storedUser) => storedUser.email === email
  );

  if (!user || user.password !== password) {
    showMessage(message, "Invalid email or password.");
    setFormLoading(form, false);
    return;
  }

  const sessionSaved = saveSession(user);

  if (!sessionSaved) {
    showMessage(
      message,
      "Unable to start your session. Please try again."
    );

    setFormLoading(form, false);
    return;
  }

  showMessage(
    message,
    "Sign in successful! Redirecting...",
    "success"
  );

  form.reset();

  setTimeout(() => {
    window.location.href = HOME_PAGE;
  }, 1100);
}

/* ----------------------------------------------------------------
   Authentication card animation
---------------------------------------------------------------- */

function getAuthCardElement() {
  return (
    document.getElementById("auth-card") ||
    document.getElementById("authCard")
  );
}

function initCardAnimation() {
  const authCard = getAuthCardElement();

  if (!authCard) {
    return;
  }

  requestAnimationFrame(() => {
    authCard.classList.add("visible");
  });
}

/* ----------------------------------------------------------------
   Background animations
---------------------------------------------------------------- */

function initBackgroundAnimation() {
  const root = document.documentElement;

  function updateBackgroundFromScroll() {
    const scrollY =
      window.scrollY || window.pageYOffset;

    const x = 50 + Math.sin(scrollY / 160) * 10;
    const y = 40 + Math.min(scrollY * 0.06, 18);

    root.style.setProperty("--bg-x", `${x}%`);
    root.style.setProperty("--bg-y", `${y}%`);
  }

  function updateBackgroundFromMouse(event) {
    const x =
      (event.clientX / window.innerWidth) * 100;
    const y =
      (event.clientY / window.innerHeight) * 100;

    root.style.setProperty("--bg-x", `${x}%`);
    root.style.setProperty("--bg-y", `${y}%`);
  }

  updateBackgroundFromScroll();

  window.addEventListener(
    "scroll",
    updateBackgroundFromScroll,
    { passive: true }
  );

  document.addEventListener(
    "mousemove",
    updateBackgroundFromMouse
  );
}

/* ----------------------------------------------------------------
   Toggle authentication panels
---------------------------------------------------------------- */

function toggleAuthMode() {
  const container =
    document.getElementById("container");

  if (!container) {
    return;
  }

  container.classList.toggle("active");
}

function initAuthToggle() {
  const container =
    document.getElementById("container");
  const toggleButton =
    document.getElementById("toggle-btn");
  const registerButton =
    document.getElementById("registerBtn");
  const loginButton =
    document.getElementById("loginBtn");

  if (toggleButton) {
    toggleButton.addEventListener(
      "click",
      toggleAuthMode
    );
  }

  if (registerButton && container) {
    registerButton.addEventListener("click", () => {
      container.classList.add("active");
    });
  }

  if (loginButton && container) {
    loginButton.addEventListener("click", () => {
      container.classList.remove("active");
    });
  }
}

/* ----------------------------------------------------------------
   Initialize authentication page
---------------------------------------------------------------- */

function initAuthPage() {
  const signupForm =
    document.getElementById("signup-form");
  const signinForm =
    document.getElementById("signin-form");

  if (signupForm) {
    signupForm.addEventListener(
      "submit",
      handleSignup
    );
  }

  if (signinForm) {
    signinForm.addEventListener(
      "submit",
      handleSignin
    );
  }

  initAuthToggle();
  initCardAnimation();
  initBackgroundAnimation();
}

document.addEventListener(
  "DOMContentLoaded",
  initAuthPage
);