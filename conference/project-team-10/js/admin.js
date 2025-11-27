// Admin panel functionality
class AdminManager {
    constructor() {
        this.currentSection = 'dashboard';
        this.initializeAdmin();
    }
    
    initializeAdmin() {
        this.setupNavigation();
        this.loadDashboardData();
        this.setupFilters();
        this.setupModals();
    }
    
    setupNavigation() {
        const navItems = document.querySelectorAll('.sidebar-nav .nav-item');
        navItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const section = item.dataset.section;
                this.switchSection(section);
            });
        });
    }
    
    switchSection(sectionName) {
        // Update navigation
        document.querySelectorAll('.sidebar-nav .nav-item').forEach(item => {
            item.classList.remove('active');
        });
        document.querySelector(`[data-section="${sectionName}"]`).classList.add('active');
        
        // Update content
        document.querySelectorAll('.admin-section').forEach(section => {
            section.classList.remove('active');
        });
        document.getElementById(`${sectionName}-section`).classList.add('active');
        
        this.currentSection = sectionName;
        this.loadSectionData(sectionName);
    }
    
    loadSectionData(sectionName) {
        switch (sectionName) {
            case 'dashboard':
                this.loadDashboardData();
                break;
            case 'locations':
                this.loadLocationsData();
                break;
            case 'reservations':
                this.loadReservationsData();
                break;
            case 'users':
                this.loadUsersData();
                break;
            case 'analytics':
                this.loadAnalyticsData();
                break;
        }
    }
    
    loadDashboardData() {
        const recentBookingsContainer = document.getElementById('recentBookings');
        if (!recentBookingsContainer) return;
        
        const recentBookings = AppState.reservations.slice(-5).reverse();
        
        recentBookingsContainer.innerHTML = recentBookings.map(booking => `
            <div class="recent-booking-item">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <div>
                        <strong>${booking.customerName}</strong><br>
                        <small>${booking.locationName} • ${BoothlyUtils.formatDate(booking.date)} at ${BoothlyUtils.formatTime(booking.startTime)}</small>
                    </div>
                    <span class="badge badge-${booking.status}">${booking.status}</span>
                </div>
            </div>
        `).join('');
    }
    
    loadLocationsData() {
        const locationsTable = document.getElementById('locationsTable');
        if (!locationsTable) return;
        
        locationsTable.innerHTML = AppState.locations.map(location => `
            <tr>
                <td>${location.name}</td>
                <td>${location.address}</td>
                <td>${location.booths}</td>
                <td><span class="badge badge-${location.status}">${location.status}</span></td>
                <td class="table-actions">
                    <button class="btn-icon" onclick="editLocation(${location.id})" title="Edit">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                        </svg>
                    </button>
                    <button class="btn-icon danger" onclick="deleteLocation(${location.id})" title="Delete">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polyline points="3,6 5,6 21,6"/>
                            <path d="M19,6v14a2,2,0,0,1-2,2H7a2,2,0,0,1-2-2V6m3,0V4a2,2,0,0,1,2-2h4a2,2,0,0,1,2,2V6"/>
                        </svg>
                    </button>
                </td>
            </tr>
        `).join('');
    }
    
    loadReservationsData() {
        const reservationsTable = document.getElementById('reservationsTable');
        if (!reservationsTable) return;
        
        reservationsTable.innerHTML = AppState.reservations.map(reservation => `
            <tr>
                <td>${reservation.id}</td>
                <td>${reservation.customerName}<br><small>${reservation.customerEmail}</small></td>
                <td>${reservation.locationName}</td>
                <td>${BoothlyUtils.formatDate(reservation.date)}<br><small>${BoothlyUtils.formatTime(reservation.startTime)}</small></td>
                <td>${reservation.duration} min</td>
                <td>${BoothlyUtils.formatCurrency(reservation.amount)}<br><small>${reservation.paymentMethod}</small></td>
                <td><span class="badge badge-${reservation.status}">${reservation.status}</span></td>
                <td class="table-actions">
                    <button class="btn-icon" onclick="viewReservation('${reservation.id}')" title="View">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                            <circle cx="12" cy="12" r="3"/>
                        </svg>
                    </button>
                    <button class="btn-icon danger" onclick="cancelReservation('${reservation.id}')" title="Cancel">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <line x1="18" y1="6" x2="6" y2="18"/>
                            <line x1="6" y1="6" x2="18" y2="18"/>
                        </svg>
                    </button>
                </td>
            </tr>
        `).join('');
    }
    
    loadUsersData() {
        const usersTable = document.getElementById('usersTable');
        if (!usersTable) return;
        
        // Mock users data
        const users = [
            {
                id: 1,
                name: 'John Doe',
                email: 'john@example.com',
                joinDate: '2024-01-15',
                bookings: 5,
                totalSpent: 125,
                status: 'active'
            },
            {
                id: 2,
                name: 'Jane Smith',
                email: 'jane@example.com',
                joinDate: '2024-02-20',
                bookings: 12,
                totalSpent: 340,
                status: 'active'
            },
            {
                id: 3,
                name: 'Mike Johnson',
                email: 'mike@example.com',
                joinDate: '2024-03-10',
                bookings: 3,
                totalSpent: 75,
                status: 'inactive'
            }
        ];
        
        usersTable.innerHTML = users.map(user => `
            <tr>
                <td>${user.name}</td>
                <td>${user.email}</td>
                <td>${BoothlyUtils.formatDate(user.joinDate)}</td>
                <td>${user.bookings}</td>
                <td>${BoothlyUtils.formatCurrency(user.totalSpent)}</td>
                <td><span class="badge badge-${user.status === 'active' ? 'success' : 'warning'}">${user.status}</span></td>
                <td class="table-actions">
                    <button class="btn-icon" onclick="viewUser(${user.id})" title="View">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                            <circle cx="12" cy="12" r="3"/>
                        </svg>
                    </button>
                </td>
            </tr>
        `).join('');
    }
    
    loadAnalyticsData() {
        // Analytics data would be loaded here
        console.log('Loading analytics data...');
    }
    
    setupFilters() {
        const dateRange = document.getElementById('dateRange');
        const statusFilter = document.getElementById('statusFilter');
        const dateFilter = document.getElementById('dateFilter');
        const userSearch = document.getElementById('userSearch');
        
        if (dateRange) {
            dateRange.addEventListener('change', () => this.filterByDateRange(dateRange.value));
        }
        
        if (statusFilter) {
            statusFilter.addEventListener('change', () => this.filterReservations());
        }
        
        if (dateFilter) {
            dateFilter.addEventListener('change', () => this.filterReservations());
        }
        
        if (userSearch) {
            userSearch.addEventListener('input', this.debounce(() => {
                this.searchUsers(userSearch.value);
            }, 300));
        }
    }
    
    setupModals() {
        const addLocationForm = document.getElementById('addLocationForm');
        if (addLocationForm) {
            addLocationForm.addEventListener('submit', this.handleAddLocation.bind(this));
        }
    }
    
    async handleAddLocation(e) {
        e.preventDefault();
        
        const formData = {
            name: document.getElementById('locationName').value,
            address: document.getElementById('locationAddress').value,
            city: document.getElementById('locationCity').value,
            boothCount: parseInt(document.getElementById('boothCount').value)
        };
        
        try {
            await BoothlyUtils.simulateApiCall(formData, 1000);
            
            // Add new location to state
            const newLocation = {
                id: Date.now(),
                name: formData.name,
                address: formData.address,
                city: formData.city,
                booths: formData.boothCount,
                available: formData.boothCount,
                status: 'available',
                features: ['WiFi', 'AC', 'Power', 'Privacy']
            };
            
            AppState.locations.push(newLocation);
            
            BoothlyUtils.showAlert('Location added successfully!', 'success');
            BoothlyUtils.closeModal('addLocationModal');
            this.loadLocationsData();
            
            // Reset form
            document.getElementById('addLocationForm').reset();
            
        } catch (error) {
            BoothlyUtils.showAlert('Failed to add location. Please try again.', 'error');
        }
    }
    
    filterByDateRange(range) {
        console.log('Filtering by date range:', range);
        // Implementation would filter dashboard data by date range
    }
    
    filterReservations() {
        const status = document.getElementById('statusFilter')?.value;
        const date = document.getElementById('dateFilter')?.value;
        
        console.log('Filtering reservations by:', { status, date });
        // Implementation would filter reservations table
    }
    
    searchUsers(query) {
        console.log('Searching users:', query);
        // Implementation would filter users table
    }
    
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
}

