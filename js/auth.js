const STORAGE_KEY_USERS = 'cartoraUsers';
const STORAGE_KEY_SESSION = 'cartoraSession';

function getStoredUsers() {
    const raw = localStorage.getItem(STORAGE_KEY_USERS);
    return raw ? JSON.parse(raw) : [];
}

function saveUsers(users) {
    localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(users));
}

function showMessage(container, text, type = 'error') {
    if (!container) return;
    container.textContent = text;
    container.classList.remove('hidden', 'text-red-600', 'text-green-600');
    container.classList.add(type === 'success' ? 'text-green-600' : 'text-red-600');
}

function clearMessage(container) {
    if (!container) return;
    container.textContent = '';
    container.classList.add('hidden');
}

function getMessageContainer(formType) {
    return document.getElementById(`${formType}-message`);
}

function handleSignup(event) {
    event.preventDefault();

    const name = document.getElementById('signup-name').value.trim();
    const email = document.getElementById('signup-email').value.trim().toLowerCase();
    const password = document.getElementById('signup-password').value;
    const message = getMessageContainer('signup');

    clearMessage(message);

    if (!name || !email || !password) {
        showMessage(message, 'Please fill in all fields.');
        return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showMessage(message, 'Please enter a valid email.');
        return;
    }

    if (password.length < 6) {
        showMessage(message, 'Password must be at least 6 characters.');
        return;
    }

    const users = getStoredUsers();
    const existing = users.find((user) => user.email === email);
    if (existing) {
        showMessage(message, 'This email is already registered. Try signing in instead.');
        return;
    }

    users.push({ name, email, password });
    saveUsers(users);

    showMessage(message, 'Account created successfully! Redirecting to Sign In...', 'success');
    event.target.reset();

    setTimeout(() => {
        window.location.href = 'signin.html';
    }, 1200);
}

function handleSignin(event) {
    event.preventDefault();

    const email = document.getElementById('signin-email').value.trim().toLowerCase();
    const password = document.getElementById('signin-password').value;
    const message = getMessageContainer('signin');

    clearMessage(message);

    if (!email || !password) {
        showMessage(message, 'Please enter your email and password.');
        return;
    }

    const users = getStoredUsers();
    const user = users.find((item) => item.email === email);

    if (!user || user.password !== password) {
        showMessage(message, 'Invalid email or password.');
        return;
    }

    localStorage.setItem(STORAGE_KEY_SESSION, JSON.stringify({ name: user.name, email: user.email }));
    showMessage(message, 'Sign in successful! Redirecting...', 'success');

    setTimeout(() => {
        window.location.href = 'index.html';
    }, 1100);
}

function getAuthCardElement() {
    return document.getElementById('auth-card') || document.getElementById('authCard');
}

function initCardAnimation() {
    const authCard = getAuthCardElement();
    if (!authCard) return;

    requestAnimationFrame(() => {
        authCard.classList.add('visible');
    });
}

function initBgScrollAnimation() {
    const root = document.documentElement;
    const updateBg = () => {
        const scrollY = window.scrollY || window.pageYOffset;
        const x = 50 + Math.sin(scrollY / 160) * 10;
        const y = 40 + Math.min(scrollY * 0.06, 18);
        root.style.setProperty('--bg-x', `${x}%`);
        root.style.setProperty('--bg-y', `${y}%`);
    };

    updateBg();
    window.addEventListener('scroll', updateBg, { passive: true });
}

function initAuthPage() {
    const signupForm = document.getElementById('signup-form');
    const signinForm = document.getElementById('signin-form');

    if (signupForm) {
        signupForm.addEventListener('submit', handleSignup);
    }

    if (signinForm) {
        signinForm.addEventListener('submit', handleSignin);
    }

    initCardAnimation();
    initBgScrollAnimation();
}

document.addEventListener('DOMContentLoaded', () => {
    initAuthPage();

    const toggleBtn = document.getElementById('toggle-btn');
    if (toggleBtn) {
        toggleBtn.addEventListener('click', toggleAuthMode);
    }

    const container = document.getElementById('container');
    const registerBtn = document.getElementById('registerBtn');
    const loginBtn = document.getElementById('loginBtn');

    if (registerBtn && container) {
        registerBtn.addEventListener('click', () => {
            container.classList.add('active');
        });
    }

    if (loginBtn && container) {
        loginBtn.addEventListener('click', () => {
            container.classList.remove('active');
        });
    }
});

function toggleAuthMode() {
    const container = document.getElementById('container');
    if (!container) return;
    container.classList.toggle('active');
}

// Interactive background effect following mouse movement
document.addEventListener('mousemove', (e) => {
    const x = (e.clientX / window.innerWidth) * 100;
    const y = (e.clientY / window.innerHeight) * 100;
    document.body.style.setProperty('--bg-x', `${x}%`);
    document.body.style.setProperty('--bg-y', `${y}%`);
});