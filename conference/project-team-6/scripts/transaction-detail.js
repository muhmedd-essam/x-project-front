// Transaction detail page functionality

let countdownInterval;

document.addEventListener('DOMContentLoaded', function() {
    if (!requireAuth()) return;

    const transactionId = getUrlParameter('id');
    if (!transactionId) {
        showToast('Transaction not found', 'error');
        setTimeout(() => goBack(), 2000);
        return;
    }

    loadTransactionDetails(transactionId);
});

function goBack() {
    const currentUser = getCurrentUser();
    if (currentUser.userType === 'buyer') {
        window.location.href = 'buyer-dashboard.html';
    } else {
        window.location.href = 'seller-dashboard.html';
    }
}

function loadTransactionDetails(transactionId) {
    const transaction = getTransactionById(transactionId);
    const currentUser = getCurrentUser();
    
    if (!transaction) {
        document.getElementById('transactionContent').innerHTML = `
            <div class="error-state">
                <div class="error-icon">❌</div>
                <h2>Transaction Not Found</h2>
                <p>The requested transaction could not be found.</p>
            </div>
        `;
        return;
    }

    // Check if user has access to this transaction
    if (transaction.buyerEmail !== currentUser.email && 
        transaction.sellerEmail !== currentUser.email) {
        document.getElementById('transactionContent').innerHTML = `
            <div class="error-state">
                <div class="error-icon">🚫</div>
                <h2>Access Denied</h2>
                <p>You don't have permission to view this transaction.</p>
            </div>
        `;
        return;
    }

    const userType = currentUser.email === transaction.buyerEmail ? 'buyer' : 'seller';
    const otherPartyName = userType === 'buyer' ? transaction.sellerName : transaction.buyerName;
    const status = getTransactionStatus(transaction);

    document.getElementById('transactionContent').innerHTML = `
        <div class="transaction-main">
            <div class="transaction-info-card">
                <div class="transaction-info-header">
                    <div class="transaction-info-title">
                        <h2>${transaction.description}</h2>
                        <div class="transaction-id">Transaction ID: ${transaction.id}</div>
                    </div>
                    <div class="transaction-amount-display">
                        <div class="amount-label">Amount</div>
                        <div class="amount-value">${formatCurrency(transaction.amount)}</div>
                    </div>
                </div>
                
                <div class="transaction-details-grid">
                    <div class="detail-group">
                        <span class="detail-label">${userType === 'buyer' ? 'Seller' : 'Buyer'}</span>
                        <span class="detail-value">${otherPartyName}</span>
                    </div>
                    <div class="detail-group">
                        <span class="detail-label">Status</span>
                        <span class="detail-value">
                            <span class="status-badge status-${status}">${status}</span>
                        </span>
                    </div>
                    <div class="detail-group">
                        <span class="detail-label">Created</span>
                        <span class="detail-value">${formatDate(transaction.createdAt)}</span>
                    </div>
                    <div class="detail-group">
                        <span class="detail-label">Delivery Time</span>
                        <span class="detail-value">${transaction.deliveryDays} days</span>
                    </div>
                    ${status !== 'expired' && status !== 'completed' ? `
                        <div class="detail-group">
                            <span class="detail-label">Expires On</span>
                            <span class="detail-value">${formatDate(transaction.expiryDate)}</span>
                        </div>
                    ` : ''}
                    ${transaction.deliveredAt ? `
                        <div class="detail-group">
                            <span class="detail-label">Delivered</span>
                            <span class="detail-value">${formatDate(transaction.deliveredAt)}</span>
                        </div>
                    ` : ''}
                    ${transaction.completedAt ? `
                        <div class="detail-group">
                            <span class="detail-label">Completed</span>
                            <span class="detail-value">${formatDate(transaction.completedAt)}</span>
                        </div>
                    ` : ''}
                </div>

                ${getTransactionActions(transaction, userType)}
            </div>

            <div class="progress-card">
                <h3>Transaction Progress</h3>
                ${renderProgressTimeline(transaction)}
            </div>
        </div>

        <div class="transaction-sidebar">
            ${renderCountdown(transaction)}
            ${renderChatComponent(transaction, userType)}
        </div>
    `;

    // Initialize chat with delay to ensure DOM is ready
    setTimeout(() => {
        console.log('Initializing chat after DOM is ready...');
        
        // Create sample messages if none exist
        const messages = getMessages(transactionId);
        if (messages.length === 0) {
            console.log('No messages found, creating sample messages...');
            createSampleChatMessages(transactionId);
        }
        
        initializeChat(transactionId, userType);
        
        // Force refresh chat display
        const updatedMessages = getMessages(transactionId);
        const currentUser = getCurrentUser();
        if (currentUser) {
            displayChatMessages(updatedMessages, currentUser.email);
        }
    }, 200);
    
    // Start countdown if applicable
    if (status === 'pending' || status === 'delivered') {
        countdownInterval = createCountdown(
            transaction.expiryDate, 
            'countdown-timer',
            () => {
                showToast('Transaction has expired!', 'warning');
                setTimeout(() => window.location.reload(), 2000);
            }
        );
    }
}

