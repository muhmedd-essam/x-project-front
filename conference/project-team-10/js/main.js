// Global state management
const AppState = {
    currentUser: null,
    isAuthenticated: false,
    locations: [],
    reservations: [],
    currentBooking: {},
    userBookings: []
};

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupEventListeners();
    checkAuthStatus();
});

function initializeApp() {
    // Set current date for date inputs
    const today = new Date().toISOString().split('T')[0];
    const dateInputs = document.querySelectorAll('input[type="date"]');
    dateInputs.forEach(input => {
        if (!input.value) {
            input.min = today;
        }
    });
    
    // Load sample data
    loadSampleData();
}

function setupEventListeners() {
    // Mobile menu toggle
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            hamburger.classList.toggle('active');
        });
    }
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.nav-container')) {
            navMenu?.classList.remove('active');
            hamburger?.classList.remove('active');
        }
    });
    
    // Close user dropdown when clicking outside
    document.addEventListener('click', function(e) {
        const userDropdown = document.getElementById('userDropdown');
        if (userDropdown && !e.target.closest('.user-menu')) {
            userDropdown.classList.add('hidden');
        }
    });
}

function checkAuthStatus() {
    const token = localStorage.getItem('boothly_token');
    const userData = BoothlyUtils.getUserData();
    
    if (token && userData) {
        AppState.isAuthenticated = true;
        AppState.currentUser = userData;
        AppState.userBookings = BoothlyUtils.getUserBookings();
        updateAuthUI();
    }
    
    // Load saved locations if available
    const savedLocations = BoothlyUtils.getFromStorage('boothly_locations');
    if (savedLocations) {
        AppState.locations = savedLocations;
    }
}

function updateAuthUI() {
    const navAuth = document.querySelector('.nav-auth');
    const userInitials = document.getElementById('userInitials');
    const userName = document.getElementById('userName');
    
    if (AppState.isAuthenticated && AppState.currentUser) {
        if (navAuth) {
            navAuth.innerHTML = `
                <div class="user-menu">
                    <button class="user-avatar" onclick="toggleUserMenu()">
                        <span>${getInitials(AppState.currentUser.firstName, AppState.currentUser.lastName)}</span>
                    </button>
                    <div class="user-dropdown hidden" id="userDropdown">
                        <a href="dashboard.html">Dashboard</a>
                        <a href="#" onclick="logout()">Logout</a>
                    </div>
                </div>
            `;
        }
        
        if (userInitials) {
            userInitials.textContent = getInitials(AppState.currentUser.firstName, AppState.currentUser.lastName);
        }
        
        if (userName) {
            userName.textContent = AppState.currentUser.firstName;
        }
    }
}

function getInitials(firstName, lastName) {
    return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase();
}

function toggleUserMenu() {
    const dropdown = document.getElementById('userDropdown');
    if (dropdown) {
        dropdown.classList.toggle('hidden');
    }
}

function logout() {
    BoothlyUtils.clearUserData();
    AppState.userBookings = [];
    window.location.href = 'index.html';
}

