// Navigation functionality

document.addEventListener('DOMContentLoaded', function() {
    // Mobile navigation toggle
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            hamburger.classList.toggle('active');
        });

        // Close menu when clicking on a link
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                hamburger.classList.remove('active');
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
                navMenu.classList.remove('active');
                hamburger.classList.remove('active');
            }
        });
    }

    // Highlight active navigation
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        const linkPage = link.getAttribute('href');
        if (linkPage === currentPage || (currentPage === '' && linkPage === 'index.html')) {
            link.classList.add('active');
        }
    });

    // Initialize cart display
    if (typeof cart !== 'undefined') {
        cart.updateCartDisplay();
    }

    // Initialize auth display
    if (typeof auth !== 'undefined') {
        auth.updateAuthDisplay();
    }
});

// Smooth scrolling for anchor links
document.addEventListener('click', function(e) {
    if (e.target.tagName === 'A' && e.target.getAttribute('href').startsWith('#')) {
        e.preventDefault();
        const target = document.querySelector(e.target.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    }
});

// Add loading states
function showLoading(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.innerHTML = '<div class="loading">Loading...</div>';
    }
}

// Utility functions
function formatPrice(price) {
    return `$${price.toFixed(2)}`;
}

function formatRating(rating) {
    return `⭐ ${rating}`;
}

// Page-specific initializations
function initializePage() {
    const page = window.location.pathname.split('/').pop() || 'index.html';
    
    switch(page) {
        case 'learn.html':
            loadProducts('learn');
            break;
        case 'shop.html':
            loadProducts('shop');
            break;
        case 'materials.html':
            loadProducts('materials');
            break;
        case 'product.html':
            loadProductDetail();
            break;
        case 'cart.html':
            if (typeof cart !== 'undefined') {
                cart.renderCartPage();
            }
            break;
    }
}

// Initialize page when DOM is loaded
document.addEventListener('DOMContentLoaded', initializePage);