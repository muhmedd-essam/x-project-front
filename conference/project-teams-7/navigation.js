// Navigation functionality
function createNavigation() {
  const navHTML = `
    <nav class="navbar">
      <div class="nav-content">
        <a href="index.html" class="logo">
          🌱 Binova
        </a>
        <ul class="nav-links" id="navLinks">
          <li><a href="index.html">Home</a></li>
          <li><a href="dashboard.html">Dashboard</a></li>
          <li><a href="recycle.html">Scan and Earn</a></li>
          <li><a href="machines.html">Machines</a></li>
          <li><a href="climate.html">Climate</a></li>
          <li><a href="about.html">About</a></li>
          <li><a href="volunteer.html">Volunteer</a></li>
          <li><a href="login.html" class="btn btn-primary">Login</a></li>
        </ul>
        <button class="mobile-menu-btn" id="mobileMenuBtn">☰</button>
      </div>
    </nav>
  `;
  
  document.body.insertAdjacentHTML('afterbegin', navHTML);
  
  // Mobile menu toggle
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const navLinks = document.getElementById('navLinks');
  
  if (mobileMenuBtn && navLinks) {
    mobileMenuBtn.addEventListener('click', () => {
      navLinks.classList.toggle('active');
    });
  }
  
  // Update login button based on authentication status
  updateNavigation();
}

function updateNavigation() {
  const user = JSON.parse(localStorage.getItem('binovaUser') || 'null');
  const loginLink = document.querySelector('.nav-links a[href="login.html"]');
  
  if (user && loginLink) {
    loginLink.textContent = 'Logout';
    loginLink.href = '#';
    loginLink.addEventListener('click', (e) => {
      e.preventDefault();
      logout();
    });
  }
}

function logout() {
  localStorage.removeItem('binovaUser');
  window.location.href = 'index.html';
}

// Initialize navigation when DOM is loaded
document.addEventListener('DOMContentLoaded', createNavigation);