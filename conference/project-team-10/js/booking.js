// Booking system functionality
class BookingManager {
    constructor() {
        this.currentStep = 1;
        this.maxSteps = 4;
        this.bookingData = {};
        this.selectedTimeSlots = [];
        
        this.initializeBooking();
    }
    
    initializeBooking() {
        this.loadPreselectedLocation();
        this.setupTimeSlots();
        this.setupPaymentOptions();
        this.setupFormValidation();
        this.renderQuickLocations();
    }
    
    loadPreselectedLocation() {
        const selectedLocation = localStorage.getItem('selectedLocation');
        if (selectedLocation) {
            const location = JSON.parse(selectedLocation);
            this.selectLocation(location);
            localStorage.removeItem('selectedLocation'); // Clean up
        }
    }
    
    selectLocation(location) {
        this.bookingData.location = location;
        
        const selectedLocationDiv = document.getElementById('selectedLocation');
        if (selectedLocationDiv) {
            selectedLocationDiv.innerHTML = `
                <div class="selected-location-card">
                    <h3>${location.name}</h3>
                    <p>${location.address}</p>
                    <div class="location-features">
                        ${location.features.map(feature => `<span class="feature-tag">${feature}</span>`).join('')}
                    </div>
                    <p><strong>${location.available}/${location.booths}</strong> booths available</p>
                </div>
            `;
            selectedLocationDiv.classList.add('has-selection');
        }
        
        // Enable next button
        const nextBtn = document.getElementById('step1Next');
        if (nextBtn) {
            nextBtn.disabled = false;
        }
    }
    
    renderQuickLocations() {
        const quickLocationsGrid = document.querySelector('.quick-locations-grid');
        if (!quickLocationsGrid) return;
        
        const availableLocations = AppState.locations.filter(l => l.available > 0);
        
        quickLocationsGrid.innerHTML = availableLocations.slice(0, 6).map(location => `
            <div class="quick-location-card" onclick="selectQuickLocation(${location.id})">
                <h4>${location.name}</h4>
                <p>${location.city}</p>
                <small>${location.available}/${location.booths} available</small>
            </div>
        `).join('');
    }
    
    setupTimeSlots() {
        const dateInput = document.getElementById('bookingDate');
        const timeSlotsContainer = document.getElementById('timeSlots');
        
        if (dateInput) {
            dateInput.addEventListener('change', () => {
                this.generateTimeSlots(dateInput.value);
            });
            
            // Set minimum date to today
            const today = new Date().toISOString().split('T')[0];
            dateInput.min = today;
            dateInput.value = today;
            this.generateTimeSlots(today);
        }
    }
    
    generateTimeSlots(date) {
        const timeSlotsContainer = document.getElementById('timeSlots');
        if (!timeSlotsContainer) return;
        
        const slots = [];
        const startHour = 8; // 8 AM
        const endHour = 20; // 8 PM
        
        for (let hour = startHour; hour < endHour; hour++) {
            const timeSlot = `${hour.toString().padStart(2, '0')}:00`;
            const displayTime = this.formatTimeSlot(timeSlot);
            const isAvailable = Math.random() > 0.3; // Simulate availability
            
            slots.push({
                time: timeSlot,
                display: displayTime,
                available: isAvailable
            });
        }
        
        timeSlotsContainer.innerHTML = slots.map(slot => `
            <div class="time-slot ${slot.available ? '' : 'unavailable'}" 
                 onclick="${slot.available ? `selectTimeSlot('${slot.time}')` : ''}"
                 data-time="${slot.time}">
                ${slot.display}
            </div>
        `).join('');
    }
    
    formatTimeSlot(timeString) {
        const [hours, minutes] = timeString.split(':');
        const hour = parseInt(hours);
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const displayHour = hour % 12 || 12;
        return `${displayHour}:${minutes} ${ampm}`;
    }
    
