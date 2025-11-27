// Authentication System

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    initializeAuth();
    createMagicalElements();
});

function initializeAuth() {
    // Check if user is already logged in
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
    if (currentUser) {
        if (currentUser.activated) {
            window.location.href = 'dashboard.html';
        } else {
            showActivation();
        }
    }
}

function showLogin() {
    document.querySelectorAll('.auth-form').forEach(form => form.classList.remove('active'));
    document.querySelectorAll('.auth-btn').forEach(btn => btn.classList.remove('active'));
    
    document.getElementById('loginForm').classList.add('active');
    event.target.classList.add('active');
}

function showRegister() {
    document.querySelectorAll('.auth-form').forEach(form => form.classList.remove('active'));
    document.querySelectorAll('.auth-btn').forEach(btn => btn.classList.remove('active'));
    
    document.getElementById('registerForm').classList.add('active');
    event.target.classList.add('active');
}

function showActivation() {
    document.querySelectorAll('.auth-form').forEach(form => form.classList.remove('active'));
    document.getElementById('activationForm').classList.add('active');
}

function handleLogin(event) {
    event.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    // Get users from localStorage
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
        localStorage.setItem('currentUser', JSON.stringify(user));
        
        if (user.activated) {
            showSuccessMessage('Welcome back, young wizard! 🎉');
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 1500);
        } else {
            showActivation();
        }
    } else {
        showErrorMessage('Invalid credentials. Please check your magical spell! 🔮');
    }
}

function handleRegister(event) {
    event.preventDefault();
    
    const name = document.getElementById('regName').value;
    const email = document.getElementById('regEmail').value;
    const password = document.getElementById('regPassword').value;
    const grade = document.getElementById('regGrade').value;
    
    // Get existing users
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    // Check if user already exists
    if (users.find(u => u.email === email)) {
        showErrorMessage('A wizard with this email already exists! 🧙‍♂️');
        return;
    }
    
    // Create new user
    const newUser = {
        id: Date.now().toString(),
        name,
        email,
        password,
        grade: parseInt(grade),
        activated: false,
        createdAt: new Date().toISOString(),
        progress: initializeProgress()
    };
    
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    localStorage.setItem('currentUser', JSON.stringify(newUser));
    
    showSuccessMessage('Welcome to Magilearn Academy! 🎓');
    setTimeout(() => {
        showActivation();
    }, 1500);
}

function handleActivation(event) {
    event.preventDefault();
    
    const code = document.getElementById('activationCode').value.toUpperCase();
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    
    // Get activation codes
    const codes = JSON.parse(localStorage.getItem('activationCodes') || '[]');
    const validCode = codes.find(c => c.code === code && c.email === currentUser.email);
    
    if (validCode) {
        // Activate user
        currentUser.activated = true;
        currentUser.activatedAt = new Date().toISOString();
        
        // Update user in users array
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const userIndex = users.findIndex(u => u.id === currentUser.id);
        if (userIndex !== -1) {
            users[userIndex] = currentUser;
            localStorage.setItem('users', JSON.stringify(users));
        }
        
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        
        // Remove used activation code
        const updatedCodes = codes.filter(c => c.code !== code);
        localStorage.setItem('activationCodes', JSON.stringify(updatedCodes));
        
        showSuccessMessage('Academy unlocked! Welcome, young wizard! ✨');
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 2000);
    } else {
        showErrorMessage('Invalid activation code. Please check with your teacher! 🔑');
    }
}

function initializeProgress() {
    return {
        mathematics: { unitsCompleted: 0, totalUnits: 4, lessonsCompleted: 0 },
        science: { unitsCompleted: 0, totalUnits: 4, lessonsCompleted: 0 },
        arabic: { unitsCompleted: 0, totalUnits: 4, lessonsCompleted: 0 },
        english: { unitsCompleted: 0, totalUnits: 4, lessonsCompleted: 0 },
        social_studies: { unitsCompleted: 0, totalUnits: 4, lessonsCompleted: 0 },
        art: { unitsCompleted: 0, totalUnits: 3, lessonsCompleted: 0 }
    };
}

function logout() {
    localStorage.removeItem('currentUser');
    showSuccessMessage('Goodbye, young wizard! See you soon! 👋');
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 1500);
}

function showSuccessMessage(message) {
    showMessage(message, 'success');
}

function showErrorMessage(message) {
    showMessage(message, 'error');
}

function showMessage(message, type) {
    // Remove existing messages
    const existingMessage = document.querySelector('.message-popup');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    const messageEl = document.createElement('div');
    messageEl.className = `message-popup ${type}`;
    messageEl.innerHTML = `
        <div class="message-content">
            <span class="message-icon">${type === 'success' ? '✨' : '⚠️'}</span>
            <p>${message}</p>
        </div>
    `;
    
    // Add styles
    messageEl.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 1000;
        background: ${type === 'success' ? 'rgba(5, 150, 105, 0.9)' : 'rgba(220, 38, 38, 0.9)'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 15px;
        backdrop-filter: blur(10px);
        border: 2px solid ${type === 'success' ? 'var(--magical-green)' : 'var(--danger-red)'};
        animation: slideInRight 0.3s ease-out;
        box-shadow: 0 10px 25px rgba(0,0,0,0.3);
    `;
    
    document.body.appendChild(messageEl);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        if (messageEl) {
            messageEl.style.animation = 'slideOutRight 0.3s ease-in';
            setTimeout(() => messageEl.remove(), 300);
        }
    }, 3000);
}

// Add CSS for message animations
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
    
    .message-content {
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }
    
    .message-icon {
        font-size: 1.2rem;
    }
`;
document.head.appendChild(style);