function loadSampleData() {
    // Sample locations data for Egypt
    AppState.locations = [
        // القاهرة
        {
            id: 1,
            name: "مول مصر",
            address: "طريق القاهرة - الإسماعيلية الصحراوي، القاهرة الجديدة",
            city: "cairo",
            lat: 30.0444,
            lng: 31.2357,
            booths: 15,
            available: 10,
            status: "available",
            features: ["واي فاي", "تكييف", "كهرباء", "خصوصية", "سبورة بيضاء"]
        },
        {
            id: 2,
            name: "مول سيتي ستارز",
            address: "طريق السويس، المعادي، القاهرة",
            city: "cairo",
            lat: 29.9792,
            lng: 31.1342,
            booths: 12,
            available: 8,
            status: "available",
            features: ["واي فاي", "تكييف", "كهرباء", "خصوصية", "مؤتمرات فيديو", "كافيتريا"]
        },
        {
            id: 3,
            name: "مول طيبة",
            address: "طريق النصر، مدينة نصر، القاهرة",
            city: "cairo",
            lat: 30.0588,
            lng: 31.2238,
            booths: 18,
            available: 12,
            status: "available",
            features: ["واي فاي", "تكييف", "كهرباء", "خصوصية", "سبورة بيضاء", "طابعة"]
        },
        {
            id: 4,
            name: "مول هليوبوليس",
            address: "طريق النزهة، مصر الجديدة، القاهرة",
            city: "cairo",
            lat: 30.1289,
            lng: 31.3139,
            booths: 14,
            available: 6,
            status: "busy",
            features: ["واي فاي", "تكييف", "كهرباء", "خصوصية", "غرفة اجتماعات كبيرة"]
        },
        {
            id: 5,
            name: "مول المعادي",
            address: "طريق كورنيش النيل، المعادي، القاهرة",
            city: "cairo",
            lat: 29.9608,
            lng: 31.2620,
            booths: 10,
            available: 7,
            status: "available",
            features: ["واي فاي", "تكييف", "كهرباء", "خصوصية", "مطبخ صغير", "مكتبة"]
        },
        {
            id: 6,
            name: "مول زايد",
            address: "طريق مصر الإسكندرية الصحراوي، الشيخ زايد",
            city: "cairo",
            lat: 30.0277,
            lng: 30.9999,
            booths: 20,
            available: 15,
            status: "available",
            features: ["واي فاي", "تكييف", "كهرباء", "خصوصية", "سبورة بيضاء", "مؤتمرات فيديو", "كافيتريا"]
        },
        // الجيزة
        {
            id: 7,
            name: "مول الأهرام",
            address: "طريق الأهرام، الجيزة",
            city: "giza",
            lat: 29.9792,
            lng: 31.1342,
            booths: 8,
            available: 0,
            status: "maintenance",
            features: ["واي فاي", "تكييف", "كهرباء", "خصوصية"]
        },
        {
            id: 8,
            name: "مول الدقي",
            address: "طريق الجامعة، الدقي، الجيزة",
            city: "giza",
            lat: 30.0371,
            lng: 31.2088,
            booths: 16,
            available: 11,
            status: "available",
            features: ["واي فاي", "تكييف", "كهرباء", "خصوصية", "سبورة بيضاء", "طابعة", "مؤتمرات فيديو"]
        },
        {
            id: 9,
            name: "مول المهندسين",
            address: "طريق السودان، المهندسين، الجيزة",
            city: "giza",
            lat: 30.0444,
            lng: 31.1997,
            booths: 13,
            available: 8,
            status: "available",
            features: ["واي فاي", "تكييف", "كهرباء", "خصوصية", "غرفة اجتماعات", "كافيتريا"]
        },
        {
            id: 10,
            name: "مول 6 أكتوبر",
            address: "طريق الواحات، مدينة 6 أكتوبر، الجيزة",
            city: "giza",
            lat: 29.9697,
            lng: 30.9564,
            booths: 22,
            available: 18,
            status: "available",
            features: ["واي فاي", "تكييف", "كهرباء", "خصوصية", "سبورة بيضاء", "مؤتمرات فيديو", "مطبخ صغير", "مكتبة"]
        },
        {
            id: 11,
            name: "مول الشيخ زايد",
            address: "طريق مصر الإسكندرية الصحراوي، الشيخ زايد، الجيزة",
            city: "giza",
            lat: 30.0277,
            lng: 30.9999,
            booths: 25,
            available: 20,
            status: "available",
            features: ["واي فاي", "تكييف", "كهرباء", "خصوصية", "سبورة بيضاء", "مؤتمرات فيديو", "كافيتريا", "غرفة اجتماعات كبيرة"]
        },
        // الإسكندرية
        {
            id: 12,
            name: "مركز الإسكندرية التجاري",
            address: "طريق الكورنيش، الإسكندرية",
            city: "alexandria",
            lat: 31.2001,
            lng: 29.9187,
            booths: 12,
            available: 5,
            status: "busy",
            features: ["واي فاي", "تكييف", "كهرباء", "خصوصية", "مؤتمرات فيديو"]
        },
        // شرم الشيخ
        {
            id: 13,
            name: "مركز شرم الشيخ",
            address: "طريق النايب، شرم الشيخ",
            city: "sharm-el-sheikh",
            lat: 27.9158,
            lng: 34.3300,
            booths: 10,
            available: 7,
            status: "available",
            features: ["واي فاي", "تكييف", "كهرباء", "خصوصية", "مطبخ صغير"]
        },
        // الغردقة
        {
            id: 14,
            name: "مول الغردقة",
            address: "طريق الكورنيش، الغردقة",
            city: "hurghada",
            lat: 27.2579,
            lng: 33.8116,
            booths: 6,
            available: 3,
            status: "busy",
            features: ["واي فاي", "تكييف", "كهرباء", "خصوصية"]
        },
        // الأقصر
        {
            id: 15,
            name: "مركز الأقصر السياحي",
            address: "طريق الكورنيش، الأقصر",
            city: "luxor",
            lat: 25.6872,
            lng: 32.6396,
            booths: 9,
            available: 6,
            status: "available",
            features: ["واي فاي", "تكييف", "كهرباء", "خصوصية", "مكتبة"]
        },
        // أسوان
        {
            id: 16,
            name: "مول أسوان",
            address: "طريق الكورنيش، أسوان",
            city: "aswan",
            lat: 24.0889,
            lng: 32.8998,
            booths: 7,
            available: 4,
            status: "available",
            features: ["واي فاي", "تكييف", "كهرباء", "خصوصية", "كافيتريا"]
        },
        // بورسعيد
        {
            id: 17,
            name: "مركز بورسعيد",
            address: "طريق الكورنيش، بورسعيد",
            city: "port-said",
            lat: 31.2667,
            lng: 32.3000,
            booths: 11,
            available: 8,
            status: "available",
            features: ["واي فاي", "تكييف", "كهرباء", "خصوصية", "غرفة اجتماعات"]
        }
    ];
    
    // Sample reservations data
    AppState.reservations = [
        {
            id: "BK001",
            locationId: 1,
            locationName: "Times Square Mall",
            date: "2025-01-15",
            startTime: "14:00",
            duration: 60,
            status: "confirmed",
            paymentMethod: "online",
            amount: 25,
            customerName: "John Doe",
            customerEmail: "john@example.com"
        },
        {
            id: "BK002",
            locationId: 2,
            locationName: "Century City Center",
            date: "2025-01-16",
            startTime: "10:30",
            duration: 90,
            status: "confirmed",
            paymentMethod: "cash",
            amount: 35,
            customerName: "Jane Smith",
            customerEmail: "jane@example.com"
        }
    ];
}

