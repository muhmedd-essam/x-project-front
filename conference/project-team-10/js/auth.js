// Authentication functionality
class AuthManager {
    constructor() {
        this.initializeAuth();
    }
    
    initializeAuth() {
        const loginForm = document.getElementById('loginForm');
        const registerForm = document.getElementById('registerForm');
        
        if (loginForm) {
            loginForm.addEventListener('submit', this.handleLogin.bind(this));
        }
        
        if (registerForm) {
            registerForm.addEventListener('submit', this.handleRegister.bind(this));
        }
        
        // Check if user is already logged in and redirect
        if (AppState.isAuthenticated) {
            this.redirectToDashboard();
        }
    }
    
    async handleLogin(e) {
        e.preventDefault();
        
        const formData = {
            email: document.getElementById('email').value,
            password: document.getElementById('password').value,
            rememberMe: document.getElementById('rememberMe').checked
        };
        
        // Validate form
        const isValid = BoothlyUtils.validateForm('loginForm', {
            email: {
                required: true,
                validate: BoothlyUtils.validateEmail,
                requiredMessage: 'Email is required',
                invalidMessage: 'Please enter a valid email address'
            },
            password: {
                required: true,
                requiredMessage: 'Password is required'
            }
        });
        
        if (!isValid) return;
        
        try {
            // Simulate API call
            const response = await BoothlyUtils.simulateApiCall({
                token: 'mock_jwt_token_' + Date.now(),
                user: {
                    id: 1,
                    firstName: 'John',
                    lastName: 'Doe',
                    email: formData.email,
                    joinDate: '2024-01-15'
                }
            });
            
            // Store authentication data
            localStorage.setItem('boothly_token', response.data.token);
            const userData = {
                ...response.data.user,
                totalSpent: 0
            };
            BoothlyUtils.saveUserData(userData);
            
            BoothlyUtils.showAlert('Login successful! Redirecting to dashboard...', 'success');
            
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 1500);
            
        } catch (error) {
            BoothlyUtils.showAlert('Invalid email or password. Please try again.', 'error');
        }
    }
    
    async handleRegister(e) {
        e.preventDefault();
        
        const formData = {
            firstName: document.getElementById('firstName').value,
            lastName: document.getElementById('lastName').value,
            email: document.getElementById('email').value,
            password: document.getElementById('password').value,
            confirmPassword: document.getElementById('confirmPassword').value,
            agreeTerms: document.getElementById('agreeTerms').checked
        };
        
        // Validate form
        const isValid = BoothlyUtils.validateForm('registerForm', {
            firstName: {
                required: true,
                requiredMessage: 'First name is required'
            },
            lastName: {
                required: true,
                requiredMessage: 'Last name is required'
            },
            email: {
                required: true,
                validate: BoothlyUtils.validateEmail,
                requiredMessage: 'Email is required',
                invalidMessage: 'Please enter a valid email address'
            },
            password: {
                required: true,
                validate: BoothlyUtils.validatePassword,
                requiredMessage: 'Password is required',
                invalidMessage: 'Password must be at least 8 characters long'
            },
            confirmPassword: {
                required: true,
                validate: (value) => value === formData.password,
                requiredMessage: 'Please confirm your password',
                invalidMessage: 'Passwords do not match'
            }
        });
        
        if (!isValid) return;
        
        if (!formData.agreeTerms) {
            BoothlyUtils.showAlert('Please agree to the Terms of Service and Privacy Policy', 'error');
            return;
        }
        
        try {
            // Simulate API call
            const response = await BoothlyUtils.simulateApiCall({
                token: 'mock_jwt_token_' + Date.now(),
                user: {
                    id: Date.now(),
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    email: formData.email,
                    joinDate: new Date().toISOString().split('T')[0]
                }
            });
            
            // Store authentication data
            localStorage.setItem('boothly_token', response.data.token);
            const userData = {
                ...response.data.user,
                totalSpent: 0
            };
            BoothlyUtils.saveUserData(userData);
            
            BoothlyUtils.showAlert('Account created successfully! Redirecting to dashboard...', 'success');
            
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 1500);
            
        } catch (error) {
            BoothlyUtils.showAlert('Registration failed. Please try again.', 'error');
        }
    }
    
    redirectToDashboard() {
        const currentPage = window.location.pathname;
        if (currentPage.includes('login.html') || currentPage.includes('register.html')) {
            window.location.href = 'dashboard.html';
        }
    }
}

// Google Sign-In functions
function signInWithGoogle() {
    // Simulate Google Sign-In
    BoothlyUtils.showAlert('Google Sign-In would be integrated here with Google OAuth API', 'warning');
}

function signUpWithGoogle() {
    // Simulate Google Sign-Up
    BoothlyUtils.showAlert('Google Sign-Up would be integrated here with Google OAuth API', 'warning');
}

// Initialize authentication
document.addEventListener('DOMContentLoaded', function() {
    new AuthManager();
});