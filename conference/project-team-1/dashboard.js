// Dashboard functionality for AutiConnect VR

document.addEventListener('DOMContentLoaded', function() {
    initializeDashboard();
});

function initializeDashboard() {
    // Check authentication
    const userType = localStorage.getItem('userType');
    const userName = localStorage.getItem('userName');
    
    if (!userType || !userName) {
        window.location.href = 'login.html';
        return;
    }
    
    // Update user name in dashboard
    const userNameElement = document.getElementById('userName');
    if (userNameElement) {
        userNameElement.textContent = userName;
    }
    
    // Load dashboard-specific functionality
    if (window.location.pathname.includes('parent-dashboard')) {
        initializeParentDashboard();
    } else if (window.location.pathname.includes('doctor-dashboard')) {
        initializeDoctorDashboard();
    } else if (window.location.pathname.includes('session')) {
        initializeSessionView();
    }
    
    // Initialize real-time updates
    startRealTimeUpdates();
}

function initializeParentDashboard() {
    // Load child's recent notifications
    loadNotifications();
    
    // Update progress bars with animation
    setTimeout(() => {
        animateProgressBars();
    }, 500);
    
    // Simulate live heart rate updates
    simulateHeartRateUpdates();
}

function initializeDoctorDashboard() {
    // Set default selected patient
    selectPatient('emma');
    
    // Load patient data
    loadPatientData();
}

function initializeSessionView() {
    // Start heart rate animation
    startHeartRateAnimation();
    
    // Load session timeline
    loadSessionTimeline();
}

function loadNotifications() {
    const notifications = [
        {
            time: 'Today, 2:45 PM',
            message: 'Emma completed the "Ordering at a Café" scenario with excellent performance! Stress levels remained low throughout.',
            type: 'success'
        },
        {
            time: 'Jan 28, 3:20 PM',
            message: 'High stress detected during playground scenario. Session was automatically paused for Emma\'s comfort.',
            type: 'warning'
        },
        {
            time: 'Jan 27, 10:15 AM',
            message: 'Dr. Martinez has updated Emma\'s therapy plan. New scenarios have been added to her program.',
            type: 'info'
        }
    ];
    
    const notificationsList = document.getElementById('notificationsList');
    if (notificationsList) {
        notificationsList.innerHTML = '';
        notifications.forEach(notification => {
            const notificationElement = createNotificationElement(notification);
            notificationsList.appendChild(notificationElement);
        });
    }
}

function createNotificationElement(notification) {
    const div = document.createElement('div');
    div.className = `notification ${notification.type === 'warning' ? 'high-stress' : ''}`;
    div.innerHTML = `
        <div class="notification-time">${notification.time}</div>
        <div class="notification-message">${notification.message}</div>
    `;
    return div;
}

function animateProgressBars() {
    document.querySelectorAll('.progress-fill').forEach(bar => {
        const width = bar.style.width;
        bar.style.width = '0%';
        setTimeout(() => {
            bar.style.width = width;
        }, 100);
    });
}

function simulateHeartRateUpdates() {
    setInterval(() => {
        const heartRateElements = document.querySelectorAll('.meta-value');
        heartRateElements.forEach(element => {
            if (element.textContent.includes('BPM')) {
                const currentRate = parseInt(element.textContent);
                const variation = Math.floor(Math.random() * 6) - 3; // ±3 BPM
                const newRate = Math.max(65, Math.min(95, currentRate + variation));
                element.textContent = `${newRate} BPM`;
            }
        });
    }, 5000);
}

function selectPatient(patientId) {
    // Update selected patient highlighting
    document.querySelectorAll('.patient-card').forEach(card => {
        card.style.borderColor = 'var(--gray-200)';
        card.style.background = 'white';
    });
    
    // Highlight selected patient
    const selectedCard = document.querySelector(`[onclick="selectPatient('${patientId}')"]`);
    if (selectedCard) {
        selectedCard.style.borderColor = 'var(--primary-500)';
        selectedCard.style.background = 'var(--primary-50)';
    }
    
    // Load patient data
    loadPatientDetails(patientId);
}

