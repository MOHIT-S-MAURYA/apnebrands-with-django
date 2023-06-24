document.addEventListener("DOMContentLoaded", () => {
  var signupForm = document.getElementById("signup-form");
  var signupButton = document.getElementById("sign-up-button");
  var firstNameInput = document.getElementById("first-name");
  var lastNameInput = document.getElementById("last-name");
  var usernameInput = document.getElementById("username");
  var passwordInput = document.getElementById("password");
  var confirmPasswordInput = document.getElementById("confirm-password");
  var emailInput = document.getElementById("email");
  var usernameError = document.getElementById("username-error");
  var emailError = document.getElementById("email-error");
  var confirmPasswordError = document.getElementById("confirm-password-error");

  // Function to toggle the signup button state
  var toggleSignupButton = () => {
    if (checkValidation()) {
      signupButton.removeAttribute("disabled");
    } else {
      signupButton.setAttribute("disabled", "disabled");
    }
  };

  // Function to validate the password and confirm password match
  var passwordMatch = () => {
    if (passwordInput.value === confirmPasswordInput.value) {
      confirmPasswordError.textContent = "Passwords match";
      confirmPasswordError.style.color = "green";
      confirmPasswordError.style.display = "block";
      return true;
    } else {
      confirmPasswordError.textContent = "Passwords do not match";
      confirmPasswordError.style.color = "red";
      confirmPasswordError.style.display = "block";
      return false;
    }
  };

  // Function to validate the email format
  var isValidEmail = () => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (emailRegex.test(emailInput.value)) {
      emailError.textContent = "Valid Email";
      emailError.style.color = "green";
      emailError.style.display = "block";
      return true;
    } else {
      emailError.textContent = "Invalid Email";
      emailError.style.color = "red";
      emailError.style.display = "block";
      return false;
    }
  };

  // Function to check email availability
  var isEmailAvailable = () => {
    return new Promise((resolve, reject) => {
      var xhr = new XMLHttpRequest();
      xhr.onreadystatechange = function () {
        if (xhr.readyState === XMLHttpRequest.DONE) {
          if (xhr.status === 200) {
            var response = JSON.parse(xhr.responseText);
            if (response.available) {
              emailError.textContent = "Email is available";
              emailError.style.color = "green";
              emailError.style.display = "block";
              resolve(true);
            } else {
              emailError.textContent = "Email is not available";
              emailError.style.color = "red";
              emailError.style.display = "block";
              resolve(false);
            }
          } else {
            reject(xhr.status);
          }
        }
      };
      xhr.open("GET", "/check-email/?email=" + encodeURIComponent(emailInput.value), true);
      xhr.send();
    });
  };

  // Function to validate the username format
  var isValidUsername = () => {
    const usernameRegex = /^[a-zA-Z0-9_]{3,}$/;
    if (usernameRegex.test(usernameInput.value)) {
      usernameError.textContent = "Valid Username";
      usernameError.style.color = "green";
      usernameError.style.display = "block";
      return true;
    } else {
      usernameError.textContent = "Invalid Username";
      usernameError.style.color = "red";
      usernameError.style.display = "block";
      return false;
    }
  };

  // Function to check username availability
  var isUsernameAvailable = () => {
    return new Promise((resolve, reject) => {
      var xhr = new XMLHttpRequest();
      xhr.onreadystatechange = function () {
        if (xhr.readyState === XMLHttpRequest.DONE) {
          if (xhr.status === 200) {
            var response = JSON.parse(xhr.responseText);
            if (response.available) {
              usernameError.textContent = "Username is available";
              usernameError.style.color = "green";
              usernameError.style.display = "block";
              resolve(true);
            } else {
              usernameError.textContent = "Username is not available";
              usernameError.style.color = "red";
              usernameError.style.display = "block";
              resolve(false);
            }
          } else {
            reject(xhr.status);
          }
        }
      };
      xhr.open("GET", "/check-username/?username=" + encodeURIComponent(usernameInput.value), true);
      xhr.send();
    });
  };

  // Function to check if all fields are filled and valid
  var checkValidation = () => {
    return (
      firstNameInput.value !== "" &&
      lastNameInput.value !== "" &&
      usernameInput.value !== "" &&
      isValidUsername() &&
      emailInput.value !== "" &&
      isValidEmail() &&
      passwordInput.value !== "" &&
      confirmPasswordInput.value !== "" &&
      passwordMatch()
    );
  };

  // Event listener for form inputs
  signupForm.addEventListener("input", () => {
    toggleSignupButton();
  });

  // Event listener for form submission
  signupForm.addEventListener("submit", (event) => {
    event.preventDefault(); // Prevent form submission

    if (checkValidation()) {
      // Perform email and username availability checks
      Promise.all([isEmailAvailable(), isUsernameAvailable()])
        .then((results) => {
          // If both email and username are available, submit the form
          if (results.every((result) => result === true)) {
            signupForm.submit();
          }
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    }
  });
});
