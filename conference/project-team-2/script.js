// Global JavaScript functionality

document.addEventListener('DOMContentLoaded', function() {
    // Mobile Navigation Toggle
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
        });

        // Close menu when clicking on a link
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
            });
        });
    }

    // Volunteer Form Submission
    const volunteerForm = document.getElementById('volunteerForm');
    if (volunteerForm) {
        volunteerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const data = Object.fromEntries(formData);
            
            // Simulate form submission
            showNotification('Thank you for your interest! We\'ll contact you soon.', 'success');
            
            // Reset form
            this.reset();
        });
    }

    // Emergency Button
    const emergencyBtn = document.getElementById('emergencyBtn');
    if (emergencyBtn) {
        emergencyBtn.addEventListener('click', function() {
            showEmergencyAlert();
        });
    }

    // Pill Reminder Button
    const pillReminderBtn = document.getElementById('pillReminderBtn');
    if (pillReminderBtn) {
        pillReminderBtn.addEventListener('click', function() {
            showPillReminder();
        });
    }

    // Animate counters on page load
    animateCounters();

    // Initialize fade-in animations
    initializeFadeInAnimations();
});

function showEmergencyAlert() {
    // Create emergency modal
    const modal = document.createElement('div');
    modal.className = 'emergency-modal';
    modal.innerHTML = `
        <div class="emergency-modal-content">
            <div class="emergency-icon">
                <i class="fas fa-exclamation-triangle"></i>
            </div>
            <h2>Emergency Alert Sent!</h2>
            <p>Emergency services and your emergency contacts have been notified.</p>
            <p><strong>Location:</strong> Current GPS coordinates shared</p>
            <p><strong>Time:</strong> ${new Date().toLocaleTimeString()}</p>
            <button class="btn btn-primary" onclick="closeEmergencyModal()">OK</button>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Auto-close after 5 seconds
    setTimeout(() => {
        closeEmergencyModal();
    }, 5000);
    
    // Play emergency sound simulation
    playEmergencySound();
}

function closeEmergencyModal() {
    const modal = document.querySelector('.emergency-modal');
    if (modal) {
        modal.remove();
    }
}

function showPillReminder() {
    showNotification('💊 Time to take your medication! Remember to take 2 tablets with water.', 'reminder');
    playReminderSound();
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close" onclick="this.parentElement.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}

function playEmergencySound() {
    // Simulate emergency sound with beep pattern
    console.log('🚨 Emergency sound playing...');
    // In a real application, this would play an actual emergency sound
}

function playReminderSound() {
    // Simulate gentle reminder sound
    console.log('🔔 Pill reminder sound playing...');
    // In a real application, this would play a gentle reminder chime
}

function animateCounters() {
    const counters = document.querySelectorAll('.status-value');
    
    counters.forEach(counter => {
        const target = parseInt(counter.textContent.replace(/,/g, ''));
        if (isNaN(target)) return;
        
        const increment = target / 100;
        let current = 0;
        
        const updateCounter = () => {
            if (current < target) {
                current += increment;
                counter.textContent = Math.floor(current).toLocaleString();
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target.toLocaleString();
            }
        };
        
        // Start animation with a delay
        setTimeout(updateCounter, 500);
    });
}

function initializeFadeInAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    const fadeElements = document.querySelectorAll('.fade-in');
    fadeElements.forEach(el => {
        observer.observe(el);
    });
}

// Simulate real-time data updates for dashboard
function simulateRealTimeUpdates() {
    const heartRateElement = document.getElementById('heartRate');
    const temperatureElement = document.getElementById('temperature');
    const stepsElement = document.getElementById('steps');
    
    if (heartRateElement) {
        setInterval(() => {
            const newHeartRate = 70 + Math.floor(Math.random() * 10);
            heartRateElement.textContent = newHeartRate;
        }, 3000);
    }
    
    if (temperatureElement) {
        setInterval(() => {
            const newTemp = (98.0 + Math.random() * 1.2).toFixed(1);
            temperatureElement.textContent = newTemp;
        }, 5000);
    }
    
    if (stepsElement) {
        setInterval(() => {
            const currentSteps = parseInt(stepsElement.textContent.replace(/,/g, ''));
            const newSteps = currentSteps + Math.floor(Math.random() * 5);
            stepsElement.textContent = newSteps.toLocaleString();
        }, 10000);
    }
}

// Start real-time updates if on dashboard page
if (document.getElementById('heartRate')) {
    setTimeout(simulateRealTimeUpdates, 2000);
}