// Dashboard-specific JavaScript functionality

document.addEventListener('DOMContentLoaded', function() {
    initializeCharts();
});

function initializeCharts() {
    // Heart Rate Chart
    const heartRateCtx = document.getElementById('heartRateChart');
    if (heartRateCtx) {
        new Chart(heartRateCtx, {
            type: 'line',
            data: {
                labels: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00', '24:00'],
                datasets: [{
                    label: 'Heart Rate (BPM)',
                    data: [65, 68, 72, 78, 75, 70, 67],
                    borderColor: '#8fb3e2',
                    backgroundColor: 'rgba(143, 179, 226, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: '#314878',
                    pointBorderColor: '#8fb3e2',
                    pointRadius: 6,
                    pointHoverRadius: 8
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: false,
                        min: 60,
                        max: 85,
                        grid: {
                            color: 'rgba(143, 179, 226, 0.2)'
                        },
                        ticks: {
                            color: '#314878'
                        }
                    },
                    x: {
                        grid: {
                            color: 'rgba(143, 179, 226, 0.2)'
                        },
                        ticks: {
                            color: '#314878'
                        }
                    }
                },
                elements: {
                    point: {
                        hoverBackgroundColor: '#314878'
                    }
                }
            }
        });
    }

    // Blood Pressure Chart
    const bloodPressureCtx = document.getElementById('bloodPressureChart');
    if (bloodPressureCtx) {
        new Chart(bloodPressureCtx, {
            type: 'bar',
            data: {
                labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                datasets: [
                    {
                        label: 'Systolic',
                        data: [120, 118, 122, 119, 121, 117, 120],
                        backgroundColor: '#8fb3e2',
                        borderColor: '#314878',
                        borderWidth: 1
                    },
                    {
                        label: 'Diastolic',
                        data: [80, 78, 82, 79, 81, 77, 80],
                        backgroundColor: 'rgba(143, 179, 226, 0.5)',
                        borderColor: '#314878',
                        borderWidth: 1
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top',
                        labels: {
                            color: '#314878'
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: false,
                        min: 70,
                        max: 130,
                        grid: {
                            color: 'rgba(143, 179, 226, 0.2)'
                        },
                        ticks: {
                            color: '#314878'
                        }
                    },
                    x: {
                        grid: {
                            color: 'rgba(143, 179, 226, 0.2)'
                        },
                        ticks: {
                            color: '#314878'
                        }
                    }
                }
            }
        });
    }

    // Blood Sugar Chart
    const bloodSugarCtx = document.getElementById('bloodSugarChart');
    if (bloodSugarCtx) {
        new Chart(bloodSugarCtx, {
            type: 'line',
            data: {
                labels: ['6 AM', '9 AM', '12 PM', '3 PM', '6 PM', '9 PM'],
                datasets: [{
                    label: 'Blood Sugar (mg/dL)',
                    data: [95, 110, 140, 105, 98, 92],
                    borderColor: '#314878',
                    backgroundColor: 'rgba(49, 72, 120, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: '#8fb3e2',
                    pointBorderColor: '#314878',
                    pointRadius: 6,
                    pointHoverRadius: 8
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: false,
                        min: 80,
                        max: 150,
                        grid: {
                            color: 'rgba(143, 179, 226, 0.2)'
                        },
                        ticks: {
                            color: '#314878'
                        }
                    },
                    x: {
                        grid: {
                            color: 'rgba(143, 179, 226, 0.2)'
                        },
                        ticks: {
                            color: '#314878'
                        }
                    }
                }
            }
        });
    }
}

// Add dynamic data updates
function updateDashboardData() {
    // Simulate receiving new data
    const heartRateElement = document.getElementById('heartRate');
    const temperatureElement = document.getElementById('temperature');
    const stepsElement = document.getElementById('steps');
    
    if (heartRateElement) {
        setInterval(() => {
            const variation = (Math.random() - 0.5) * 6; // ±3 BPM variation
            const newRate = Math.round(72 + variation);
            heartRateElement.textContent = newRate;
            
            // Update status indicator based on heart rate
            const indicator = heartRateElement.closest('.status-card').querySelector('.status-indicator');
            if (newRate < 60 || newRate > 100) {
                indicator.textContent = 'Alert';
                indicator.className = 'status-indicator warning';
            } else {
                indicator.textContent = 'Normal';
                indicator.className = 'status-indicator normal';
            }
        }, 5000);
    }
    
    if (temperatureElement) {
        setInterval(() => {
            const variation = (Math.random() - 0.5) * 1.0; // ±0.5°F variation
            const newTemp = (98.6 + variation).toFixed(1);
            temperatureElement.textContent = newTemp;
        }, 7000);
    }
    
    if (stepsElement) {
        setInterval(() => {
            const currentSteps = parseInt(stepsElement.textContent.replace(/,/g, ''));
            const increment = Math.floor(Math.random() * 10) + 1;
            const newSteps = currentSteps + increment;
            stepsElement.textContent = newSteps.toLocaleString();
        }, 15000);
    }
}

// Start dashboard updates if on dashboard page
if (document.getElementById('heartRateChart')) {
    setTimeout(updateDashboardData, 3000);
}