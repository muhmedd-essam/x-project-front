// Lesson Page Functions

let currentLesson = 0;
let currentUnit = null;
let currentSubject = null;
let unitIndex = 0;
let lessons = [];

document.addEventListener('DOMContentLoaded', function() {
    checkAuth();
    loadLesson();
    createMagicalElements();
});

function checkAuth() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
    if (!currentUser || !currentUser.activated) {
        window.location.href = 'index.html';
        return;
    }
}

function loadLesson() {
    const urlParams = new URLSearchParams(window.location.search);
    currentSubject = urlParams.get('subject');
    currentUnit = urlParams.get('unit');
    unitIndex = parseInt(urlParams.get('unitIndex') || '0');
    
    if (!currentSubject || !currentUnit) {
        window.location.href = 'dashboard.html';
        return;
    }
    
    lessons = generateLessons(currentSubject, currentUnit);
    loadLessonsSidebar();
    loadCurrentLesson();
}

function generateLessons(subjectId, unitId) {
    const lessonTemplates = {
        mathematics: {
            numbers: [
                { title: '🔢 Counting Magic', video: 'video.mp4', quiz: { question: 'What comes after 99?', options: ['100', '90', '109', '98'], correct: 0 }},
                { title: '➕ Addition Spells', video: 'video.mp4', quiz: { question: 'What is 25 + 17?', options: ['42', '41', '43', '40'], correct: 0 }},
                { title: '➖ Subtraction Charms', video: 'video.mp4', quiz: { question: 'What is 84 - 29?', options: ['55', '54', '56', '53'], correct: 0 }},
                { title: '✖️ Multiplication Magic', video: 'video.mp4', quiz: { question: 'What is 7 × 8?', options: ['54', '56', '58', '52'], correct: 1 }},
                { title: '🎯 Number Patterns', video: 'video.mp4', quiz: { question: 'What comes next: 2, 4, 6, 8, ?', options: ['9', '10', '11', '12'], correct: 1 }}
            ]
        },
        science: {
            plants: [
                { title: '🌱 How Plants Grow', video: 'video.mp4', quiz: { question: 'What do plants need to grow?', options: ['Only water', 'Only sunlight', 'Water, sunlight, and air', 'Only soil'], correct: 2 }},
                { title: '🌿 Plant Parts', video: 'video.mp4', quiz: { question: 'Which part of the plant makes food?', options: ['Roots', 'Leaves', 'Stem', 'Flowers'], correct: 1 }},
                { title: '🌸 Flower Power', video: 'video.mp4', quiz: { question: 'What do flowers help plants do?', options: ['Grow taller', 'Make seeds', 'Get water', 'Stay strong'], correct: 1 }},
                { title: '🌳 Tree Magic', video: 'video.mp4', quiz: { question: 'How can you tell how old a tree is?', options: ['By its height', 'By counting rings', 'By its leaves', 'By its bark'], correct: 1 }},
                { title: '🌾 Plant Life Cycle', video: 'video.mp4', quiz: { question: 'What comes first in a plant\'s life?', options: ['Flower', 'Seed', 'Leaves', 'Roots'], correct: 1 }}
            ]
        }
    };
    
    return lessonTemplates[subjectId]?.[unitId] || generateDefaultLessons(unitId);
}

function generateDefaultLessons(unitId) {
    return [
        { title: `📚 Introduction to ${unitId}`, video: 'video.mp4', quiz: { question: 'Are you ready to learn?', options: ['Yes!', 'Absolutely!', 'Let\'s go!', 'I\'m excited!'], correct: 0 }},
        { title: `🎯 ${unitId} Basics`, video: 'video.mp4', quiz: { question: 'What did you learn?', options: ['Something new', 'Many things', 'Exciting facts', 'All of the above'], correct: 3 }},
        { title: `⚡ Advanced ${unitId}`, video: 'video.mp4', quiz: { question: 'How do you feel about this topic?', options: ['Great!', 'Confident!', 'Ready for more!', 'Amazing!'], correct: 0 }},
        { title: `🏆 ${unitId} Mastery`, video: 'video.mp4', quiz: { question: 'You\'ve completed this unit! How was it?', options: ['Fun!', 'Educational!', 'Magical!', 'All of the above'], correct: 3 }}
    ];
}

