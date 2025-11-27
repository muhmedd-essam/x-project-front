// Main application logic
class BinovaApp {
    constructor() {
        this.initializeApp();
    }

    initializeApp() {
        // Check if user is logged in and update UI accordingly
        this.checkAuthState();
        
        // Initialize page-specific functionality
        this.initializePageFeatures();
    }

    checkAuthState() {
        const user = JSON.parse(localStorage.getItem('binovaUser') || 'null');
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        
        // Protected pages that require authentication
        const protectedPages = ['dashboard.html'];
        
        if (protectedPages.includes(currentPage) && !user) {
            window.location.href = 'login.html';
            return;
        }
        
        if (user) {
            this.updateUIForLoggedInUser(user);
        }
    }

    updateUIForLoggedInUser(user) {
        // Update any user-specific UI elements
        const userElements = document.querySelectorAll('[data-user-name]');
        userElements.forEach(el => {
            el.textContent = user.name;
        });
    }

    initializePageFeatures() {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        
        switch (currentPage) {
            case 'index.html':
                this.initializeHomePage();
                break;
            case 'dashboard.html':
                this.initializeDashboard();
                break;
            case 'machines.html':
                this.initializeMachinesPage();
                break;
            default:
                break;
        }
    }

    initializeHomePage() {
        // Add any home page specific functionality
        this.animateOnScroll();
    }

    initializeDashboard() {
        // Dashboard-specific initialization is handled in dashboard.html
    }

    initializeMachinesPage() {
        // Machines page-specific initialization is handled in machines.html
    }

    animateOnScroll() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in');
                }
            });
        });

        document.querySelectorAll('.card, .step').forEach(el => {
            observer.observe(el);
        });
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new BinovaApp();
});

// Utility functions
function formatNumber(num) {
    return num.toLocaleString();
}

function calculateCO2Savings(bottles) {
    // Each bottle saves approximately 0.04 kg CO2
    return (bottles * 0.04).toFixed(1);
}

function generateRecyclingCode() {
    return Math.random().toString(36).substr(2, 8).toUpperCase();
}