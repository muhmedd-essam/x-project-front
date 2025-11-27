// Locations and Map functionality
class LocationsManager {
    constructor() {
        this.map = null;
        this.markers = [];
        this.infoWindow = null;
        this.userLocation = null;
        
        this.initializeLocations();
    }
    
    initializeLocations() {
        this.renderLocationsList();
        this.setupFilters();
        this.setupSearch();
        this.showLoginMessage();
        
        // Initialize map if on locations page
        if (document.getElementById('map')) {
            this.initializeMap();
        }
    }
    
    initializeMap() {
        const mapContainer = document.getElementById('map');
        if (!mapContainer) return;
        
        // Initialize Leaflet map centered on Egypt
        this.map = L.map('map').setView([26.8206, 30.8025], 6);
        
        // Add OpenStreetMap tiles
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(this.map);
        
        // Add markers for all locations
        this.addLocationMarkers();
        
        // Add user location button
        this.addUserLocationButton();
    }
    
    addLocationMarkers() {
        AppState.locations.forEach(location => {
            const marker = L.marker([location.lat, location.lng], {
                icon: this.createCustomIcon(location.status, location.available, location.booths)
            }).addTo(this.map);
            
            // Create popup content
            const popupContent = `
                <div class="location-popup">
                    <h3>${location.name}</h3>
                    <p><strong>Address:</strong> ${location.address}</p>
                    <p><strong>Status:</strong> ${this.getStatusText(location.status)}</p>
                    <p><strong>Available Booths:</strong> ${location.available}/${location.booths}</p>
                    <div class="status-badge status-${location.status}">
                        ${this.getStatusText(location.status)}
                    </div>
                    <div class="popup-actions">
                        <button class="btn-primary btn-small" onclick="bookLocation(${location.id})" ${location.available === 0 ? 'disabled' : ''}>
                            ${location.available === 0 ? 'Fully Booked' : 'Book Now'}
                        </button>
                        ${!AppState.isAuthenticated ? '<p style="color: #EF4444; font-size: 0.8rem; margin-top: 8px;">* Login required to book</p>' : ''}
                    </div>
                </div>
            `;
            
            marker.bindPopup(popupContent);
            this.markers.push(marker);
        });
    }
    
    createCustomIcon(status, available, total) {
        const statusColors = {
            available: '#10B981',
            busy: '#EF4444',
            maintenance: '#F59E0B'
        };
        
        const color = statusColors[status] || '#6B7280';
        
        return L.divIcon({
            className: 'custom-marker',
            html: `<div style="
                width: 30px; 
                height: 30px; 
                background-color: ${color}; 
                border-radius: 50%; 
                border: 3px solid white; 
                box-shadow: 0 2px 8px rgba(0,0,0,0.3);
                display: flex; 
                align-items: center; 
                justify-content: center; 
                color: white; 
                font-weight: bold; 
                font-size: 12px;
                cursor: pointer;
            ">${available}/${total}</div>`,
            iconSize: [30, 30],
            iconAnchor: [15, 15]
        });
    }
    
    addUserLocationButton() {
        const userLocationButton = L.control({ position: 'topright' });
        
        userLocationButton.onAdd = function() {
            const div = L.DomUtil.create('div', 'user-location-button');
            div.innerHTML = `
                <button onclick="findNearby()" style="
                    background: white; 
                    border: 2px solid #ccc; 
                    border-radius: 4px; 
                    padding: 8px; 
                    cursor: pointer;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                " title="My Location">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="12" cy="10" r="3"/>
                        <path d="M12 21.7C17.3 17 20 13 20 10a8 8 0 1 0-16 0c0 3 2.7 7 8 11.7z"/>
                    </svg>
                </button>
            `;
            return div;
        };
        
        userLocationButton.addTo(this.map);
    }
    
    updateMapMarkers() {
        // Clear existing markers
        this.markers.forEach(marker => {
            this.map.removeLayer(marker);
        });
        this.markers = [];
        
        // Add updated markers
        this.addLocationMarkers();
    }
    
