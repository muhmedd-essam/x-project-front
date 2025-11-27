// Subject Page Functions

document.addEventListener('DOMContentLoaded', function() {
    checkAuth();
    loadSubject();
    createMagicalElements();
});

function checkAuth() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
    if (!currentUser || !currentUser.activated) {
        window.location.href = 'index.html';
        return;
    }
}

function loadSubject() {
    const urlParams = new URLSearchParams(window.location.search);
    const subjectId = urlParams.get('subject');
    
    if (!subjectId) {
        window.location.href = 'dashboard.html';
        return;
    }
    
    const subjects = getSubjects();
    const subject = subjects.find(s => s.id === subjectId);
    
    if (!subject) {
        window.location.href = 'dashboard.html';
        return;
    }
    
    // Update page title and header
    document.title = `Magilearn Academy - ${subject.name}`;
    document.getElementById('subjectTitle').textContent = `${subject.icon} ${subject.name} Spellbook`;
    
    loadUnits(subject, subjectId);
}

function loadUnits(subject, subjectId) {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const progress = currentUser.progress[subjectId] || { unitsCompleted: 0, totalUnits: subject.units.length };
    const unitsGrid = document.getElementById('unitsGrid');
    
    unitsGrid.innerHTML = subject.units.map((unit, index) => {
        const isUnlocked = index === 0 || index <= progress.unitsCompleted;
        const isCompleted = index < progress.unitsCompleted;
        
        return `
            <div class="unit-card ${isUnlocked ? '' : 'locked'}" 
                 onclick="${isUnlocked ? `goToUnit('${subjectId}', '${unit.id}', ${index})` : 'showLockedMessage()'}">
                <div class="unit-header">
                    <span class="unit-icon">${getUnitIcon(unit.id)}</span>
                    <h3 class="unit-title">${unit.name}</h3>
                </div>
                <p class="unit-description">${getUnitDescription(unit.id)}</p>
                <div class="unit-stats">
                    <span class="unit-lessons">${unit.lessons} Lessons</span>
                    <span class="unit-progress ${isCompleted ? 'completed' : (isUnlocked ? 'available' : 'locked')}">
                        ${isCompleted ? '✅ Completed' : (isUnlocked ? '🚀 Start Learning' : '🔒 Locked')}
                    </span>
                </div>
                ${!isUnlocked ? '<span class="lock-icon">🔒</span>' : ''}
            </div>
        `;
    }).join('');
}

function getUnitIcon(unitId) {
    const icons = {
        // Math
        numbers: '🔢',
        geometry: '📐',
        fractions: '🍕',
        measurement: '📏',
        // Science
        plants: '🌱',
        animals: '🦁',
        weather: '🌦️',
        space: '🚀',
        // English
        reading: '📚',
        writing: '✍️',
        grammar: '📝',
        vocabulary: '💭',
        // Arabic
        letters: '🔤',
        words: '📖',
        conversation: '💬',
        // Social Studies
        geography: '🗺️',
        history: '🏛️',
        culture: '🎭',
        community: '🏘️',
        // Art
        drawing: '✏️',
        painting: '🎨',
        crafts: '🖌️'
    };
    return icons[unitId] || '📚';
}

function getUnitDescription(unitId) {
    const descriptions = {
        // Math
        numbers: 'Learn about counting, addition, subtraction, and number patterns!',
        geometry: 'Explore magical shapes, angles, and geometric wonders!',
        fractions: 'Discover how to work with parts and wholes in magical ways!',
        measurement: 'Master the art of measuring length, weight, and time!',
        // Science
        plants: 'Discover how plants grow and what they need to thrive!',
        animals: 'Learn about different animals and their amazing habitats!',
        weather: 'Understand how weather works and predict magical storms!',
        space: 'Journey through the cosmos and explore planets and stars!',
        // English
        reading: 'Develop magical reading skills and comprehension!',
        writing: 'Learn to write amazing stories and express your thoughts!',
        grammar: 'Master the rules that make our language work perfectly!',
        vocabulary: 'Build your word power with exciting new vocabulary!',
        // Arabic
        letters: 'Learn the beautiful Arabic alphabet and letter forms!',
        words: 'Build vocabulary and learn word formation patterns!',
        conversation: 'Practice speaking and listening in Arabic!',
        // Social Studies
        geography: 'Explore different countries, maps, and geographical features!',
        history: 'Travel back in time to learn about amazing historical events!',
        culture: 'Discover the wonderful traditions of different cultures!',
        community: 'Learn about communities and how we work together!',
        // Art
        drawing: 'Learn basic drawing techniques and create amazing artwork!',
        painting: 'Explore colors and painting techniques!',
        crafts: 'Create beautiful crafts and express your creativity!'
    };
    return descriptions[unitId] || 'Embark on a magical learning adventure!';
}

