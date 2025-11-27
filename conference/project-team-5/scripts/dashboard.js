// Dashboard Functions

document.addEventListener('DOMContentLoaded', function() {
    checkAuth();
    loadDashboard();
    createMagicalElements();
});

function checkAuth() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
    if (!currentUser || !currentUser.activated) {
        window.location.href = 'index.html';
        return;
    }
    
    // Display user info
    document.getElementById('studentName').textContent = currentUser.name;
    document.getElementById('gradeLevel').textContent = currentUser.grade;
    document.getElementById('wizardLevel').textContent = getWizardLevel(currentUser.grade);
}

function getWizardLevel(grade) {
    const levels = {
        4: 'Apprentice Wizard',
        5: 'Junior Wizard',
        6: 'Advanced Wizard'
    };
    return levels[grade] || 'Young Wizard';
}

function loadDashboard() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    loadProgress(currentUser.progress);
    loadSubjects(currentUser.grade);
}

function loadProgress(progress) {
    const progressGrid = document.getElementById('progressGrid');
    const subjects = getSubjectsForGrade();
    
    progressGrid.innerHTML = subjects.map(subject => {
        const subjectProgress = progress[subject.id] || { unitsCompleted: 0, totalUnits: subject.units.length, lessonsCompleted: 0 };
        const percentage = Math.round((subjectProgress.unitsCompleted / subjectProgress.totalUnits) * 100);
        
        return `
            <div class="progress-card">
                <h4>${subject.icon} ${subject.name}</h4>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${percentage}%"></div>
                </div>
                <div class="progress-text">${subjectProgress.unitsCompleted}/${subjectProgress.totalUnits} chapters completed</div>
            </div>
        `;
    }).join('');
}

function loadSubjects(grade) {
    const subjectsGrid = document.getElementById('subjectsGrid');
    const subjects = getSubjectsForGrade(grade);
    
    subjectsGrid.innerHTML = subjects.map(subject => `
        <a href="subject.html?subject=${subject.id}" class="subject-card">
            <span class="subject-icon">${subject.icon}</span>
            <h3 class="subject-title">${subject.name}</h3>
            <p class="subject-description">${subject.description}</p>
            <div class="subject-stats">
                <span class="subject-lessons">${subject.units.length} Magical Chapters</span>
                <span class="subject-progress">Start Learning</span>
            </div>
        </a>
    `).join('');
}

function getSubjectsForGrade(grade) {
    return [
        {
            id: 'mathematics',
            name: 'Mathematics',
            icon: '📐',
            description: 'Master the magical arts of numbers, shapes, and problem-solving spells!',
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
            description: 'Discover the magical secrets of our world through experiments and exploration!',
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
            description: 'Master the art of magical storytelling, reading, and communication spells!',
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
            description: 'Learn the beautiful language of Arabic with magical lessons and activities!',
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
            description: 'Explore magical lands, cultures, and the history of our wonderful world!',
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
            description: 'Express your magical creativity through colors, shapes, and artistic spells!',
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

function createMagicalElements() {
    // Add floating magical elements to dashboard
    const container = document.querySelector('.dashboard-container');
    if (!container) return;
    
    const magicalElements = ['🦋', '🍄', '🌙', '⚡', '🔮'];
    
    for (let i = 0; i < 5; i++) {
        const element = document.createElement('div');
        element.textContent = magicalElements[i];
        element.style.cssText = `
            position: absolute;
            font-size: 1.5rem;
            animation: magicalFloat ${8 + i * 2}s ease-in-out infinite;
            top: ${Math.random() * 80 + 10}%;
            left: ${Math.random() * 80 + 10}%;
            pointer-events: none;
            z-index: 1;
            opacity: 0.6;
        `;
        container.appendChild(element);
    }
}

// Add magical floating animation
const magicalFloatStyle = document.createElement('style');
magicalFloatStyle.textContent = `
    @keyframes magicalFloat {
        0%, 100% { 
            transform: translateY(0px) rotate(0deg); 
            opacity: 0.6; 
        }
        50% { 
            transform: translateY(-30px) rotate(180deg); 
            opacity: 1; 
        }
    }
`;
document.head.appendChild(magicalFloatStyle);