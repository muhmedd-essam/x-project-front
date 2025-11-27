// Magical Animations and Effects

document.addEventListener('DOMContentLoaded', function() {
    initializeMagicalEffects();
});

function initializeMagicalEffects() {
    createDynamicStars();
    addMagicalHovers();
    createFloatingSparkles();
}

function createDynamicStars() {
    const starsContainer = document.querySelector('.stars');
    if (!starsContainer) return;
    
    // Create individual twinkling stars
    for (let i = 0; i < 50; i++) {
        const star = document.createElement('div');
        star.className = 'dynamic-star';
        star.style.cssText = `
            position: absolute;
            width: 2px;
            height: 2px;
            background: white;
            border-radius: 50%;
            top: ${Math.random() * 100}%;
            left: ${Math.random() * 100}%;
            animation: starTwinkle ${2 + Math.random() * 4}s ease-in-out infinite;
            animation-delay: ${Math.random() * 2}s;
        `;
        starsContainer.appendChild(star);
    }
}

function addMagicalHovers() {
    // Add magical effects to buttons
    document.addEventListener('mouseover', function(e) {
        if (e.target.classList.contains('magic-btn') || 
            e.target.classList.contains('subject-card') ||
            e.target.classList.contains('unit-card')) {
            e.target.style.filter = 'brightness(1.1)';
            createSparkleEffect(e.target);
        }
    });
    
    document.addEventListener('mouseout', function(e) {
        if (e.target.classList.contains('magic-btn') || 
            e.target.classList.contains('subject-card') ||
            e.target.classList.contains('unit-card')) {
            e.target.style.filter = '';
        }
    });
}

function createSparkleEffect(element) {
    const sparkle = document.createElement('div');
    sparkle.textContent = '✨';
    sparkle.style.cssText = `
        position: absolute;
        top: -10px;
        right: -10px;
        font-size: 1.2rem;
        animation: sparkleEffect 1s ease-out forwards;
        pointer-events: none;
        z-index: 100;
    `;
    
    element.style.position = 'relative';
    element.appendChild(sparkle);
    
    setTimeout(() => sparkle.remove(), 1000);
}

function createFloatingSparkles() {
    const body = document.body;
    
    setInterval(() => {
        const sparkle = document.createElement('div');
        sparkle.textContent = ['✨', '⭐', '🌟'][Math.floor(Math.random() * 3)];
        sparkle.style.cssText = `
            position: fixed;
            top: ${Math.random() * 100}vh;
            left: ${Math.random() * 100}vw;
            font-size: 1rem;
            pointer-events: none;
            z-index: 1;
            animation: fadeInOut 3s ease-in-out;
        `;
        
        body.appendChild(sparkle);
        setTimeout(() => sparkle.remove(), 3000);
    }, 5000);
}

// Add CSS animations
const animationStyles = document.createElement('style');
animationStyles.textContent = `
    @keyframes starTwinkle {
        0%, 100% { opacity: 0.3; transform: scale(1); }
        50% { opacity: 1; transform: scale(1.2); }
    }
    
    @keyframes sparkleEffect {
        0% { 
            transform: translateY(0) scale(1); 
            opacity: 1; 
        }
        100% { 
            transform: translateY(-30px) scale(1.5); 
            opacity: 0; 
        }
    }
    
    @keyframes fadeInOut {
        0% { opacity: 0; transform: scale(0.5); }
        50% { opacity: 1; transform: scale(1); }
        100% { opacity: 0; transform: scale(0.5); }
    }
    
    @keyframes magicalPulse {
        0%, 100% { 
            box-shadow: 0 0 20px rgba(245, 158, 11, 0.3); 
        }
        50% { 
            box-shadow: 0 0 40px rgba(245, 158, 11, 0.6), 0 0 60px rgba(245, 158, 11, 0.2); 
        }
    }
    
    .magical-hover {
        transition: all 0.3s ease;
    }
    
    .magical-hover:hover {
        animation: magicalPulse 1.5s ease-in-out infinite;
    }
`;
document.head.appendChild(animationStyles);

// Add magical cursor effect
document.addEventListener('mousemove', function(e) {
    if (Math.random() > 0.95) { // Random sparkle trail
        const trail = document.createElement('div');
        trail.textContent = '✨';
        trail.style.cssText = `
            position: fixed;
            top: ${e.clientY}px;
            left: ${e.clientX}px;
            font-size: 0.8rem;
            pointer-events: none;
            z-index: 1000;
            animation: trailEffect 1s ease-out forwards;
        `;
        
        document.body.appendChild(trail);
        setTimeout(() => trail.remove(), 1000);
    }
});

// Add trail effect animation
const trailStyle = document.createElement('style');
trailStyle.textContent = `
    @keyframes trailEffect {
        0% { 
            opacity: 1; 
            transform: scale(1) rotate(0deg); 
        }
        100% { 
            opacity: 0; 
            transform: scale(0.3) rotate(180deg) translateY(-20px); 
        }
    }
`;
document.head.appendChild(trailStyle);