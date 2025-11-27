// Dashboard functionality
class DashboardManager {
    constructor() {
        this.initializeDashboard();
    }
    
    initializeDashboard() {
        if (!AppState.isAuthenticated) {
            window.location.href = 'login.html';
            return;
        }
        
        this.loadUserStats();
        this.loadUpcomingReservations();
        this.loadRecentActivity();
        this.setupFilters();
    }
    
    loadUserStats() {
        const userBookings = AppState.userBookings || [];
        
        // Calculate stats
        const totalBookings = userBookings.length;
        const totalHours = userBookings.reduce((total, booking) => total + (booking.duration / 60), 0);
        const uniqueLocations = new Set(userBookings.map(b => b.location.id)).size;
        
        // Update stats display
        const totalBookingsElement = document.getElementById('totalBookings');
        const hoursBookedElement = document.getElementById('hoursBooked');
        const favoriteLocationsElement = document.getElementById('favoriteLocations');
        
        if (totalBookingsElement) totalBookingsElement.textContent = totalBookings;
        if (hoursBookedElement) hoursBookedElement.textContent = Math.round(totalHours);
        if (favoriteLocationsElement) favoriteLocationsElement.textContent = uniqueLocations;
    }
    
    loadUpcomingReservations() {
        const upcomingContainer = document.getElementById('upcomingReservations');
        if (!upcomingContainer) return;
        
        const userBookings = AppState.userBookings || [];
        const today = new Date();
        
        const upcomingBookings = userBookings.filter(booking => {
            const bookingDate = new Date(booking.date);
            return bookingDate >= today && booking.status === 'confirmed';
        }).sort((a, b) => new Date(a.date) - new Date(b.date));
        
        if (upcomingBookings.length === 0) {
            upcomingContainer.innerHTML = `
                <div class="empty-state">
                    <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                        <line x1="16" y1="2" x2="16" y2="6"/>
                        <line x1="8" y1="2" x2="8" y2="6"/>
                        <line x1="3" y1="10" x2="21" y2="10"/>
                    </svg>
                    <h3>No Upcoming Reservations</h3>
                    <p>You don't have any upcoming bookings. <a href="booking.html">Book a booth now</a></p>
                </div>
            `;
            return;
        }
        
        upcomingContainer.innerHTML = upcomingBookings.slice(0, 5).map(booking => `
            <div class="reservation-card">
                <div class="reservation-header">
                    <h3 class="reservation-title">${booking.location.name}</h3>
                    <span class="badge badge-${booking.status}">${booking.status}</span>
                </div>
                <div class="reservation-details">
                    <div>
                        <strong>Date:</strong> ${BoothlyUtils.formatDate(booking.date)}
                    </div>
                    <div>
                        <strong>Time:</strong> ${BoothlyUtils.formatTime(booking.startTime)}
                    </div>
                    <div>
                        <strong>Duration:</strong> ${booking.duration} minutes
                    </div>
                    <div>
                        <strong>Access Code:</strong> ${booking.confirmationCode}
                    </div>
                </div>
                <div class="reservation-actions">
                    <button class="btn-small btn-outline" onclick="viewBookingDetails('${booking.id}')">View Details</button>
                    <button class="btn-small btn-secondary" onclick="modifyBooking('${booking.id}')">Modify</button>
                    <button class="btn-small btn-outline" onclick="cancelBooking('${booking.id}')">Cancel</button>
                </div>
            </div>
        `).join('');
    }
    
    loadRecentActivity() {
        const activityContainer = document.getElementById('recentActivity');
        if (!activityContainer) return;
        
        const userBookings = AppState.userBookings || [];
        const activities = userBookings.slice(-10).reverse().map(booking => ({
            type: 'booking',
            title: `Booked ${booking.location.name}`,
            time: new Date(booking.date).toLocaleDateString(),
            icon: 'calendar'
        }));
        
        if (activities.length === 0) {
            activityContainer.innerHTML = `
                <div class="empty-state">
                    <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="12" cy="12" r="10"/>
                        <polyline points="12,6 12,12 16,14"/>
                    </svg>
                    <h3>No Recent Activity</h3>
                    <p>Your activity will appear here once you start booking.</p>
                </div>
            `;
            return;
        }
        
        activityContainer.innerHTML = activities.map(activity => `
            <div class="activity-item">
                <div class="activity-icon">
                    ${this.getActivityIcon(activity.icon)}
                </div>
                <div class="activity-content">
                    <div class="activity-title">${activity.title}</div>
                    <div class="activity-time">${activity.time}</div>
                </div>
            </div>
        `).join('');
    }
    
    getActivityIcon(iconType) {
        const icons = {
            calendar: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>',
            payment: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>'
        };
        return icons[iconType] || icons.calendar;
    }
    
    setupFilters() {
        const activityFilter = document.getElementById('activityFilter');
        if (activityFilter) {
            activityFilter.addEventListener('change', () => {
                this.filterActivity(activityFilter.value);
            });
        }
    }
    
    filterActivity(filterType) {
        // In a real app, this would filter the activity based on type
        console.log('Filtering activity by:', filterType);
    }
}

// Global dashboard functions
function viewBookingDetails(bookingId) {
    BoothlyUtils.showAlert(`Viewing details for booking ${bookingId}`, 'success');
    // In production, this would open a modal or navigate to details page
}

function modifyBooking(bookingId) {
    BoothlyUtils.showAlert(`Modification for booking ${bookingId} would be available here`, 'warning');
    // In production, this would allow users to modify their booking
}

function cancelBooking(bookingId) {
    if (confirm('هل أنت متأكد من إلغاء هذا الحجز؟')) {
        const userBookings = AppState.userBookings || [];
        const updatedBookings = userBookings.map(booking => 
            booking.id === bookingId 
                ? { ...booking, status: 'cancelled' }
                : booking
        );
        
        // Update AppState and storage
        AppState.userBookings = updatedBookings;
        BoothlyUtils.saveToStorage('userBookings', updatedBookings);
        
        // Update location availability
        const cancelledBooking = userBookings.find(b => b.id === bookingId);
        if (cancelledBooking) {
            BoothlyUtils.updateLocationAvailability(cancelledBooking.locationId, 1);
        }
        
        BoothlyUtils.showAlert('تم إلغاء الحجز بنجاح', 'success');
        
        // Reload dashboard
        setTimeout(() => {
            window.location.reload();
        }, 1500);
    }
}

function showPaymentHistory() {
    const userBookings = AppState.userBookings || [];
    const paidBookings = userBookings.filter(b => b.paymentMethod === 'online' || b.status === 'completed');
    
    if (paidBookings.length === 0) {
        BoothlyUtils.showAlert('لا توجد سجلات دفع', 'warning');
        return;
    }
    
    const totalSpent = paidBookings.reduce((total, booking) => total + booking.price, 0);
    BoothlyUtils.showAlert(`إجمالي الإنفاق: ${BoothlyUtils.formatCurrency(totalSpent)} عبر ${paidBookings.length} حجز`, 'success');
}

// Initialize dashboard
document.addEventListener('DOMContentLoaded', function() {
    if (document.querySelector('.dashboard-main')) {
        new DashboardManager();
    }
});