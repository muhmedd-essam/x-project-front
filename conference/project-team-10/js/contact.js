// Contact form functionality
class ContactManager {
    constructor() {
        this.initializeContact();
    }
    
    initializeContact() {
        const contactForm = document.getElementById('contactForm');
        if (contactForm) {
            contactForm.addEventListener('submit', this.handleContactSubmit.bind(this));
        }
    }
    
    async handleContactSubmit(e) {
        e.preventDefault();
        
        const formData = {
            firstName: document.getElementById('firstName').value,
            lastName: document.getElementById('lastName').value,
            email: document.getElementById('email').value,
            subject: document.getElementById('subject').value,
            message: document.getElementById('message').value
        };
        
        // Validate form
        const isValid = BoothlyUtils.validateForm('contactForm', {
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
            subject: {
                required: true,
                requiredMessage: 'Please select a subject'
            },
            message: {
                required: true,
                validate: (value) => value.trim().length >= 10,
                requiredMessage: 'Message is required',
                invalidMessage: 'Message must be at least 10 characters long'
            }
        });
        
        if (!isValid) return;
        
        try {
            // Simulate sending message
            await BoothlyUtils.simulateApiCall(formData, 1500);
            
            BoothlyUtils.showAlert('Thank you for your message! We\'ll get back to you within 24 hours.', 'success');
            
            // Reset form
            document.getElementById('contactForm').reset();
            
        } catch (error) {
            BoothlyUtils.showAlert('Failed to send message. Please try again or contact us directly.', 'error');
        }
    }
}

// Initialize contact manager
document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('contactForm')) {
        new ContactManager();
    }
});