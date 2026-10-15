document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('loginForm');
    const errorMsg = document.getElementById('errorMsg');

    if (!form || !errorMsg) {
        console.error("Login form or error container not found");
        return;
    }

    // Ensure demo user exists
    let users = JSON.parse(localStorage.getItem('users') || '[]');

    if (!Array.isArray(users)) users = [];

    if (!users.some(u => u.email === 'demo@tranquoria.com')) {
        users.push({
            name: 'Demo User',
            email: 'demo@tranquoria.com',
            password: 'demo123'
        });
        localStorage.setItem('users', JSON.stringify(users));
    }

    form.addEventListener('submit', function (e) {
        e.preventDefault();

        const emailInput = document.getElementById('email');
        const passwordInput = document.getElementById('password');

        if (!emailInput || !passwordInput) return;

        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();

        // Clear error
        errorMsg.textContent = '';
        errorMsg.style.display = 'none';

        // Always fetch latest users
        const users = JSON.parse(localStorage.getItem('users') || '[]');

        // Check login
        const user = users.find(
            u => u.email === email && u.password === password
        );

        if (user) {
            console.log("✅ Login successful");

            localStorage.setItem('currentUser', JSON.stringify(user));
            localStorage.setItem('isLoggedIn', 'true');

            // Redirect to mood check
            window.location.href = 'mood.html';
        } else {
            console.log("❌ Login failed");

            errorMsg.textContent = 'Invalid credentials. Try: demo@tranquoria.com / demo123';
            errorMsg.style.display = 'block';
        }
    });
});