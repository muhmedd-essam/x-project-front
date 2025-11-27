// Support system functionality

document.addEventListener('DOMContentLoaded', function() {
    // Auto-fill user info if logged in
    const currentUser = getCurrentUser();
    if (currentUser) {
        document.getElementById('name').value = currentUser.name;
        document.getElementById('email').value = currentUser.email;
    }
    
    // Add form submit handler
    document.getElementById('supportForm').addEventListener('submit', handleSupportSubmit);
});

function handleSupportSubmit(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const name = formData.get('name').trim();
    const email = formData.get('email').trim();
    const subject = formData.get('subject').trim();
    const priority = formData.get('priority');
    const category = formData.get('category');
    const message = formData.get('message').trim();
    
    // Validation
    if (!name || !email || !subject || !priority || !category || !message) {
        showToast('Please fill in all fields', 'error');
        return;
    }
    
    if (!email.includes('@')) {
        showToast('Please enter a valid email address', 'error');
        return;
    }
    
    // Create support ticket
    const supportTicket = {
        id: generateId(),
        name,
        email,
        subject,
        priority,
        category,
        message,
        status: 'open',
        createdAt: new Date().toISOString(),
        userId: getCurrentUser() ? getCurrentUser().id : null
    };
    
    // Save support ticket
    saveSupportTicket(supportTicket);
    
    showToast('Support ticket submitted successfully! We\'ll get back to you soon.', 'success');
    
    // Reset form
    event.target.reset();
    
    // Auto-fill user info again if logged in
    const currentUser = getCurrentUser();
    if (currentUser) {
        document.getElementById('name').value = currentUser.name;
        document.getElementById('email').value = currentUser.email;
    }
} 