    setupPaymentOptions() {
        const paymentRadios = document.querySelectorAll('input[name="paymentMethod"]');
        const onlinePaymentForm = document.getElementById('onlinePaymentForm');
        
        paymentRadios.forEach(radio => {
            radio.addEventListener('change', () => {
                if (radio.value === 'online' && radio.checked) {
                    onlinePaymentForm?.classList.remove('hidden');
                } else {
                    onlinePaymentForm?.classList.add('hidden');
                }
                this.updateStep3NextButton();
            });
        });
    }
    
    setupFormValidation() {
        const durationSelect = document.getElementById('duration');
        if (durationSelect) {
            durationSelect.addEventListener('change', () => {
                this.updateBookingSummary();
                this.updateStep2NextButton();
            });
        }
    }
    
    updateBookingSummary() {
        const summaryDiv = document.getElementById('bookingSummary');
        if (!summaryDiv || !this.bookingData.location) return;
        
        const date = document.getElementById('bookingDate')?.value;
        const duration = document.getElementById('duration')?.value;
        const selectedTime = this.selectedTimeSlots[0];
        
        if (!date || !duration || !selectedTime) return;
        
        const price = this.calculatePrice(parseInt(duration));
        
        summaryDiv.innerHTML = `
            <div class="summary-row">
                <span>Location:</span>
                <span>${this.bookingData.location.name}</span>
            </div>
            <div class="summary-row">
                <span>Date:</span>
                <span>${BoothlyUtils.formatDate(date)}</span>
            </div>
            <div class="summary-row">
                <span>Time:</span>
                <span>${this.formatTimeSlot(selectedTime)} (${duration} minutes)</span>
            </div>
            <div class="summary-row">
                <span>Total:</span>
                <span>${BoothlyUtils.formatCurrency(price)}</span>
            </div>
        `;
        
        this.bookingData.date = date;
        this.bookingData.startTime = selectedTime;
        this.bookingData.duration = parseInt(duration);
        this.bookingData.price = price;
    }
    
    calculatePrice(duration) {
        const priceMap = {
            30: 15,
            60: 25,
            90: 35,
            120: 45,
            180: 60
        };
        return priceMap[duration] || 0;
    }
    
    updateStep2NextButton() {
        const nextBtn = document.getElementById('step2Next');
        const date = document.getElementById('bookingDate')?.value;
        const duration = document.getElementById('duration')?.value;
        const hasTimeSlot = this.selectedTimeSlots.length > 0;
        
        if (nextBtn) {
            nextBtn.disabled = !(date && duration && hasTimeSlot);
        }
    }
    
    updateStep3NextButton() {
        const nextBtn = document.getElementById('step3Next');
        const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked')?.value;
        
        if (nextBtn) {
            nextBtn.disabled = !paymentMethod;
        }
    }
}

// Global booking functions
function selectQuickLocation(locationId) {
    const location = AppState.locations.find(l => l.id === locationId);
    if (location) {
        const bookingManager = new BookingManager();
        bookingManager.selectLocation(location);
        
        // Update visual selection
        document.querySelectorAll('.quick-location-card').forEach(card => {
            card.classList.remove('selected');
        });
        event.target.closest('.quick-location-card').classList.add('selected');
    }
}

function selectTimeSlot(time) {
    const bookingManager = window.bookingManager || new BookingManager();
    
    // Clear previous selections
    document.querySelectorAll('.time-slot').forEach(slot => {
        slot.classList.remove('selected');
    });
    
    // Select new time slot
    const selectedSlot = document.querySelector(`[data-time="${time}"]`);
    if (selectedSlot) {
        selectedSlot.classList.add('selected');
        bookingManager.selectedTimeSlots = [time];
        bookingManager.updateBookingSummary();
        bookingManager.updateStep2NextButton();
    }
}

function nextStep() {
    const currentStepElement = document.querySelector('.form-step.active');
    const currentStepNumber = parseInt(currentStepElement.id.replace('step', ''));
    
    if (currentStepNumber < 4) {
        // Hide current step
        currentStepElement.classList.remove('active');
        
        // Show next step
        const nextStepElement = document.getElementById(`step${currentStepNumber + 1}`);
        nextStepElement.classList.add('active');
        
        // Update progress
        updateProgress(currentStepNumber + 1);
        
        // Handle step-specific logic
        if (currentStepNumber + 1 === 4) {
            processBooking();
        }
    }
}

