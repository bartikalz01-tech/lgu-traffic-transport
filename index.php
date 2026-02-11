<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <title>Modern Login & Signup | ALERTARA</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="icon" type="image/x-icon" href="./images/favicon.ico">
  <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">
  <link rel="stylesheet" href="styles/index/index.css">
</head>

<body>

  <div class="background-shapes">
    <div class="shape shape-1"></div>
    <div class="shape shape-2"></div>
    <div class="shape shape-3"></div>
  </div>

  <div class="container">
    <!-- Enhanced Logo -->
    <div class="logo-container">
      <div class="logo">
        <img src="images/tara.png" alt="Alertara Logo" class="logo-image">
        <div class="logo-text">
          <div class="logo-main">ALERTARA</div>
          <div class="logo-sub">Barangay System</div>
        </div>
      </div>
      <div class="logo-tagline">lorem ipsum</div>
    </div>



    <div class="form-container">
      <!-- LOGIN FORM -->
      <form id="loginForm" class="form">
        <div class="form-header">
          <h2>Welcome Back</h2>
          <p>Sign in to continue to your account</p>
        </div>

        <div class="input-group">
          <i class="fas fa-envelope"></i>
          <input type="email" name="email" placeholder="Email Address">
        </div>

        <div class="input-group">
          <i class="fas fa-lock"></i>
          <input type="password" id="loginPassword" name="password" placeholder="Password" required>
          <span class="password-toggle" onclick="togglePassword('loginPassword', this)">
            <i class="fas fa-eye"></i>
          </span>
        </div>

        <div class="extra-links">
          <label class="remember-me">
            <input type="checkbox" name="remember"> Remember me
          </label>
          <a href="#" onclick="alert('Password reset feature would be implemented here')">Forgot password?</a>
        </div>

        <button class="btn" type="submit" name="login" onclick="showLoading(this)">Login</button>

        <div class="toggle">
          Don't have an account? <span onclick="showSignup()">Sign up</span>
        </div>
      </form>

      <!-- SIGNUP FORM -->
      <form id="signupForm" class="form hidden" method="POST" action="">
        <div class="form-header">
          <h2>Create Account</h2>
          <p>Join our platform and get started</p>
        </div>

        <div class="input-group">
          <i class="fas fa-user"></i>
          <input type="text" name="fullname" placeholder="Full Name">
        </div>

        <div class="input-group">
          <i class="fas fa-envelope"></i>
          <input type="email" name="email" placeholder="Email Address" required value="">
        </div>

        <div class="input-group">
          <i class="fas fa-lock"></i>
          <input type="password" id="signupPassword" name="password" placeholder="Create Password" required>
          <span class="password-toggle" onclick="togglePassword('signupPassword', this)">
            <i class="fas fa-eye"></i>
          </span>
        </div>

        <div class="input-group">
          <i class="fas fa-lock"></i>
          <input type="password" id="confirmPassword" name="confirm_password" placeholder="Confirm Password" required>
          <span class="password-toggle" onclick="togglePassword('confirmPassword', this)">
            <i class="fas fa-eye"></i>
          </span>
        </div>

        <div class="input-group">
          <label class="role-label">Select your role:</label>
          <div class="role-options">
            <div class="role-option" onclick="selectRole('employee', this)">
              <i class="fas fa-user-tie"></i>
              <div class="role-text">Employee</div>
              <input type="radio" name="role" value="employee" style="display: none;" required>
            </div>
            <div class="role-option" onclick="selectRole('admin', this)">
              <i class="fas fa-user-shield"></i>
              <div class="role-text">Admin</div>
              <input type="radio" name="role" value="admin" style="display: none;" required>
            </div>
            <div class="role-option" onclick="selectRole('resident', this)">
              <i class="fas fa-home"></i>
              <div class="role-text">Resident</div>
              <input type="radio" name="role" value="resident" style="display: none;" required>
            </div>
          </div>
        </div>

        <button class="btn" type="submit" name="signup">Create Account</button>

        <div class="toggle">
          Already have an account? <span onclick="showLogin()">Login</span>
        </div>
      </form>
    </div>
  </div>

  <script src="scripts/index/index.js"></script>
</body>

</html>