function renderProgressTimeline(transaction) {
    const status = getTransactionStatus(transaction);
    const steps = [
        { id: 'sent', title: 'Deposit Sent', description: 'Buyer sent funds to escrow' },
        { id: 'pending', title: 'Pending Delivery', description: 'Waiting for seller to deliver' },
        { id: 'delivered', title: 'Delivered', description: 'Seller marked as delivered' },
        { id: 'completed', title: 'Completed', description: 'Buyer confirmed and funds released' }
    ];

    let timeline = '<div class="progress-timeline">';
    
    steps.forEach((step, index) => {
        let stepClass = 'inactive';
        let timestamp = '';
        
        if (step.id === 'sent') {
            stepClass = 'completed';
            timestamp = formatDate(transaction.createdAt);
        } else if (step.id === 'pending' && (status === 'pending' || status === 'delivered' || status === 'completed')) {
            stepClass = status === 'pending' ? 'active' : 'completed';
        } else if (step.id === 'delivered' && (status === 'delivered' || status === 'completed')) {
            stepClass = status === 'delivered' ? 'active' : 'completed';
            if (transaction.deliveredAt) {
                timestamp = formatDate(transaction.deliveredAt);
            }
        } else if (step.id === 'completed' && status === 'completed') {
            stepClass = 'completed';
            if (transaction.completedAt) {
                timestamp = formatDate(transaction.completedAt);
            }
        }

        if (status === 'expired' && (step.id === 'delivered' || step.id === 'completed')) {
            stepClass = 'inactive';
            if (step.id === 'delivered') {
                step.title = 'Expired';
                step.description = 'Transaction expired, funds refunded';
                stepClass = 'completed';
                timestamp = formatDate(transaction.expiryDate);
            }
        }

        timeline += `
            <div class="progress-step ${stepClass}">
                <div class="step-indicator">${index + 1}</div>
                <div class="step-content">
                    <div class="step-title">${step.title}</div>
                    <div class="step-description">${step.description}</div>
                    ${timestamp ? `<div class="step-timestamp">${timestamp}</div>` : ''}
                </div>
            </div>
        `;

        // Break early if expired
        if (status === 'expired' && step.id === 'delivered') {
            break;
        }
    });
    
    timeline += '</div>';
    return timeline;
}

function renderCountdown(transaction) {
    const status = getTransactionStatus(transaction);
    
    if (status === 'completed' || status === 'expired') {
        return '';
    }

    return `
        <div class="countdown-card">
            <div class="countdown-title">Time Remaining</div>
            <div id="countdown-timer" class="countdown-timer">Loading...</div>
            <p class="countdown-description">Until automatic refund</p>
        </div>
    `;
}

function renderChatComponent(transaction, userType) {
    const otherParty = userType === 'buyer' ? transaction.sellerName : transaction.buyerName;
    return `
        <div class="chat-card">
            <div class="chat-header">
                <h3>💬 Chat with ${otherParty}</h3>
                <p style="color: var(--neutral-500); font-size: 0.875rem; margin-top: 4px;">
                    Communicate directly about this transaction
                </p>
            </div>
            <div id="chatMessages" class="chat-messages">
                <!-- Messages will be loaded here -->
            </div>
            <div class="chat-input-container">
                <textarea id="chatInput" class="chat-input" placeholder="Type your message here..." rows="2"></textarea>
                <button id="sendMessage" class="chat-send-btn">Send</button>
            </div>
        </div>
    `;
}

