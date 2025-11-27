// Utility functions for the Trusti application

// Generate unique ID
function generateId() {
    return Math.random().toString(36).substr(2, 9);
}

// Format currency
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(amount);
}

// Format date
function formatDate(date) {
    try {
        // Handle invalid or missing date
        if (!date) {
            return 'Unknown date';
        }
        
        const dateObj = new Date(date);
        
        // Check if date is valid
        if (isNaN(dateObj.getTime())) {
            return 'Invalid date';
        }
        
        return new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }).format(dateObj);
    } catch (error) {
        console.error('Error formatting date:', error, date);
        return 'Invalid date';
    }
}

// Format relative time
function formatRelativeTime(date) {
    try {
        // Handle invalid or missing date
        if (!date) {
            return 'Unknown time';
        }
        
        const dateObj = new Date(date);
        
        // Check if date is valid
        if (isNaN(dateObj.getTime())) {
            return 'Invalid time';
        }
        
        const now = new Date();
        const diffInMinutes = Math.floor((now - dateObj) / (1000 * 60));
        
        if (diffInMinutes < 1) return 'Just now';
        if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
        
        const diffInHours = Math.floor(diffInMinutes / 60);
        if (diffInHours < 24) return `${diffInHours}h ago`;
        
        const diffInDays = Math.floor(diffInHours / 24);
        return `${diffInDays}d ago`;
    } catch (error) {
        console.error('Error formatting relative time:', error, date);
        return 'Invalid time';
    }
}

// Toast notification system
function showToast(message, type = 'info', duration = 5000) {
    const toastContainer = document.getElementById('toast-container');
    if (!toastContainer) return;

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    const title = type === 'success' ? 'Success' : 
                  type === 'error' ? 'Error' : 
                  type === 'warning' ? 'Warning' : 'Info';
    
    toast.innerHTML = `
        <div class="toast-header">
            <div class="toast-title">${title}</div>
            <button class="toast-close" onclick="this.parentElement.parentElement.remove()">×</button>
        </div>
        <p class="toast-message">${message}</p>
    `;
    
    toastContainer.appendChild(toast);
    
    // Auto remove after duration
    setTimeout(() => {
        if (toast.parentNode) {
            toast.style.animation = 'slideOut 0.3s ease forwards';
            setTimeout(() => toast.remove(), 300);
        }
    }, duration);
}

// Check authentication
function requireAuth() {
    const currentUser = getCurrentUser();
    if (!currentUser) {
        // Only redirect if we're not already on login or register page
        const currentPage = window.location.pathname;
        if (!currentPage.includes('login.html') && !currentPage.includes('register.html')) {
            window.location.href = 'login.html';
        }
        return false;
    }
    return true;
}

// Get current user from localStorage
function getCurrentUser() {
    const userStr = localStorage.getItem('trusti_current_user');
    return userStr ? JSON.parse(userStr) : null;
}

// Logout function
function logout() {
    localStorage.removeItem('trusti_current_user');
    window.location.href = 'index.html';
}

// Get URL parameter
function getUrlParameter(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

// Countdown timer utility
function createCountdown(targetDate, elementId, onExpire) {
    const element = document.getElementById(elementId);
    if (!element) return;

    function updateCountdown() {
        const now = new Date();
        const target = new Date(targetDate);
        const diff = target - now;

        if (diff <= 0) {
            element.innerHTML = 'Expired';
            if (onExpire) onExpire();
            return;
        }

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

        if (days > 0) {
            element.innerHTML = `${days}d ${hours}h ${minutes}m`;
        } else if (hours > 0) {
            element.innerHTML = `${hours}h ${minutes}m`;
        } else {
            element.innerHTML = `${minutes}m`;
        }
    }

    updateCountdown();
    const interval = setInterval(updateCountdown, 60000); // Update every minute
    
    return interval;
}

// Initialize user greeting
function initializeUserGreeting() {
    const userGreetingElement = document.getElementById('userGreeting');
    const logoutBtn = document.getElementById('logoutBtn');
    
    if (!requireAuth()) return;
    
    const currentUser = getCurrentUser();
    if (userGreetingElement && currentUser) {
        userGreetingElement.textContent = `Welcome, ${currentUser.name}`;
    }
    
    if (logoutBtn) {
        logoutBtn.addEventListener('click', logout);
    }
}

// Auto-check for expired transactions
function checkExpiredTransactions() {
    const transactions = getAllTransactions();
    const now = new Date();
    let hasChanges = false;

    transactions.forEach(transaction => {
        if (transaction.status === 'pending' || transaction.status === 'delivered') {
            const expiryDate = new Date(transaction.expiryDate);
            if (now > expiryDate && transaction.status !== 'expired') {
                transaction.status = 'expired';
                hasChanges = true;
                
                // Show notification
                showToast(
                    `Transaction ${transaction.id} has expired and funds will be refunded.`,
                    'warning'
                );
            }
        }
    });

    if (hasChanges) {
        saveTransactions(transactions);
    }
}

// Initialize common functionality
document.addEventListener('DOMContentLoaded', function() {
    // Only initialize user greeting if we're on a dashboard page
    const isDashboardPage = window.location.pathname.includes('dashboard') || 
                           window.location.pathname.includes('transaction');
    
    if (isDashboardPage) {
        initializeUserGreeting();
        
        // Check for expired transactions every minute
        setInterval(checkExpiredTransactions, 60000);
        checkExpiredTransactions(); // Initial check
    }
});