function prevStep() {
    const currentStepElement = document.querySelector('.form-step.active');
    const currentStepNumber = parseInt(currentStepElement.id.replace('step', ''));
    
    if (currentStepNumber > 1) {
        // Hide current step
        currentStepElement.classList.remove('active');
        
        // Show previous step
        const prevStepElement = document.getElementById(`step${currentStepNumber - 1}`);
        prevStepElement.classList.add('active');
        
        // Update progress
        updateProgress(currentStepNumber - 1);
    }
}

function updateProgress(step) {
    document.querySelectorAll('.progress-step').forEach((stepElement, index) => {
        const stepNumber = index + 1;
        
        if (stepNumber < step) {
            stepElement.classList.add('completed');
            stepElement.classList.remove('active');
        } else if (stepNumber === step) {
            stepElement.classList.add('active');
            stepElement.classList.remove('completed');
        } else {
            stepElement.classList.remove('active', 'completed');
        }
    });
}

async function processBooking() {
    const bookingManager = window.bookingManager || new BookingManager();
    const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked')?.value;
    
    try {
        // Simulate booking process
        const bookingData = {
            id: BoothlyUtils.generateId(),
            ...bookingManager.bookingData,
            paymentMethod,
            status: 'confirmed',
            customerName: AppState.currentUser?.firstName + ' ' + AppState.currentUser?.lastName || 'Guest',
            customerEmail: AppState.currentUser?.email || 'guest@example.com',
            confirmationCode: Math.random().toString(36).substr(2, 8).toUpperCase()
        };
        
        const response = await BoothlyUtils.simulateApiCall(bookingData, 2000);
        
        // Update confirmation details
        updateConfirmationDetails(response.data);
        
        // Save booking to user's history and update location availability
        BoothlyUtils.saveUserBooking(response.data);
        
        // Update user's total spent
        if (AppState.currentUser) {
            AppState.currentUser.totalSpent += response.data.price;
            BoothlyUtils.saveUserData(AppState.currentUser);
        }
        
    } catch (error) {
        BoothlyUtils.showAlert('Booking failed. Please try again.', 'error');
        prevStep(); // Go back to payment step
    }
}

function updateConfirmationDetails(booking) {
    const confirmationDetails = document.getElementById('confirmationDetails');
    if (!confirmationDetails) return;
    
    confirmationDetails.innerHTML = `
        <div class="confirmation-card">
            <div class="summary-row">
                <span>Booking ID:</span>
                <span><strong>${booking.id}</strong></span>
            </div>
            <div class="summary-row">
                <span>Location:</span>
                <span>${booking.location.name}</span>
            </div>
            <div class="summary-row">
                <span>Date & Time:</span>
                <span>${BoothlyUtils.formatDate(booking.date)} at ${BoothlyUtils.formatTime(booking.startTime)}</span>
            </div>
            <div class="summary-row">
                <span>Duration:</span>
                <span>${booking.duration} minutes</span>
            </div>
            <div class="summary-row">
                <span>Payment:</span>
                <span>${booking.paymentMethod === 'cash' ? 'Pay on Arrival' : 'Paid Online'}</span>
            </div>
            <div class="summary-row">
                <span>Total Amount:</span>
                <span><strong>${BoothlyUtils.formatCurrency(booking.price)}</strong></span>
            </div>
            <div class="summary-row">
                <span>Access Code:</span>
                <span><strong>${booking.confirmationCode}</strong></span>
            </div>
        </div>
        <div class="confirmation-note">
            <p><strong>Important:</strong> Use your access code <strong>${booking.confirmationCode}</strong> to unlock your booth. You'll also receive this information via email and SMS.</p>
        </div>
    `;
}

function downloadConfirmation() {
    BoothlyUtils.showAlert('Confirmation details would be downloaded as PDF', 'success');
    // In production, this would generate and download a PDF confirmation
}

// Initialize booking manager
document.addEventListener('DOMContentLoaded', function() {
    // Only initialize on booking page
    if (document.getElementById('bookingForm')) {
        window.bookingManager = new BookingManager();
    }
});