// Utility functions
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

function formatTime(timeString) {
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
}

function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(amount);
}

function generateId() {
    return 'BK' + Math.random().toString(36).substr(2, 6).toUpperCase();
}

function showAlert(message, type = 'success') {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} fade-in`;
    alertDiv.textContent = message;
    
    // Insert at top of main content
    const main = document.querySelector('main');
    if (main) {
        main.insertBefore(alertDiv, main.firstChild);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            alertDiv.remove();
        }, 5000);
    }
}

function showModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
}

// Search and filter functions
function filterLocations(cityFilter, availabilityFilter) {
    return AppState.locations.filter(location => {
        const cityMatch = !cityFilter || location.city.toLowerCase().includes(cityFilter.toLowerCase());
        const statusMatch = !availabilityFilter || location.status === availabilityFilter;
        return cityMatch && statusMatch;
    });
}

function searchUsers(searchTerm) {
    // Mock user search functionality
    return []; // Would implement actual search logic
}

// Local storage helpers
function saveToStorage(key, data) {
    try {
        localStorage.setItem(key, JSON.stringify(data));
        return true;
    } catch (error) {
        console.error('Error saving to localStorage:', error);
        return false;
    }
}

function getFromStorage(key) {
    try {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : null;
    } catch (error) {
        console.error('Error reading from localStorage:', error);
        return null;
    }
}

// API simulation functions
function simulateApiCall(data, delay = 1000) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({ success: true, data });
        }, delay);
    });
}

function simulateApiError(message, delay = 1000) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            reject(new Error(message));
        }, delay);
    });
}

// Form validation helpers
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function validatePassword(password) {
    return password.length >= 8;
}

function validateForm(formId, rules) {
    const form = document.getElementById(formId);
    if (!form) return false;
    
    let isValid = true;
    
    Object.keys(rules).forEach(fieldId => {
        const field = document.getElementById(fieldId);
        const errorElement = document.getElementById(fieldId + 'Error');
        const rule = rules[fieldId];
        
        if (field && errorElement) {
            let fieldValid = true;
            let errorMessage = '';
            
            if (rule.required && !field.value.trim()) {
                fieldValid = false;
                errorMessage = rule.requiredMessage || 'This field is required';
            } else if (field.value && rule.validate && !rule.validate(field.value)) {
                fieldValid = false;
                errorMessage = rule.invalidMessage || 'Invalid value';
            }
            
            if (fieldValid) {
                field.classList.remove('error');
                errorElement.classList.add('hidden');
                errorElement.textContent = '';
            } else {
                field.classList.add('error');
                errorElement.classList.remove('hidden');
                errorElement.textContent = errorMessage;
                isValid = false;
            }
        }
    });
    
    return isValid;
}

// Initialize tooltips and interactive elements
function initializeInteractiveElements() {
    // Add loading states to buttons
    const buttons = document.querySelectorAll('button[type="submit"]');
    buttons.forEach(button => {
        const form = button.closest('form');
        if (form) {
            form.addEventListener('submit', function(e) {
                button.classList.add('loading');
                button.disabled = true;
                
                // Remove loading state after form processing
                setTimeout(() => {
                    button.classList.remove('loading');
                    button.disabled = false;
                }, 2000);
            });
        }
    });
}

// Call initialization
document.addEventListener('DOMContentLoaded', initializeInteractiveElements);

// Export for other modules
window.AppState = AppState;
window.BoothlyUtils = {
    // Storage functions
    saveToStorage: function(key, data) {
        try {
            localStorage.setItem(key, JSON.stringify(data));
            return true;
        } catch (error) {
            console.error('Error saving to storage:', error);
            return false;
        }
    },
    
    getFromStorage: function(key) {
        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : null;
        } catch (error) {
            console.error('Error getting from storage:', error);
            return null;
        }
    },
    
    removeFromStorage: function(key) {
        try {
            localStorage.removeItem(key);
            return true;
        } catch (error) {
            console.error('Error removing from storage:', error);
            return false;
        }
    },
    
    // User management
    saveUserData: function(userData) {
        this.saveToStorage('boothly_user', userData);
        AppState.currentUser = userData;
        AppState.isAuthenticated = true;
    },
    
    getUserData: function() {
        return this.getFromStorage('boothly_user');
    },
    
    clearUserData: function() {
        this.removeFromStorage('boothly_user');
        this.removeFromStorage('boothly_token');
        AppState.currentUser = null;
        AppState.isAuthenticated = false;
    },
    
    // Booking management
    saveUserBooking: function(booking) {
        let userBookings = this.getFromStorage('userBookings') || [];
        userBookings.push(booking);
        this.saveToStorage('userBookings', userBookings);
        AppState.userBookings = userBookings;
        
        // Update location availability
        this.updateLocationAvailability(booking.locationId, -1);
    },
    
    getUserBookings: function() {
        return this.getFromStorage('userBookings') || [];
    },
    
    updateLocationAvailability: function(locationId, change) {
        const location = AppState.locations.find(l => l.id === locationId);
        if (location) {
            location.available += change;
            if (location.available < 0) location.available = 0;
            if (location.available > location.booths) location.available = location.booths;
            
            // Update status based on availability
            if (location.available === 0) {
                location.status = 'busy';
            } else if (location.available < location.booths * 0.3) {
                location.status = 'busy';
            } else {
                location.status = 'available';
            }
            
            // Save updated locations
            this.saveToStorage('boothly_locations', AppState.locations);
        }
    },
    
    // Utility functions
    generateId: function() {
        return 'BK' + Date.now() + Math.random().toString(36).substr(2, 9);
    },
    
    formatDate: function(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('ar-EG', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    },
    
    formatTime: function(timeString) {
        return timeString;
    },
    
    formatCurrency: function(amount) {
        return `${amount} جنيه مصري`;
    },
    formatDate,
    formatTime,
    formatCurrency,
    generateId,
    showAlert,
    showModal,
    closeModal,
    validateEmail,
    validatePassword,
    validateForm,
    saveToStorage,
    getFromStorage,
    simulateApiCall,
    simulateApiError
};