function goToUnit(subjectId, unitId, unitIndex) {
    window.location.href = `lesson.html?subject=${subjectId}&unit=${unitId}&unitIndex=${unitIndex}`;
}

function showLockedMessage() {
    showMessage('🔒 Complete the previous chapter to unlock this one!', 'info');
}

function getSubjects() {
    return [
        {
            id: 'mathematics',
            name: 'Mathematics',
            icon: '📐',
            units: [
                { id: 'numbers', name: 'Number Magic', lessons: 5 },
                { id: 'geometry', name: 'Shape Spells', lessons: 4 },
                { id: 'fractions', name: 'Fraction Potions', lessons: 6 },
                { id: 'measurement', name: 'Measurement Charms', lessons: 4 }
            ]
        },
        {
            id: 'science',
            name: 'Science',
            icon: '🔬',
            units: [
                { id: 'plants', name: 'Plant Magic', lessons: 5 },
                { id: 'animals', name: 'Creature Studies', lessons: 6 },
                { id: 'weather', name: 'Weather Spells', lessons: 4 },
                { id: 'space', name: 'Cosmic Adventures', lessons: 5 }
            ]
        },
        {
            id: 'english',
            name: 'English',
            icon: '📖',
            units: [
                { id: 'reading', name: 'Reading Enchantments', lessons: 6 },
                { id: 'writing', name: 'Writing Spells', lessons: 5 },
                { id: 'grammar', name: 'Grammar Magic', lessons: 4 },
                { id: 'vocabulary', name: 'Word Wizardry', lessons: 5 }
            ]
        },
        {
            id: 'arabic',
            name: 'Arabic',
            icon: '🕌',
            units: [
                { id: 'letters', name: 'Letter Magic', lessons: 6 },
                { id: 'words', name: 'Word Formation', lessons: 5 },
                { id: 'reading', name: 'Reading Adventures', lessons: 4 },
                { id: 'conversation', name: 'Speaking Spells', lessons: 5 }
            ]
        },
        {
            id: 'social_studies',
            name: 'Social Studies',
            icon: '🌍',
            units: [
                { id: 'geography', name: 'World Exploration', lessons: 5 },
                { id: 'history', name: 'Time Travel Tales', lessons: 6 },
                { id: 'culture', name: 'Cultural Magic', lessons: 4 },
                { id: 'community', name: 'Community Spells', lessons: 4 }
            ]
        },
        {
            id: 'art',
            name: 'Art & Creativity',
            icon: '🎨',
            units: [
                { id: 'drawing', name: 'Drawing Enchantments', lessons: 4 },
                { id: 'painting', name: 'Color Magic', lessons: 5 },
                { id: 'crafts', name: 'Creative Spells', lessons: 4 }
            ]
        }
    ];
}

function logout() {
    localStorage.removeItem('currentUser');
    window.location.href = 'index.html';
}

function showMessage(message, type) {
    const messageEl = document.createElement('div');
    messageEl.className = `message-popup ${type}`;
    messageEl.innerHTML = `
        <div class="message-content">
            <span class="message-icon">${type === 'success' ? '✨' : (type === 'error' ? '⚠️' : 'ℹ️')}</span>
            <p>${message}</p>
        </div>
    `;
    
    const bgColor = type === 'success' ? 'rgba(5, 150, 105, 0.9)' : 
                   type === 'error' ? 'rgba(220, 38, 38, 0.9)' : 
                   'rgba(59, 130, 246, 0.9)';
    
    messageEl.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 1000;
        background: ${bgColor};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 15px;
        backdrop-filter: blur(10px);
        animation: slideInRight 0.3s ease-out;
        box-shadow: 0 10px 25px rgba(0,0,0,0.3);
    `;
    
    document.body.appendChild(messageEl);
    
    setTimeout(() => {
        if (messageEl) {
            messageEl.style.animation = 'slideOutRight 0.3s ease-in';
            setTimeout(() => messageEl.remove(), 300);
        }
    }, 3000);
}

function createMagicalElements() {
    const container = document.querySelector('.subject-container');
    if (!container) return;
    
    const magicalElements = ['🦋', '🌟', '✨', '🔮', '🌙'];
    
    for (let i = 0; i < 5; i++) {
        const element = document.createElement('div');
        element.textContent = magicalElements[i];
        element.style.cssText = `
            position: absolute;
            font-size: 1.5rem;
            animation: magicalFloat ${6 + i * 2}s ease-in-out infinite;
            top: ${Math.random() * 70 + 15}%;
            left: ${Math.random() * 80 + 10}%;
            pointer-events: none;
            z-index: 1;
            opacity: 0.7;
        `;
        container.appendChild(element);
    }
}