function loadLessonsSidebar() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const userProgress = getUserProgress(currentUser.id, currentSubject, currentUnit);
    const lessonsList = document.getElementById('lessonsList');
    
    lessonsList.innerHTML = lessons.map((lesson, index) => {
        const isUnlocked = index === 0 || index <= userProgress.currentLesson;
        const isCompleted = index < userProgress.currentLesson;
        const isActive = index === currentLesson;
        
        let statusClass = '';
        if (!isUnlocked) statusClass = 'locked';
        else if (isCompleted) statusClass = 'completed';
        else if (isActive) statusClass = 'active';
        
        return `
            <div class="lesson-item ${statusClass}" onclick="${isUnlocked ? `loadLessonContent(${index})` : ''}">
                <div class="lesson-name">${lesson.title}</div>
                <div class="lesson-status">
                    ${isCompleted ? '✅ Completed' : (isActive ? '▶️ Current' : (isUnlocked ? '📚 Available' : '🔒 Locked'))}
                </div>
            </div>
        `;
    }).join('');
}

function loadCurrentLesson() {
    if (lessons.length === 0) return;
    
    const lesson = lessons[currentLesson];
    document.getElementById('lessonTitle').textContent = lesson.title;
    document.getElementById('lessonNumber').textContent = `Lesson ${currentLesson + 1}`;
    document.getElementById('totalLessons').textContent = lessons.length;
    
    // Show video section, hide quiz
    document.getElementById('videoSection').style.display = 'block';
    document.getElementById('quizSection').style.display = 'none';
    
    // Setup video (using placeholder for demo)
    setupVideoPlayer();
}

function loadLessonContent(lessonIndex) {
    currentLesson = lessonIndex;
    loadCurrentLesson();
    loadLessonsSidebar(); // Refresh sidebar to update active lesson
}

function setupVideoPlayer() {
    const video = document.getElementById('lessonVideo');
    const placeholder = document.getElementById('videoPlaceholder');
    const lesson = lessons[currentLesson];

    // لو في لينك فيديو
    if (lesson.video && lesson.video !== 'placeholder') {
        video.src = lesson.video;
        video.style.display = 'block';
        placeholder.style.display = 'none';

        // لما الفيديو يخلص يجيب الكويز
        video.onended = () => {
            simulateVideoEnd();
        };
    } else {
        // لو مفيش فيديو حقيقي (placeholder)
        video.style.display = 'none';
        placeholder.style.display = 'flex';
    }
}


function simulateVideoEnd() {
    // Hide video section and show quiz
    document.getElementById('videoSection').style.display = 'none';
    document.getElementById('quizSection').style.display = 'block';
    
    // Load quiz content
    loadQuiz();
}

function loadQuiz() {
    const lesson = lessons[currentLesson];
    const quiz = lesson.quiz;
    
    document.getElementById('quizQuestion').textContent = quiz.question;
    
    const optionsContainer = document.getElementById('quizOptions');
    optionsContainer.innerHTML = quiz.options.map((option, index) => `
        <div class="quiz-option" onclick="selectAnswer(${index})">
            ${option}
        </div>
    `).join('');
    
    // Hide result initially
    document.getElementById('quizResult').style.display = 'none';
}

function selectAnswer(selectedIndex) {
    const lesson = lessons[currentLesson];
    const quiz = lesson.quiz;
    const options = document.querySelectorAll('.quiz-option');
    
    // Disable all options
    options.forEach(option => option.style.pointerEvents = 'none');
    
    // Show correct and incorrect answers
    options.forEach((option, index) => {
        if (index === quiz.correct) {
            option.classList.add('correct');
        } else if (index === selectedIndex) {
            option.classList.add('incorrect');
        }
    });
    
    // Show result
    const isCorrect = selectedIndex === quiz.correct;
    showQuizResult(isCorrect);
    
    // Update progress
    updateUserProgress();
}

function showQuizResult(isCorrect) {
    const resultSection = document.getElementById('quizResult');
    const resultIcon = document.getElementById('resultIcon');
    const resultMessage = document.getElementById('resultMessage');
    
    if (isCorrect) {
        resultIcon.textContent = '🎉';
        resultMessage.textContent = 'Fantastic! You\'ve mastered this lesson magic!';
    } else {
        resultIcon.textContent = '🌟';
        resultMessage.textContent = 'Good try! You\'re learning and that\'s what matters!';
    }
    
    resultSection.style.display = 'block';
    resultSection.scrollIntoView({ behavior: 'smooth' });
}

