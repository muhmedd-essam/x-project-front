// Authentication functions

function handleLogin(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const email = formData.get('email').trim();
    const password = formData.get('password');
    
    // Basic validation
    if (!email || !password) {
        showToast('Please fill in all fields', 'error');
        return;
    }
    
    if (!email.includes('@')) {
        showToast('Please enter a valid email address', 'error');
        return;
    }
    
    // Find user
    const user = findUserByEmail(email);
    
    if (!user || user.password !== password) {
        showToast('Invalid email or password', 'error');
        return;
    }
    
    // Set current user
    setCurrentUser(user);
    
    showToast('Login successful!', 'success');
    
    // Redirect to appropriate dashboard after showing toast
    setTimeout(() => {
        if (user.userType === 'buyer') {
            window.location.href = 'buyer-dashboard.html';
        } else if (user.userType === 'seller') {
            window.location.href = 'seller-dashboard.html';
        } else if (user.userType === 'admin') {
            window.location.href = 'admin-dashboard.html';
        } else {
            window.location.href = 'buyer-dashboard.html'; // Default fallback
        }
    }, 1000);
}

function handleRegister(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const name = formData.get('name').trim();
    const email = formData.get('email').trim();
    const password = formData.get('password');
    const userType = formData.get('userType');
    
    // Basic validation
    if (!name || !email || !password || !userType) {
        showToast('Please fill in all fields', 'error');
        return;
    }
    
    if (!email.includes('@')) {
        showToast('Please enter a valid email address', 'error');
        return;
    }
    
    if (password.length < 6) {
        showToast('Password must be at least 6 characters long', 'error');
        return;
    }
    
    // Check if user already exists
    const existingUser = findUserByEmail(email);
    if (existingUser) {
        showToast('An account with this email already exists', 'error');
        return;
    }
    
    // Create new user
    const newUser = {
        id: generateId(),
        name,
        email,
        password,
        userType,
        createdAt: new Date().toISOString()
    };
    
    // Save user
    saveUser(newUser);
    setCurrentUser(newUser);
    
    showToast('Account created successfully!', 'success');
    
    // Redirect to appropriate dashboard
    setTimeout(() => {
        if (userType === 'buyer') {
            window.location.href = 'buyer-dashboard.html';
        } else if (userType === 'seller') {
            window.location.href = 'seller-dashboard.html';
        } else if (userType === 'admin') {
            window.location.href = 'admin-dashboard.html';
        } else {
            window.location.href = 'buyer-dashboard.html'; // Default fallback
        }
    }, 1500);
}