    showLoginMessage() {
        const loginMessage = document.getElementById('loginMessage');
        if (loginMessage) {
            if (!AppState.isAuthenticated) {
                loginMessage.style.display = 'block';
            } else {
                loginMessage.style.display = 'none';
            }
        }
    }
    
    renderLocationsList() {
        const locationsGrid = document.getElementById('locationsGrid');
        if (!locationsGrid) return;
        
        const filteredLocations = this.getFilteredLocations();
        
        // Update map markers if map exists
        if (this.map) {
            this.updateMapMarkers();
        }
        
        locationsGrid.innerHTML = filteredLocations.map(location => `
            <div class="location-card" data-location-id="${location.id}">
                <div class="location-header">
                    <h3 class="location-title">${location.name}</h3>
                    <span class="location-status status-${location.status}">${this.getStatusText(location.status)}</span>
                </div>
                <div class="location-address">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                        <circle cx="12" cy="10" r="3"/>
                    </svg>
                    ${location.address}
                </div>
                <div class="location-features">
                    ${location.features.map(feature => `<span class="feature-tag">${feature}</span>`).join('')}
                </div>
                <div class="location-availability">
                    <strong>${location.available}/${location.booths}</strong> booths available
                </div>
                <div class="location-actions">
                    <button class="btn-outline btn-small" onclick="viewOnMap(${location.id})">View on Map</button>
                    <button class="btn-primary btn-small" onclick="bookLocation(${location.id})" ${location.available === 0 ? 'disabled' : ''}>
                        ${location.available === 0 ? 'Fully Booked' : 'Book Now'}
                    </button>
                    ${!AppState.isAuthenticated ? '<p style="color: #EF4444; font-size: 0.75rem; margin-top: 8px; text-align: center;">* Login required to book</p>' : ''}
                </div>
            </div>
        `).join('');
    }
    
    getFilteredLocations() {
        const cityFilter = document.getElementById('cityFilter')?.value || '';
        const availabilityFilter = document.getElementById('availabilityFilter')?.value || '';
        
        return AppState.locations.filter(location => {
            const cityMatch = !cityFilter || location.city === cityFilter;
            const statusMatch = !availabilityFilter || location.status === availabilityFilter;
            return cityMatch && statusMatch;
        });
    }
    
    getStatusText(status) {
        const statusMap = {
            available: 'Available',
            busy: 'Busy',
            maintenance: 'Maintenance'
        };
        return statusMap[status] || status;
    }
    
    setupFilters() {
        const cityFilter = document.getElementById('cityFilter');
        const availabilityFilter = document.getElementById('availabilityFilter');
        
        if (cityFilter) {
            cityFilter.addEventListener('change', () => this.renderLocationsList());
        }
        
        if (availabilityFilter) {
            availabilityFilter.addEventListener('change', () => this.renderLocationsList());
        }
    }
    
    setupSearch() {
        const searchInput = document.getElementById('locationSearch');
        if (searchInput) {
            searchInput.addEventListener('input', this.debounce(() => {
                this.searchLocations(searchInput.value);
            }, 300));
        }
    }
    
