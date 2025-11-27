// Admin Panel Functions

document.addEventListener('DOMContentLoaded', function() {
    displayActiveCodes();
    createMagicalElements();
});

function generateCode(event) {
    event.preventDefault();
    
    const email = document.getElementById('studentEmail').value;
    const grade = document.getElementById('studentGrade').value;
    
    // Generate unique activation code
    const code = generateUniqueCode();
    
    // Get existing codes
    const codes = JSON.parse(localStorage.getItem('activationCodes') || '[]');
    
    // Add new code
    const newCode = {
        code: code,
        email: email,
        grade: parseInt(grade),
        createdAt: new Date().toISOString(),
        used: false
    };
    
    codes.push(newCode);
    localStorage.setItem('activationCodes', JSON.stringify(codes));
    
    // Display generated code
    document.getElementById('codeText').textContent = code;
    document.getElementById('generatedCode').style.display = 'block';
    
    // Reset form
    event.target.reset();
    
    // Refresh active codes list
    displayActiveCodes();
    
    // Add magical effect
    const codeDisplay = document.querySelector('.code-display');
    codeDisplay.classList.add('spell-cast');
    setTimeout(() => codeDisplay.classList.remove('spell-cast'), 600);
}

function generateUniqueCode() {
    const prefix = 'MAGIC';
    const numbers = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    const suffix = String.fromCharCode(65 + Math.floor(Math.random() * 26)) + 
                   String.fromCharCode(65 + Math.floor(Math.random() * 26));
    return `${prefix}${numbers}${suffix}`;
}

function copyCode() {
    const codeText = document.getElementById('codeText').textContent;
    navigator.clipboard.writeText(codeText).then(() => {
        const copyBtn = document.querySelector('.copy-btn');
        const originalText = copyBtn.textContent;
        copyBtn.textContent = '✅ Copied!';
        copyBtn.style.background = 'var(--magical-green)';
        
        setTimeout(() => {
            copyBtn.textContent = originalText;
            copyBtn.style.background = 'var(--mystical-teal)';
        }, 2000);
    });
}

function displayActiveCodes() {
    const codes = JSON.parse(localStorage.getItem('activationCodes') || '[]');
    const codesList = document.getElementById('codesList');
    
    if (codes.length === 0) {
        codesList.innerHTML = '<div class="no-codes">No activation codes generated yet. Create one above! 🎭</div>';
        return;
    }
    
    codesList.innerHTML = codes.map(code => `
        <div class="code-item">
            <div class="code-details">
                <div class="code-email">${code.email}</div>
                <div class="code-grade">Grade ${code.grade} • Created ${new Date(code.createdAt).toLocaleDateString()}</div>
            </div>
            <div class="code-value">${code.code}</div>
        </div>
    `).join('');
}

function createMagicalElements() {
    // Add floating magical elements
    const container = document.querySelector('.admin-container');
    if (!container) return;
    
    for (let i = 0; i < 3; i++) {
        const sparkle = document.createElement('div');
        sparkle.textContent = ['⭐', '✨', '🌟'][i];
        sparkle.style.cssText = `
            position: absolute;
            font-size: 1.5rem;
            animation: float ${6 + i * 2}s ease-in-out infinite;
            top: ${20 + i * 30}%;
            left: ${10 + i * 30}%;
            pointer-events: none;
            z-index: 1;
        `;
        container.appendChild(sparkle);
    }
}