// Global admin functions
function showAddLocationModal() {
    BoothlyUtils.showModal('addLocationModal');
}

function editLocation(locationId) {
    const location = AppState.locations.find(l => l.id === locationId);
    if (location) {
        BoothlyUtils.showAlert(`Edit functionality for ${location.name} would be implemented here`, 'warning');
    }
}

function deleteLocation(locationId) {
    const location = AppState.locations.find(l => l.id === locationId);
    if (location && confirm(`Are you sure you want to delete ${location.name}?`)) {
        AppState.locations = AppState.locations.filter(l => l.id !== locationId);
        BoothlyUtils.showAlert('Location deleted successfully', 'success');
        
        // Reload locations table
        if (window.adminManager) {
            window.adminManager.loadLocationsData();
        }
    }
}

function viewReservation(reservationId) {
    const reservation = AppState.reservations.find(r => r.id === reservation);
    BoothlyUtils.showAlert(`Viewing reservation ${reservationId}`, 'success');
}

function cancelReservation(reservationId) {
    if (confirm('Are you sure you want to cancel this reservation?')) {
        AppState.reservations = AppState.reservations.map(r => 
            r.id === reservationId ? { ...r, status: 'cancelled' } : r
        );
        BoothlyUtils.showAlert('Reservation cancelled', 'success');
        
        // Reload reservations table
        if (window.adminManager) {
            window.adminManager.loadReservationsData();
        }
    }
}

function viewUser(userId) {
    BoothlyUtils.showAlert(`User details for ID ${userId} would be displayed here`, 'success');
}

function generateReport() {
    const startDate = document.getElementById('startDate')?.value;
    const endDate = document.getElementById('endDate')?.value;
    
    if (!startDate || !endDate) {
        BoothlyUtils.showAlert('Please select both start and end dates', 'error');
        return;
    }
    
    BoothlyUtils.showAlert(`Generating report from ${startDate} to ${endDate}...`, 'success');
    // In production, this would generate and download a report
}

// Initialize admin manager
document.addEventListener('DOMContentLoaded', function() {
    if (document.querySelector('.admin-layout')) {
        window.adminManager = new AdminManager();
    }
});