    searchLocations(query) {
        if (!query) {
            this.renderLocationsList();
            return;
        }
        
        const filteredLocations = AppState.locations.filter(location => 
            location.name.toLowerCase().includes(query.toLowerCase()) ||
            location.address.toLowerCase().includes(query.toLowerCase()) ||
            location.city.toLowerCase().includes(query.toLowerCase())
        );
        
        const locationsGrid = document.getElementById('locationsGrid');
        if (locationsGrid) {
            locationsGrid.innerHTML = filteredLocations.map(location => `
                <div class="location-card" data-location-id="${location.id}">
                    <div class="location-header">
                        <h3 class="location-title">${location.name}</h3>
                        <span class="location-status status-${location.status}">${this.getStatusText(location.status)}</span>
                    </div>
                    <div class="location-address">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                            <circle cx="12" cy="10" r="3"/>
                        </svg>
                        ${location.address}
                    </div>
                    <div class="location-features">
                        ${location.features.map(feature => `<span class="feature-tag">${feature}</span>`).join('')}
                    </div>
                    <div class="location-availability">
                        <strong>${location.available}/${location.booths}</strong> booths available
                    </div>
                    <div class="location-actions">
                        <button class="btn-outline btn-small" onclick="viewOnMap(${location.id})">View on Map</button>
                        <button class="btn-primary btn-small" onclick="bookLocation(${location.id})" ${location.available === 0 ? 'disabled' : ''}>
                            ${location.available === 0 ? 'Fully Booked' : 'Book Now'}
                        </button>
                        ${!AppState.isAuthenticated ? '<p style="color: #EF4444; font-size: 0.75rem; margin-top: 8px; text-align: center;">* Login required to book</p>' : ''}
                    </div>
                </div>
            `).join('');
        }
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

// Global functions for location interactions
function searchLocation() {
    const query = document.getElementById('locationSearch').value;
    if (query) {
        BoothlyUtils.showAlert(`Searching for locations near "${query}"...`, 'success');
        // In production, this would geocode the address and update the map
    }
}

function findNearby() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                
                // Add user location marker to map
                if (window.locationsManager && window.locationsManager.map) {
                    // Remove existing user location marker
                    if (window.locationsManager.userLocationMarker) {
                        window.locationsManager.map.removeLayer(window.locationsManager.userLocationMarker);
                    }
                    
                    // Add new user location marker
                    window.locationsManager.userLocationMarker = L.marker([latitude, longitude], {
                        icon: L.divIcon({
                            className: 'user-location-marker',
                            html: `<div style="
                                width: 20px; 
                                height: 20px; 
                                background-color: #3B82F6; 
                                border-radius: 50%; 
                                border: 3px solid white; 
                                box-shadow: 0 2px 8px rgba(0,0,0,0.3);
                            "></div>`,
                            iconSize: [20, 20],
                            iconAnchor: [10, 10]
                        })
                    }).addTo(window.locationsManager.map);
                    
                    // Center map on user location
                    window.locationsManager.map.setView([latitude, longitude], 12);
                    
                    BoothlyUtils.showAlert('Finding nearest booths to your location...', 'success');
                }
            },
            (error) => {
                BoothlyUtils.showAlert('Location access denied. Please enable location services.', 'error');
            }
        );
    } else {
        BoothlyUtils.showAlert('Geolocation is not supported by this browser.', 'error');
    }
}

function selectLocationFromMap(locationId) {
    const location = AppState.locations.find(l => l.id === locationId);
    if (location) {
        BoothlyUtils.showAlert(`Selected ${location.name}`, 'success');
        // Highlight location in list
        const locationCard = document.querySelector(`[data-location-id="${locationId}"]`);
        if (locationCard) {
            locationCard.scrollIntoView({ behavior: 'smooth' });
            locationCard.style.border = '2px solid var(--primary-color)';
            setTimeout(() => {
                locationCard.style.border = '';
            }, 3000);
        }
    }
}

function viewOnMap(locationId) {
    const location = AppState.locations.find(l => l.id === locationId);
    if (location && window.locationsManager && window.locationsManager.map) {
        // Center map on selected location
        window.locationsManager.map.setView([location.lat, location.lng], 14);
        
        // Scroll to map section
        const mapSection = document.querySelector('.map-section');
        if (mapSection) {
            mapSection.scrollIntoView({ behavior: 'smooth' });
        }
        
        BoothlyUtils.showAlert(`Showing ${location.name} on map`, 'success');
    }
}

function bookLocation(locationId) {
    // Check if user is logged in
    if (!AppState.isAuthenticated) {
        BoothlyUtils.showAlert('You must login first to book', 'warning');
        // Redirect to login page
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 2000);
        return;
    }
    
    // Store selected location for booking
    const location = AppState.locations.find(l => l.id === locationId);
    if (location) {
        localStorage.setItem('selectedLocation', JSON.stringify(location));
        window.location.href = 'booking.html';
    }
}

// Initialize locations manager
document.addEventListener('DOMContentLoaded', function() {
    window.locationsManager = new LocationsManager();
});