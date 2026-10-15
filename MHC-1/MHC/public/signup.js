document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('signupForm');
    const errorMsg = document.getElementById('errorMsg');
    const successMsg = document.getElementById('successMsg');

    if (!form) return;

    form.addEventListener('submit', function (e) {
        e.preventDefault();

        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;

        // Reset messages
        if (errorMsg) {
            errorMsg.textContent = '';
            errorMsg.classList.remove('show');
        }
        if (successMsg) {
            successMsg.textContent = '';
            successMsg.classList.remove('show');
        }

        // Validations
        if (!name || !email || !password) {
            if (errorMsg) {
                errorMsg.textContent = 'All fields are required.';
                errorMsg.classList.add('show');
            }
            return;
        }

        if (password.length < 6) {
            if (errorMsg) {
                errorMsg.textContent = 'Password must be at least 6 characters.';
                errorMsg.classList.add('show');
            }
            return;
        }

        if (password !== confirmPassword) {
            if (errorMsg) {
                errorMsg.textContent = 'Passwords do not match.';
                errorMsg.classList.add('show');
            }
            return;
        }

        let users = JSON.parse(localStorage.getItem('users') || '[]');
        if (users.find(u => u.email === email)) {
            if (errorMsg) {
                errorMsg.textContent = 'Email already registered.';
                errorMsg.classList.add('show');
            }
            return;
        }

        // Create user
        const newUser = { name, email, password };
        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));
        localStorage.setItem('currentUser', JSON.stringify(newUser));
        localStorage.setItem('isLoggedIn', 'true');

        // Success
        if (successMsg) {
            successMsg.textContent = 'Account created successfully! Redirecting...';
            successMsg.classList.add('show');
        }

        setTimeout(() => {
            window.location.href = 'mood.html';
        }, 1500);
    });
});
