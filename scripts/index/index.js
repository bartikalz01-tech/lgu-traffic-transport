// Form switching
function showSignup() {
  document.getElementById("loginForm").classList.add("hidden");
  document.getElementById("signupForm").classList.remove("hidden");

  // Update URL without reloading
  history.pushState(null, null, '#signup');

  // Add animation effect
  const container = document.querySelector('.container');
  container.style.animation = 'none';
  setTimeout(() => {
    container.style.animation = 'pulse 0.5s ease';
  }, 10);
}

function showLogin() {
  document.getElementById("signupForm").classList.add("hidden");
  document.getElementById("loginForm").classList.remove("hidden");

  // Update URL without reloading
  history.pushState(null, null, '#login');

  // Add animation effect
  const container = document.querySelector('.container');
  container.style.animation = 'none';
  setTimeout(() => {
    container.style.animation = 'pulse 0.5s ease';
  }, 10);
}

// Password visibility toggle
function togglePassword(inputId, toggleElement) {
  const passwordInput = document.getElementById(inputId);
  const icon = toggleElement.querySelector('i');

  if (passwordInput.type === 'password') {
    passwordInput.type = 'text';
    icon.classList.remove('fa-eye');
    icon.classList.add('fa-eye-slash');
    toggleElement.setAttribute('title', 'Hide password');
  } else {
    passwordInput.type = 'password';
    icon.classList.remove('fa-eye-slash');
    icon.classList.add('fa-eye');
    toggleElement.setAttribute('title', 'Show password');
  }
}

// Role selection with enhanced visuals
function selectRole(role, element) {
  // Remove selected class from all role options
  const allRoleOptions = document.querySelectorAll('.role-option');
  allRoleOptions.forEach(option => {
    option.classList.remove('selected');
    option.style.transform = 'translateY(0)';
  });

  // Add selected class to clicked option with animation
  element.classList.add('selected');
  element.style.transform = 'translateY(-3px)';

  // Set the corresponding radio input as checked
  const radioInput = element.querySelector('input[type="radio"]');
  radioInput.checked = true;

  // Add sound effect (optional)
  const clickSound = new Audio('data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEAQB8AAEAfAAABAAgAZGF0YQ');
  clickSound.volume = 0.1;
  clickSound.play().catch(() => { });
}

// Loading state for buttons
function showLoading(button) {
  // Simple form validation before showing loading
  const form = button.closest('form');
  if (form.checkValidity()) {
    button.classList.add('loading');
    button.innerHTML = '';

    // Simulate API call delay
    setTimeout(() => {
      button.classList.remove('loading');
      button.innerHTML = button.name === 'login' ? 'Login' : 'Create Account';
    }, 2000);
  }
}

// Password strength checker (for signup form)
function checkPasswordStrength(password) {
  let strength = 0;
  if (password.length >= 8) strength++;
  if (/[A-Z]/.test(password)) strength++;
  if (/[0-9]/.test(password)) strength++;
  if (/[^A-Za-z0-9]/.test(password)) strength++;

  return strength;
}

// Check URL hash on page load to show correct form
document.addEventListener('DOMContentLoaded', function () {
  if (window.location.hash === '#signup') {
    showSignup();
  } else {
    showLogin();
  }

  // Auto-select role if form was submitted with error
  const roleInput = document.querySelector('input[name="role"]:checked');
  if (roleInput) {
    const roleOption = roleInput.closest('.role-option');
    if (roleOption) {
      roleOption.classList.add('selected');
    }
  }

  // Add hover effects to role options
  const roleOptions = document.querySelectorAll('.role-option');
  roleOptions.forEach(option => {
    option.addEventListener('mouseenter', function () {
      if (!this.classList.contains('selected')) {
        this.style.transform = 'translateY(-2px)';
      }
    });

    option.addEventListener('mouseleave', function () {
      if (!this.classList.contains('selected')) {
        this.style.transform = 'translateY(0)';
      }
    });
  });

  // Add keyboard navigation
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      if (!document.getElementById('loginForm').classList.contains('hidden')) {
        document.querySelector('input[name="email"]').focus();
      } else {
        document.querySelector('input[name="fullname"]').focus();
      }
    }
  });
});

// Add visual feedback for form interactions
const inputs = document.querySelectorAll('input');

inputs.forEach(input => {
  input.addEventListener('focus', function () {
    this.parentElement.style.transform = 'translateY(-2px)';
  });

  input.addEventListener('blur', function () {
    this.parentElement.style.transform = 'translateY(0)';
  });
});

const signUpForm = document.getElementById("signupForm");

signUpForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const full_name = signUpForm.querySelector('input[name="fullname"]').value;
  const email = signUpForm.querySelector('input[name="email"]').value;
  const pass = signUpForm.querySelector('input[name="password"]').value;
  const role = signUpForm.querySelector('input[name="role"]:checked')?.value;

  if(!role) {
    alert("Please select a role");
    return;
  }

  try {
    const response = await fetch('api/signup.php', {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({
        full_name: full_name,
        email: email,
        pass: pass,
        role: role
      })
    });

    const data = await response.json();

    if(data.status === "success") {
      alert("Account Created Successfully!");

      signUpForm.reset();
      showLogin();
    } else {
      alert("Error creating account");
    }

  } catch(error) {
    console.error("Signup Error:", error);
    alert("Something went wrong.");
  }

});