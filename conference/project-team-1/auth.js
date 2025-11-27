// Authentication JavaScript for AutiConnect VR

document.addEventListener('DOMContentLoaded', function() {
    initializeAuth();
});

function initializeAuth() {
    // Check URL parameters for user type
    const urlParams = new URLSearchParams(window.location.search);
    const userType = urlParams.get('type');
    
    if (userType) {
        const userTypeSelect = document.getElementById('userType');
        if (userTypeSelect) {
            userTypeSelect.value = userType;
        }
    }
    
    // Set up form handlers
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
    }
}

function handleLogin(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const email = formData.get('email');
    const password = formData.get('password');
    const userType = formData.get('userType');
    
    // Validate form
    if (!email || !password || !userType) {
        showAuthError('Please fill in all fields');
        return;
    }
    
    // Simulate login validation
    if (password.length < 6) {
        showAuthError('Invalid credentials');
        return;
    }
    
    // Store user session
    const userName = userType === 'parent' ? 'Sarah Johnson' : 'Dr. Martinez';
    localStorage.setItem('userType', userType);
    localStorage.setItem('userName', userName);
    localStorage.setItem('userEmail', email);
    
    // Show loading state
    const submitBtn = event.target.querySelector('button[type="submit"]');
    submitBtn.textContent = 'Signing in...';
    submitBtn.disabled = true;
    
    // Simulate network delay
    setTimeout(() => {
        redirectToDashboard(userType);
    }, 1500);
}

function handleRegister(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const fullName = formData.get('fullName');
    const email = formData.get('email');
    const password = formData.get('password');
    const confirmPassword = formData.get('confirmPassword');
    const userType = formData.get('userType');
    
    // Validate form
    if (!fullName || !email || !password || !confirmPassword || !userType) {
        showAuthError('Please fill in all fields');
        return;
    }
    
    if (password !== confirmPassword) {
        showAuthError('Passwords do not match');
        return;
    }
    
    if (password.length < 6) {
        showAuthError('Password must be at least 6 characters long');
        return;
    }
    
    // Store user session
    localStorage.setItem('userType', userType);
    localStorage.setItem('userName', fullName);
    localStorage.setItem('userEmail', email);
    
    // Show loading state
    const submitBtn = event.target.querySelector('button[type="submit"]');
    submitBtn.textContent = 'Creating account...';
    submitBtn.disabled = true;
    
    // Simulate network delay
    setTimeout(() => {
        redirectToDashboard(userType);
    }, 1500);
}

function showAuthError(message) {
    // Remove existing error messages
    const existingError = document.querySelector('.auth-error');
    if (existingError) {
        existingError.remove();
    }
    
    // Create error message
    const errorDiv = document.createElement('div');
    errorDiv.className = 'auth-error';
    errorDiv.style.cssText = `
        background: #fef2f2;
        color: #991b1b;
        padding: 12px;
        border-radius: 8px;
        margin-bottom: 16px;
        border: 1px solid #fecaca;
        font-size: 0.875rem;
    `;
    errorDiv.textContent = message;
    
    // Insert error before the form
    const form = document.querySelector('form');
    form.parentNode.insertBefore(errorDiv, form);
    
    // Remove error after 5 seconds
    setTimeout(() => {
        errorDiv.remove();
    }, 5000);
}

function redirectToDashboard(userType) {
    if (userType === 'parent') {
        window.location.href = 'parent-dashboard.html';
    } else if (userType === 'doctor') {
        window.location.href = 'doctor-dashboard.html';
    }
}

// Demo data initialization
function initializeDemoData() {
    if (!localStorage.getItem('demoDataInitialized')) {
        const demoData = {
            patients: [
                {
                    id: 'emma',
                    name: 'Emma Johnson',
                    age: 8,
                    diagnosis: 'Autism Spectrum Disorder',
                    sessionsCompleted: 24,
                    totalSessions: 32,
                    progressScore: 85,
                    currentStressLevel: 'low',
                    averageHeartRate: 78
                },
                {
                    id: 'alex',
                    name: 'Alex Chen',
                    age: 10,
                    diagnosis: 'Autism Spectrum Disorder',
                    sessionsCompleted: 18,
                    totalSessions: 25,
                    progressScore: 72,
                    currentStressLevel: 'medium',
                    averageHeartRate: 82
                },
                {
                    id: 'lily',
                    name: 'Lily Rodriguez',
                    age: 7,
                    diagnosis: 'Autism Spectrum Disorder',
                    sessionsCompleted: 31,
                    totalSessions: 35,
                    progressScore: 91,
                    currentStressLevel: 'low',
                    averageHeartRate: 70
                }
            ],
            sessions: [
                {
                    id: 1,
                    patientId: 'emma',
                    date: '2025-01-29',
                    scenario: 'Ordering at a Café',
                    duration: 12,
                    status: 'completed',
                    averageHeartRate: 78,
                    peakHeartRate: 94,
                    stressLevel: 'low',
                    stressEvents: 0,
                    confidenceScore: 8.5
                },
                {
                    id: 2,
                    patientId: 'emma',
                    date: '2025-01-28',
                    scenario: 'Playground Interaction',
                    duration: 8,
                    status: 'stopped',
                    averageHeartRate: 88,
                    peakHeartRate: 105,
                    stressLevel: 'medium',
                    stressEvents: 2,
                    confidenceScore: 6.0
                }
            ]
        };
        
        localStorage.setItem('demoData', JSON.stringify(demoData));
        localStorage.setItem('demoDataInitialized', 'true');
    }
}

// Initialize demo data when auth page loads
initializeDemoData();