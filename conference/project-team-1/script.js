// Main JavaScript functionality for AutiConnect VR website

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    // Check if user is already logged in
    const userType = localStorage.getItem('userType');
    const userName = localStorage.getItem('userName');
    
    if (userType && userName) {
        // User is logged in, redirect to appropriate dashboard
        if (window.location.pathname === '/login.html' || window.location.pathname === '/register.html') {
            redirectToDashboard(userType);
        }
    }
    
    // Initialize smooth scrolling for anchor links
    initializeSmoothScroll();
    
    // Initialize any animations
    initializeAnimations();
}

function redirectToDashboard(userType) {
    if (userType === 'parent') {
        window.location.href = 'parent-dashboard.html';
    } else if (userType === 'doctor') {
        window.location.href = 'doctor-dashboard.html';
    }
}

function initializeSmoothScroll() {
    // Add smooth scrolling to all anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
}

function initializeAnimations() {
    // Add fade-in animation to elements when they come into view
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
            }
        });
    }, observerOptions);

    // Observe all feature sections
    document.querySelectorAll('.feature-section, .step-card').forEach(el => {
        observer.observe(el);
    });
}

// Utility function to format dates
function formatDate(date) {
    const now = new Date();
    const sessionDate = new Date(date);
    const diffTime = Math.abs(now - sessionDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) {
        return 'Today';
    } else if (diffDays === 2) {
        return 'Yesterday';
    } else {
        return sessionDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
}

// Utility function to generate random heart rate data
function generateHeartRateData(duration = 12) {
    const data = [];
    const baseRate = 75;
    
    for (let i = 0; i <= duration; i++) {
        const variation = Math.sin(i * 0.5) * 10 + Math.random() * 8 - 4;
        data.push({
            time: i,
            rate: Math.round(baseRate + variation)
        });
    }
    
    return data;
}

// Show notification function
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type === 'error' ? 'high-stress' : ''}`;
    notification.innerHTML = `
        <div class="notification-time">Just now</div>
        <div class="notification-message">${message}</div>
    `;
    
    // Add to notifications list if it exists
    const notificationsList = document.getElementById('notificationsList');
    if (notificationsList) {
        notificationsList.insertBefore(notification, notificationsList.firstChild);
    } else {
        // Create a temporary notification overlay
        notification.style.position = 'fixed';
        notification.style.top = '20px';
        notification.style.right = '20px';
        notification.style.zIndex = '9999';
        notification.style.maxWidth = '300px';
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 5000);
    }
}

// Simulate real-time stress monitoring
function simulateStressMonitoring() {
    setInterval(() => {
        const stressLevel = Math.random();
        
        if (stressLevel > 0.8) {
            showNotification('High stress detected in current session. Consider taking a break.', 'error');
        } else if (stressLevel > 0.6) {
            showNotification('Elevated stress levels detected. Monitoring closely.', 'warning');
        }
    }, 30000); // Check every 30 seconds
}

// Initialize stress monitoring if on dashboard pages
if (window.location.pathname.includes('dashboard') || window.location.pathname.includes('session')) {
    setTimeout(simulateStressMonitoring, 5000); // Start after 5 seconds
}

// Global logout function
function logout() {
    localStorage.removeItem('userType');
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
    window.location.href = 'index.html';
}