function getTransactionActions(transaction, userType) {
    const status = getTransactionStatus(transaction);
    let actions = '';

    if (status === 'pending' && userType === 'seller') {
        actions = `
            <div class="transaction-actions">
                <button onclick="markTransactionDelivered('${transaction.id}')" class="btn btn-success">
                    Mark as Delivered
                </button>
            </div>
        `;
    } else if (status === 'delivered' && userType === 'buyer') {
        actions = `
            <div class="transaction-actions">
                <button onclick="confirmTransactionDelivery('${transaction.id}')" class="btn btn-success">
                    Confirm Delivery & Release Funds
                </button>
            </div>
        `;
    }

    return actions;
}

function initializeChat(transactionId, userType) {
    console.log('Initializing chat for transaction:', transactionId);
    const messages = getMessages(transactionId);
    console.log('Chat messages:', messages);
    const currentUser = getCurrentUser();
    console.log('Current user:', currentUser);
    
    displayChatMessages(messages, currentUser.email);
    
    // Handle message sending
    const sendButton = document.getElementById('sendMessage');
    const chatInput = document.getElementById('chatInput');
    
    console.log('Send button found:', !!sendButton);
    console.log('Chat input found:', !!chatInput);
    
    if (sendButton && chatInput) {
        sendButton.addEventListener('click', () => {
            console.log('Send button clicked');
            sendChatMessage(transactionId, currentUser);
        });
        
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                console.log('Enter key pressed');
                sendChatMessage(transactionId, currentUser);
            }
        });
    } else {
        console.error('Chat elements not found!');
    }
}

function displayChatMessages(messages, currentUserEmail) {
    console.log('Displaying chat messages:', messages);
    console.log('Current user email:', currentUserEmail);
    
    const chatMessages = document.getElementById('chatMessages');
    if (!chatMessages) {
        console.error('Chat messages container not found!');
        return;
    }

    // Clear existing messages
    chatMessages.innerHTML = '';

    if (messages.length === 0) {
        chatMessages.innerHTML = `
            <div class="empty-state" style="padding: 20px; font-size: 0.875rem; text-align: center; color: var(--neutral-500);">
                <p>💬 No messages yet. Start the conversation!</p>
                <p style="font-size: 0.75rem; margin-top: 8px;">Type a message below to begin chatting.</p>
            </div>
        `;
        console.log('No messages to display - showing empty state');
        return;
    }

    messages.forEach(message => {
        console.log('Processing message:', message);
        const messageElement = document.createElement('div');
        messageElement.className = `message ${message.senderEmail === currentUserEmail ? 'sent' : 'received'}`;
        
        messageElement.innerHTML = `
            <div class="message-content">${message.content}</div>
            <div class="message-info">${formatRelativeTime(message.timestamp)}</div>
        `;
        
        chatMessages.appendChild(messageElement);
    });

    // Scroll to bottom
    setTimeout(() => {
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }, 100);
    
    console.log('Chat messages displayed successfully');
}

function sendChatMessage(transactionId, currentUser) {
    console.log('Sending chat message for transaction:', transactionId);
    console.log('Current user:', currentUser);
    
    const chatInput = document.getElementById('chatInput');
    const sendButton = document.getElementById('sendMessage');
    
    if (!chatInput || !sendButton) {
        console.error('Chat input or send button not found!');
        return;
    }
    
    const content = chatInput.value.trim();
    if (!content) {
        console.log('Empty message, not sending');
        return;
    }

    console.log('Message content:', content);

    // Disable send button while sending
    sendButton.disabled = true;
    sendButton.textContent = 'Sending...';

    const message = {
        senderEmail: currentUser.email,
        senderName: currentUser.name,
        content: content
    };

    console.log('Message object:', message);

    try {
        // Save message
        saveMessage(transactionId, message);
        console.log('Message saved successfully');
        
        // Clear input
        chatInput.value = '';
        
        // Reload messages
        const messages = getMessages(transactionId);
        console.log('Updated messages:', messages);
        displayChatMessages(messages, currentUser.email);
        
        showToast('Message sent', 'success', 2000);
    } catch (error) {
        console.error('Error sending message:', error);
        showToast('Failed to send message. Please try again.', 'error');
    } finally {
        // Re-enable send button
        sendButton.disabled = false;
        sendButton.textContent = 'Send';
    }
}

function markTransactionDelivered(transactionId) {
    try {
        markAsDelivered(transactionId);
        setTimeout(() => window.location.reload(), 1500);
    } catch (error) {
        showToast(error.message, 'error');
    }
}

