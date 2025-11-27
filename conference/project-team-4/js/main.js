// Global variables
let currentCharacterIndex = 0;
const totalCharacters = 3;

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    initializeAnimations();
    initializeCharacterCarousel();
    initializeScrollAnimations();
});

// Navigation functionality
function initializeNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Close menu when clicking on a link
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }

    // Navbar scroll effect
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 100) {
            navbar.style.background = 'rgba(255, 255, 255, 0.98)';
            navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            navbar.style.boxShadow = 'none';
        }
    });
}

// Character carousel functionality
function initializeCharacterCarousel() {
    updateCharacterDisplay();
}

function nextCharacter() {
    currentCharacterIndex = (currentCharacterIndex + 1) % totalCharacters;
    updateCharacterDisplay();
}

function previousCharacter() {
    currentCharacterIndex = (currentCharacterIndex - 1 + totalCharacters) % totalCharacters;
    updateCharacterDisplay();
}

function currentCharacter(index) {
    currentCharacterIndex = index;
    updateCharacterDisplay();
}

function updateCharacterDisplay() {
    const cards = document.querySelectorAll('.character-card');
    const dots = document.querySelectorAll('.dot');
    
    cards.forEach((card, index) => {
        card.classList.remove('active');
        if (index === currentCharacterIndex) {
            card.classList.add('active');
        }
    });
    
    dots.forEach((dot, index) => {
        dot.classList.remove('active');
        if (index === currentCharacterIndex) {
            dot.classList.add('active');
        }
    });
}

// Auto-rotate characters (optional)
function startCharacterAutoRotate() {
    setInterval(() => {
        nextCharacter();
    }, 5000);
}

// Initialize animations
function initializeAnimations() {
    // Add entrance animations to elements
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
            }
        });
    }, observerOptions);

    // Observe elements for animation
    document.querySelectorAll('.feature-card, .character-card, .platform-card, .hero-card').forEach(el => {
        observer.observe(el);
    });
}

// Scroll animations
function initializeScrollAnimations() {
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const parallax = document.querySelector('.hero-background');
        
        if (parallax) {
            parallax.style.transform = `translateY(${scrolled * 0.5}px)`;
        }
    });
}

// Download game functionality
function downloadGame(platform) {
    // Show loading state
    event.target.innerHTML = 'Preparing download...';
    event.target.disabled = true;
    
    // Simulate download preparation
    setTimeout(() => {
        let downloadUrl = '';
        let message = '';
        
        switch(platform) {
            case 'windows':
                downloadUrl = '#';
                message = 'Windows download would start here';
                break;
            case 'mac':
                downloadUrl = '#';
                message = 'macOS download would start here';
                break;
            case 'mobile':
                downloadUrl = '#';
                message = 'Redirecting to app store...';
                break;
            default:
                message = 'Download not available';
        }
        
        // Reset button
        event.target.innerHTML = event.target.getAttribute('data-original-text') || 'Download';
        event.target.disabled = false;
        
        // Show success message
        showNotification(`${message}`, 'success');
        
        // In a real implementation, you would trigger the actual download here
        console.log(`Downloading for ${platform}: ${downloadUrl}`);
    }, 2000);
}

// Contact form submission
function submitForm(event) {
    event.preventDefault();
    
    const submitButton = event.target.querySelector('.submit-button');
    const originalText = submitButton.innerHTML;
    
    // Show loading state
    submitButton.innerHTML = '<span>Sending...</span>';
    submitButton.disabled = true;
    
    // Simulate form submission
    setTimeout(() => {
        // Reset form
        event.target.reset();
        
        // Reset button
        submitButton.innerHTML = originalText;
        submitButton.disabled = false;
        
        // Show success message
        showNotification('Thank you for your message! We\'ll get back to you soon.', 'success');
    }, 2000);
}

// Notification system
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.classList.add('notification', `notification-${type}`);
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-icon">${getNotificationIcon(type)}</span>
            <span class="notification-message">${message}</span>
            <button class="notification-close" onclick="this.parentElement.parentElement.remove()">×</button>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 24px;
        background: ${type === 'success' ? 'var(--success-green)' : 'var(--primary-blue)'};
        color: white;
        padding: 16px 24px;
        border-radius: 12px;
        box-shadow: var(--shadow-xl);
        z-index: 10000;
        animation: slideInRight 0.5s ease-out;
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.style.animation = 'slideOutRight 0.5s ease-out';
            setTimeout(() => notification.remove(), 500);
        }
    }, 5000);
}

function getNotificationIcon(type) {
    switch(type) {
        case 'success': return '✅';
        case 'error': return '❌';
        case 'warning': return '⚠️';
        default: return 'ℹ️';
    }
}

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Add loading states to buttons
document.querySelectorAll('button').forEach(button => {
    if (!button.getAttribute('data-original-text')) {
        button.setAttribute('data-original-text', button.textContent);
    }
});

// Keyboard navigation support
document.addEventListener('keydown', function(e) {
    if (e.key === 'ArrowLeft') {
        previousCharacter();
    } else if (e.key === 'ArrowRight') {
        nextCharacter();
    }
});

// Initialize auto-rotate for character carousel (uncomment to enable)
// startCharacterAutoRotate();

// CSS animations for notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            opacity: 0;
            transform: translateX(100%);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
    
    @keyframes slideOutRight {
        from {
            opacity: 1;
            transform: translateX(0);
        }
        to {
            opacity: 0;
            transform: translateX(100%);
        }
    }
    
    .notification-content {
        display: flex;
        align-items: center;
        gap: 12px;
    }
    
    .notification-close {
        background: none;
        border: none;
        color: white;
        font-size: 20px;
        cursor: pointer;
        padding: 0;
        margin-left: 12px;
    }
    
    .notification-close:hover {
        opacity: 0.7;
    }
`;
document.head.appendChild(style);

// Performance optimization: Debounce scroll events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Apply debouncing to scroll events
const debouncedScroll = debounce(initializeScrollAnimations, 10);
window.addEventListener('scroll', debouncedScroll);