function loadPatientDetails(patientId) {
    const demoData = JSON.parse(localStorage.getItem('demoData') || '{}');
    const patient = demoData.patients?.find(p => p.id === patientId);
    
    if (patient) {
        // Update patient name
        const patientNameElement = document.getElementById('selectedPatientName');
        if (patientNameElement) {
            patientNameElement.textContent = patient.name;
        }
        
        // Update patient details
        const detailsContainer = document.getElementById('patientDetails');
        if (detailsContainer) {
            const stressClass = `stress-${patient.currentStressLevel}`;
            detailsContainer.innerHTML = `
                <div class="session-meta">
                    <div class="meta-item">
                        <h4>Current Stress Level</h4>
                        <div class="stress-indicator ${stressClass}">
                            <span class="stress-dot"></span>
                            ${patient.currentStressLevel.charAt(0).toUpperCase() + patient.currentStressLevel.slice(1)}
                        </div>
                    </div>
                    <div class="meta-item">
                        <h4>Last Session</h4>
                        <div class="meta-value">Today, 2:30 PM</div>
                    </div>
                    <div class="meta-item">
                        <h4>Average Heart Rate</h4>
                        <div class="meta-value">${patient.averageHeartRate} BPM</div>
                    </div>
                    <div class="meta-item">
                        <h4>Session Success Rate</h4>
                        <div class="meta-value">${patient.progressScore}%</div>
                    </div>
                </div>
            `;
        }
    }
}

function loadPatientData() {
    // This would typically load from a backend API
    // For demo purposes, we're using localStorage
    const demoData = JSON.parse(localStorage.getItem('demoData') || '{}');
    
    if (demoData.patients) {
        updatePatientCards(demoData.patients);
    }
}

function updatePatientCards(patients) {
    // This function would update patient cards with real data
    // For now, the data is hardcoded in the HTML
}

function startHeartRateAnimation() {
    // Enhanced heart rate animation for session view
    const heartRateLine = document.querySelector('.heart-rate-line');
    if (heartRateLine) {
        let phase = 0;
        setInterval(() => {
            phase += 0.1;
            const offset = Math.sin(phase) * 20;
            heartRateLine.style.transform = `translateY(${offset}px)`;
        }, 100);
    }
}

function loadSessionTimeline() {
    // Session timeline is hardcoded for demo
    // In a real app, this would load from session data
}

function startRealTimeUpdates() {
    // Simulate real-time dashboard updates
    setInterval(() => {
        updateLiveMetrics();
    }, 10000); // Update every 10 seconds
}

function updateLiveMetrics() {
    // Simulate small changes in metrics
    const metricElements = document.querySelectorAll('.stat-number');
    metricElements.forEach(element => {
        if (element.textContent.includes('%')) {
            const currentValue = parseInt(element.textContent);
            const change = Math.random() > 0.5 ? 1 : -1;
            const newValue = Math.max(0, Math.min(100, currentValue + change));
            element.textContent = `${newValue}%`;
        }
    });
}

// Stress monitoring simulation
function simulateStressAlert() {
    setTimeout(() => {
        if (Math.random() > 0.7) {
            showStressAlert();
        }
    }, Math.random() * 30000 + 10000); // Random time between 10-40 seconds
}

function showStressAlert() {
    const alertDiv = document.createElement('div');
    alertDiv.className = 'notification high-stress';
    alertDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 9999;
        max-width: 350px;
        animation: slideInRight 0.3s ease;
    `;
    
    alertDiv.innerHTML = `
        <div class="notification-time">Just now</div>
        <div class="notification-message">
            ⚠️ Elevated stress detected in current session. Consider taking a break.
        </div>
    `;
    
    document.body.appendChild(alertDiv);
    
    // Auto-remove after 8 seconds
    setTimeout(() => {
        alertDiv.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            alertDiv.remove();
        }, 300);
    }, 8000);
}

// Start stress monitoring simulation
if (window.location.pathname.includes('dashboard')) {
    simulateStressAlert();
}

// Add CSS for slide animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Global logout function
function logout() {
    localStorage.removeItem('userType');
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
    window.location.href = 'index.html';
}

// Add logout function to window object for onclick handlers
window.logout = logout;