function confirmTransactionDelivery(transactionId) {
    try {
        confirmDelivery(transactionId);
        setTimeout(() => window.location.reload(), 1500);
    } catch (error) {
        showToast(error.message, 'error');
    }
}

// Debug function for chat
function debugChat(transactionId) {
    console.log('=== CHAT DEBUG ===');
    console.log('Transaction ID:', transactionId);
    console.log('Messages:', getMessages(transactionId));
    console.log('Current User:', getCurrentUser());
    console.log('Chat Elements:');
    console.log('- Chat card:', document.querySelector('.chat-card'));
    console.log('- Messages container:', document.getElementById('chatMessages'));
    console.log('- Input field:', document.getElementById('chatInput'));
    console.log('- Send button:', document.getElementById('sendMessage'));
    console.log('Transaction:', getTransactionById(transactionId));
    console.log('==================');
}

// Function to check if chat is visible
function checkChatVisibility() {
    const chatCard = document.querySelector('.chat-card');
    const chatMessages = document.getElementById('chatMessages');
    const chatInput = document.getElementById('chatInput');
    const sendButton = document.getElementById('sendMessage');
    
    console.log('=== CHAT VISIBILITY CHECK ===');
    console.log('Chat card exists:', !!chatCard);
    console.log('Chat card visible:', chatCard ? window.getComputedStyle(chatCard).display !== 'none' : false);
    console.log('Chat messages exists:', !!chatMessages);
    console.log('Chat input exists:', !!chatInput);
    console.log('Send button exists:', !!sendButton);
    
    if (chatMessages) {
        console.log('Chat messages content:', chatMessages.innerHTML);
    }
    
    // Get current transaction ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const transactionId = urlParams.get('id');
    console.log('Current transaction ID:', transactionId);
    
    if (transactionId) {
        const messages = getMessages(transactionId);
        console.log('Messages for this transaction:', messages);
    }
    
    console.log('================================');
}

// Function to force refresh chat
function forceRefreshChat() {
    const urlParams = new URLSearchParams(window.location.search);
    const transactionId = urlParams.get('id');
    
    if (transactionId) {
        console.log('Force refreshing chat for transaction:', transactionId);
        
        // Create sample messages
        createSampleChatMessages(transactionId);
        
        // Re-initialize chat
        const currentUser = getCurrentUser();
        if (currentUser) {
            const messages = getMessages(transactionId);
            displayChatMessages(messages, currentUser.email);
            initializeChat(transactionId, currentUser.email === getTransactionById(transactionId).buyerEmail ? 'buyer' : 'seller');
        }
    }
}

// Function to create sample chat messages
function createSampleChatMessages(transactionId) {
    const transaction = getTransactionById(transactionId);
    if (!transaction) {
        console.error('Transaction not found:', transactionId);
        return;
    }
    
    const sampleMessages = [
        {
            id: generateId(),
            senderEmail: transaction.buyerEmail,
            senderName: transaction.buyerName,
            content: 'Hi! I\'ve sent the payment. When can I expect delivery?',
            timestamp: new Date(Date.now() - 3600000).toISOString()
        },
        {
            id: generateId(),
            senderEmail: transaction.sellerEmail,
            senderName: transaction.sellerName,
            content: 'Thank you! I\'ve received the payment. I\'ll start working on it right away.',
            timestamp: new Date(Date.now() - 1800000).toISOString()
        },
        {
            id: generateId(),
            senderEmail: transaction.buyerEmail,
            senderName: transaction.buyerName,
            content: 'Great! Looking forward to it.',
            timestamp: new Date(Date.now() - 900000).toISOString()
        }
    ];
    
    sampleMessages.forEach(message => {
        const messages = getMessages(transactionId);
        messages.push(message);
        localStorage.setItem(`trusti_chat_${transactionId}`, JSON.stringify(messages));
    });
    
    console.log('Sample chat messages created for transaction:', transactionId);
    
    // Reload chat display
    const currentUser = getCurrentUser();
    if (currentUser) {
        displayChatMessages(getMessages(transactionId), currentUser.email);
    }
}

// Cleanup countdown on page unload
window.addEventListener('beforeunload', () => {
    if (countdownInterval) {
        clearInterval(countdownInterval);
    }
});