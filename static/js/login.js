function togglePassword() {
    const passwordInput = document.getElementById('password');
    const passwordIcon = document.getElementById('passwordIcon');
    
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        passwordIcon.classList.remove('fa-eye');
        passwordIcon.classList.add('fa-eye-slash');
    } else {
        passwordInput.type = 'password';
        passwordIcon.classList.remove('fa-eye-slash');
        passwordIcon.classList.add('fa-eye');
    }
}

// Form validation
document.getElementById('loginForm').addEventListener('submit', function(e) {
    const username = document.getElementById('username');
    const password = document.getElementById('password');
    let isValid = true;
    
    // Reset previous error states
    username.classList.remove('error');
    password.classList.remove('error');
    
    if (!username.value.trim()) {
        username.classList.add('error');
        isValid = false;
    }
    
    if (!password.value.trim()) {
        password.classList.add('error');
        isValid = false;
    }
    
    if (!isValid) {
        e.preventDefault();
    }
});

// Remove error state on input
document.querySelectorAll('.form-input').forEach(input => {
    input.addEventListener('input', function() {
        this.classList.remove('error');
    });
});
