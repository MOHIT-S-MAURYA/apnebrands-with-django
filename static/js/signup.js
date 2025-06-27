document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("signup-form");
  const inputs = form.querySelectorAll(".form-input");
  const submitBtn = document.getElementById("signup-btn");
  const termsCheckbox = document.getElementById("terms");

  // Username availability check
  const usernameInput = document.getElementById("username");
  const usernameError = document.getElementById("username-error");
  const usernameSuccess = document.getElementById("username-success");

  // Email availability check
  const emailInput = document.getElementById("email");
  const emailError = document.getElementById("email-error");
  const emailSuccess = document.getElementById("email-success");

  // Password strength check
  const passwordInput = document.getElementById("password");
  const confirmPasswordInput = document.getElementById("confirm-password");
  const strengthProgress = document.getElementById("strength-progress");
  const strengthText = document.getElementById("strength-text");

  let usernameAvailable = false;
  let emailAvailable = false;
  let passwordValid = false;
  let passwordsMatch = false;

  // Debounce function for API calls
  function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  // Check username availability
  const checkUsername = debounce(async function (username) {
    if (username.length < 3) {
      usernameInput.classList.add("error");
      usernameError.textContent =
        "Username must be at least 3 characters long";
      usernameError.style.display = "block";
      usernameSuccess.style.display = "none";
      usernameAvailable = false;
      checkFormValidity();
      return;
    }

    try {
      const response = await fetch(
        `/check-username/?username=${encodeURIComponent(username)}`
      );
      const data = await response.json();

      if (data.available) {
        usernameInput.classList.remove("error");
        usernameInput.classList.add("success");
        usernameError.style.display = "none";
        usernameSuccess.textContent = "Username is available";
        usernameSuccess.style.display = "block";
        usernameAvailable = true;
      } else {
        usernameInput.classList.add("error");
        usernameInput.classList.remove("success");
        usernameError.textContent = "Username is already taken";
        usernameError.style.display = "block";
        usernameSuccess.style.display = "none";
        usernameAvailable = false;
      }
    } catch (error) {
      console.error("Error checking username:", error);
    }

    checkFormValidity();
  }, 500);

  // Check email availability
  const checkEmail = debounce(async function (email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      emailInput.classList.add("error");
      emailError.textContent = "Please enter a valid email address";
      emailError.style.display = "block";
      emailSuccess.style.display = "none";
      emailAvailable = false;
      checkFormValidity();
      return;
    }

    try {
      const response = await fetch(
        `/check-email/?email=${encodeURIComponent(email)}`
      );
      const data = await response.json();

      if (data.available) {
        emailInput.classList.remove("error");
        emailInput.classList.add("success");
        emailError.style.display = "none";
        emailSuccess.textContent = "Email is available";
        emailSuccess.style.display = "block";
        emailAvailable = true;
      } else {
        emailInput.classList.add("error");
        emailInput.classList.remove("success");
        emailError.textContent = "Email is already registered";
        emailError.style.display = "block";
        emailSuccess.style.display = "none";
        emailAvailable = false;
      }
    } catch (error) {
      console.error("Error checking email:", error);
    }

    checkFormValidity();
  }, 500);

  // Password strength checker
  function checkPasswordStrength(password) {
    let strength = 0;
    let feedback = [];

    if (password.length >= 8) strength += 1;
    else feedback.push("at least 8 characters");

    if (/[a-z]/.test(password)) strength += 1;
    else feedback.push("lowercase letter");

    if (/[A-Z]/.test(password)) strength += 1;
    else feedback.push("uppercase letter");

    if (/[0-9]/.test(password)) strength += 1;
    else feedback.push("number");

    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    else feedback.push("special character");

    const colors = ["#ef4444", "#f59e0b", "#eab308", "#22c55e", "#10b981"];
    const labels = ["Very Weak", "Weak", "Fair", "Good", "Strong"];

    strengthProgress.style.width = `${(strength / 5) * 100}%`;
    strengthProgress.style.backgroundColor = colors[strength] || colors[0];
    strengthText.textContent = labels[strength] || labels[0];
    strengthText.style.color = colors[strength] || colors[0];

    passwordValid = strength >= 3;

    if (feedback.length > 0 && password.length > 0) {
      document.getElementById(
        "password-error"
      ).textContent = `Password needs: ${feedback.join(", ")}`;
      document.getElementById("password-error").style.display = "block";
    } else {
      document.getElementById("password-error").style.display = "none";
    }

    return passwordValid;
  }

  // Check if passwords match
  function checkPasswordMatch() {
    const password = passwordInput.value;
    const confirmPassword = confirmPasswordInput.value;
    const errorElement = document.getElementById("confirm-password-error");

    if (confirmPassword.length > 0) {
      if (password === confirmPassword) {
        confirmPasswordInput.classList.remove("error");
        confirmPasswordInput.classList.add("success");
        errorElement.style.display = "none";
        passwordsMatch = true;
      } else {
        confirmPasswordInput.classList.add("error");
        confirmPasswordInput.classList.remove("success");
        errorElement.textContent = "Passwords do not match";
        errorElement.style.display = "block";
        passwordsMatch = false;
      }
    } else {
      confirmPasswordInput.classList.remove("error", "success");
      errorElement.style.display = "none";
      passwordsMatch = false;
    }

    checkFormValidity();
  }

  // Check overall form validity
  function checkFormValidity() {
    const allFieldsFilled = Array.from(inputs).every(
      (input) => input.value.trim() !== ""
    );
    const termsAccepted = termsCheckbox.checked;

    const isValid =
      allFieldsFilled &&
      usernameAvailable &&
      emailAvailable &&
      passwordValid &&
      passwordsMatch &&
      termsAccepted;

    submitBtn.disabled = !isValid;
    submitBtn.style.opacity = isValid ? "1" : "0.6";
  }

  // Event listeners
  usernameInput.addEventListener("input", function () {
    const username = this.value.trim();
    if (username) {
      checkUsername(username);
    } else {
      this.classList.remove("error", "success");
      usernameError.style.display = "none";
      usernameSuccess.style.display = "none";
      usernameAvailable = false;
      checkFormValidity();
    }
  });

  emailInput.addEventListener("input", function () {
    const email = this.value.trim();
    if (email) {
      checkEmail(email);
    } else {
      this.classList.remove("error", "success");
      emailError.style.display = "none";
      emailSuccess.style.display = "none";
      emailAvailable = false;
      checkFormValidity();
    }
  });

  passwordInput.addEventListener("input", function () {
    checkPasswordStrength(this.value);
    if (confirmPasswordInput.value) {
      checkPasswordMatch();
    }
    checkFormValidity();
  });

  confirmPasswordInput.addEventListener("input", checkPasswordMatch);

  termsCheckbox.addEventListener("change", checkFormValidity);

  inputs.forEach((input) => {
    input.addEventListener("input", checkFormValidity);
  });

  // Form submission
  form.addEventListener("submit", function (e) {
    if (submitBtn.disabled) {
      e.preventDefault();
      return;
    }

    submitBtn.innerHTML =
      '<i class="fas fa-spinner fa-spin me-2"></i>Creating Account...';
    submitBtn.disabled = true;
  });
});