function updateUserProgress() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const userProgress = getUserProgress(currentUser.id, currentSubject, currentUnit);
    
    // Update lesson progress
    if (currentLesson >= userProgress.currentLesson) {
        setUserProgress(currentUser.id, currentSubject, currentUnit, currentLesson + 1);
    }
    
    // Update user's progress in storage
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const userIndex = users.findIndex(u => u.id === currentUser.id);
    if (userIndex !== -1) {
        if (!users[userIndex].progress[currentSubject]) {
            users[userIndex].progress[currentSubject] = { unitsCompleted: 0, totalUnits: 0, lessonsCompleted: 0 };
        }
        users[userIndex].progress[currentSubject].lessonsCompleted++;
        localStorage.setItem('users', JSON.stringify(users));
        
        // Update current user session
        currentUser.progress = users[userIndex].progress;
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
    }
}

function goToNextLesson() {
    if (currentLesson < lessons.length - 1) {
        currentLesson++;
        loadLessonContent(currentLesson);
    } else {
        // Unit completed
        completeUnit();
    }
}

function completeUnit() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    
    // Update unit completion
    if (!currentUser.progress[currentSubject]) {
        currentUser.progress[currentSubject] = { unitsCompleted: 0, totalUnits: 4, lessonsCompleted: 0 };
    }
    
    if (unitIndex >= currentUser.progress[currentSubject].unitsCompleted) {
        currentUser.progress[currentSubject].unitsCompleted = unitIndex + 1;
    }
    
    // Update in storage
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const userIndex = users.findIndex(u => u.id === currentUser.id);
    if (userIndex !== -1) {
        users[userIndex].progress = currentUser.progress;
        localStorage.setItem('users', JSON.stringify(users));
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
    }
    
    showCompletionMessage();
}

function showCompletionMessage() {
    const resultSection = document.getElementById('quizResult');
    resultSection.innerHTML = `
        <div class="result-content">
            <span class="result-icon">🏆</span>
            <p style="font-size: 1.3rem; margin-bottom: 1rem;">Congratulations! You've completed this magical chapter!</p>
            <p style="margin-bottom: 1.5rem;">You've unlocked the next chapter in your learning journey!</p>
            <button class="next-lesson-btn" onclick="goBackToSubject()">🎉 Return to Chapters</button>
        </div>
    `;
}

function goBackToSubject() {
    window.location.href = `subject.html?subject=${currentSubject}`;
}

function goBack() {
    window.location.href = `subject.html?subject=${currentSubject}`;
}

function getUserProgress(userId, subject, unit) {
    const progressKey = `progress_${userId}_${subject}_${unit}`;
    return JSON.parse(localStorage.getItem(progressKey) || '{"currentLesson": 0}');
}

function setUserProgress(userId, subject, unit, lessonIndex) {
    const progressKey = `progress_${userId}_${subject}_${unit}`;
    localStorage.setItem(progressKey, JSON.stringify({ currentLesson: lessonIndex }));
}

function logout() {
    localStorage.removeItem('currentUser');
    window.location.href = 'index.html';
}

function createMagicalElements() {
    // Add floating elements to lesson page
    const container = document.querySelector('.lesson-content');
    if (!container) return;
    
    const elements = ['⭐', '✨', '🌟'];
    
    for (let i = 0; i < 3; i++) {
        const element = document.createElement('div');
        element.textContent = elements[i];
        element.style.cssText = `
            position: absolute;
            font-size: 1.2rem;
            animation: gentleFloat ${5 + i * 2}s ease-in-out infinite;
            top: ${20 + i * 25}%;
            right: ${5 + i * 5}%;
            pointer-events: none;
            z-index: 1;
            opacity: 0.5;
        `;
        container.appendChild(element);
    }
}

// Add gentle floating animation
const gentleFloatStyle = document.createElement('style');
gentleFloatStyle.textContent = `
    @keyframes gentleFloat {
        0%, 100% { 
            transform: translateY(0px) rotate(0deg); 
            opacity: 0.5; 
        }
        50% { 
            transform: translateY(-15px) rotate(90deg); 
            opacity: 0.8; 
        }
    }
`;
document.head.appendChild(gentleFloatStyle);