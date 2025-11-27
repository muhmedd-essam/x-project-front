// Authentication functionality with role-based access

class Auth {
    constructor() {
        this.currentUser = JSON.parse(localStorage.getItem('arty-user')) || null;
        this.updateAuthDisplay();
    }

    login(email, password) {
        const user = sampleUsers.find(u => u.email === email && u.password === password);
        
        if (user) {
            this.currentUser = user;
            localStorage.setItem('arty-user', JSON.stringify(user));
            this.updateAuthDisplay();
            
            // Redirect based on role immediately
            this.redirectBasedOnRole(user.role);
            
            return { success: true, message: 'Login successful!' };
        } else {
            return { success: false, message: 'Invalid email or password.' };
        }
    }

    register(name, email, password, confirmPassword, role = 'customer', shopName = '', description = '') {
        // Basic validation
        if (!name || !email || !password) {
            return { success: false, message: 'All fields are required.' };
        }

        if (password !== confirmPassword) {
            return { success: false, message: 'Passwords do not match.' };
        }

        if (password.length < 6) {
            return { success: false, message: 'Password must be at least 6 characters long.' };
        }

        // Check if user already exists
        const existingUser = sampleUsers.find(u => u.email === email);
        if (existingUser) {
            return { success: false, message: 'User with this email already exists.' };
        }

        // Create new user based on role
        const newUser = {
            id: 'user-' + Date.now(),
            name,
            email,
            password,
            role,
            avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg',
            joinDate: new Date().toISOString().split('T')[0]
        };

        // Add role-specific properties
        if (role === 'seller') {
            newUser.shopName = shopName;
            newUser.description = description;
            newUser.products = [];
            newUser.rating = 0;
            newUser.totalSales = 0;
            newUser.earnings = 0;
        } else if (role === 'customer') {
            newUser.orders = [];
            newUser.wishlist = [];
        }

        sampleUsers.push(newUser);
        this.currentUser = newUser;
        localStorage.setItem('arty-user', JSON.stringify(newUser));
        this.updateAuthDisplay();

        // Redirect based on role
        setTimeout(() => {
            this.redirectBasedOnRole(role);
        }, 1500);

        return { success: true, message: 'Registration successful!' };
    }

    redirectBasedOnRole(role) {
        switch(role) {
            case 'admin':
                window.location.href = 'admin-dashboard.html';
                break;
            case 'seller':
                window.location.href = 'seller-dashboard.html';
                break;
            case 'customer':
            default:
                window.location.href = 'index.html';
                break;
        }
    }

    logout() {
        this.currentUser = null;
        localStorage.removeItem('arty-user');
        this.updateAuthDisplay();
        window.location.href = 'index.html';
    }

    updateAuthDisplay() {
        const loginBtn = document.querySelector('.login-btn');
        if (!loginBtn) {
            console.error('Login button not found');
            return;
        }

        if (this.currentUser) {
            loginBtn.textContent = `Hi, ${this.currentUser.name.split(' ')[0]}`;
            loginBtn.href = '#';
            loginBtn.style.position = 'relative';
            
            // Remove old event listeners
            loginBtn.onclick = null;
            
            // Add new click handler
            loginBtn.onclick = (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('Login button clicked');
                this.showUserMenu();
            };
        } else {
            loginBtn.textContent = 'Login';
            loginBtn.href = 'login.html';
            loginBtn.onclick = null;
            loginBtn.style.position = 'static';
        }
    }

    showUserMenu() {
        console.log('showUserMenu called');
        
        // Remove existing menu if any
        const existingMenu = document.querySelector('.user-menu');
        if (existingMenu) {
            existingMenu.remove();
            return;
        }

        // Create menu container
        const menu = document.createElement('div');
        menu.className = 'user-menu';
        menu.innerHTML = `
            <a href="profile.html">Profile</a>
            <a href="orders.html">Orders</a>
            ${this.currentUser.role === 'admin' ? '<a href="admin-dashboard.html">Admin Dashboard</a>' : ''}
            ${this.currentUser.role === 'seller' ? '<a href="seller-dashboard.html">Seller Dashboard</a>' : ''}
            <a href="#" id="logout-link">Logout</a>
        `;

        // Add click handlers
        menu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('Menu item clicked:', link.textContent);
                
                if (link.id === 'logout-link') {
                    this.logout();
                } else {
                    window.location.href = link.href;
                }
            });
        });

        // Add menu to login button
        const loginBtn = document.querySelector('.login-btn');
        if (loginBtn) {
            loginBtn.style.position = 'relative';
            loginBtn.appendChild(menu);
            console.log('Menu added successfully');
            
            // Force browser to recognize the new element
            menu.offsetHeight;
        } else {
            console.error('Login button not found');
        }

        // Close menu when clicking outside
        setTimeout(() => {
            document.addEventListener('click', function closeMenu(e) {
                if (!menu.contains(e.target) && !loginBtn.contains(e.target)) {
                    menu.remove();
                    document.removeEventListener('click', closeMenu);
                }
            });
        }, 100);
    }

    isLoggedIn() {
        return this.currentUser !== null;
    }

    hasRole(role) {
        return this.currentUser && this.currentUser.role === role;
    }

    hasPermission(permission) {
        return this.currentUser && 
               this.currentUser.permissions && 
               this.currentUser.permissions.includes(permission);
    }

    getCurrentUser() {
        return this.currentUser;
    }
}

// Initialize auth
const auth = new Auth();

// Form validation helpers
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function showFormError(elementId, message) {
    const element = document.getElementById(elementId);
    if (element) {
        element.textContent = message;
        element.className = 'form-error';
    }
}

function showFormSuccess(elementId, message) {
    const element = document.getElementById(elementId);
    if (element) {
        element.textContent = message;
        element.className = 'form-success';
    }
}

function clearFormMessages() {
    const messages = document.querySelectorAll('.form-error, .form-success');
    messages.forEach(msg => msg.textContent = '');
}