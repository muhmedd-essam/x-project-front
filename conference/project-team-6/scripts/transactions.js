// Transaction management functions

function createTransaction(transactionData) {
    const currentUser = getCurrentUser();
    if (!currentUser) {
        throw new Error('User not authenticated');
    }

    // Calculate expiry date
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + parseInt(transactionData.deliveryDays));

    const transaction = {
        id: generateId(),
        buyerEmail: currentUser.email,
        buyerName: currentUser.name,
        sellerEmail: transactionData.sellerEmail,
        sellerName: transactionData.sellerEmail, // Will be updated when seller is found
        amount: parseFloat(transactionData.amount),
        description: transactionData.description,
        deliveryDays: parseInt(transactionData.deliveryDays),
        status: 'pending',
        createdAt: new Date().toISOString(),
        expiryDate: expiryDate.toISOString(),
        deliveredAt: null,
        completedAt: null
    };

    // Try to find seller name
    const seller = findUserByEmail(transactionData.sellerEmail);
    if (seller) {
        transaction.sellerName = seller.name;
    }

    saveTransaction(transaction);
    return transaction;
}

function markAsDelivered(transactionId) {
    const transaction = getTransactionById(transactionId);
    if (!transaction) {
        throw new Error('Transaction not found');
    }

    if (transaction.status !== 'pending') {
        throw new Error('Transaction cannot be marked as delivered');
    }

    transaction.status = 'delivered';
    transaction.deliveredAt = new Date().toISOString();
    
    updateTransaction(transaction);
    
    showToast('Transaction marked as delivered. Waiting for buyer confirmation.', 'success');
    
    return transaction;
}

function confirmDelivery(transactionId) {
    const transaction = getTransactionById(transactionId);
    if (!transaction) {
        throw new Error('Transaction not found');
    }

    if (transaction.status !== 'delivered') {
        throw new Error('Transaction must be delivered before confirmation');
    }

    transaction.status = 'completed';
    transaction.completedAt = new Date().toISOString();
    
    updateTransaction(transaction);
    
    showToast('Delivery confirmed! Funds have been released to the seller.', 'success');
    
    return transaction;
}

function getTransactionStatus(transaction) {
    const now = new Date();
    const expiryDate = new Date(transaction.expiryDate);
    
    // Check if expired
    if (now > expiryDate && (transaction.status === 'pending' || transaction.status === 'delivered')) {
        return 'expired';
    }
    
    return transaction.status;
}

function renderTransactionCard(transaction, userType) {
    const status = getTransactionStatus(transaction);
    const isExpired = status === 'expired';
    
    const card = document.createElement('div');
    card.className = 'transaction-item';
    card.onclick = () => window.location.href = `transaction.html?id=${transaction.id}`;

    const otherParty = userType === 'buyer' ? 
        `Seller: ${transaction.sellerName}` : 
        `Buyer: ${transaction.buyerName}`;

    card.innerHTML = `
        <div class="transaction-header">
            <div class="transaction-info">
                <div class="transaction-id">ID: ${transaction.id}</div>
                <div class="transaction-description">${transaction.description}</div>
                <div class="transaction-amount">${formatCurrency(transaction.amount)}</div>
            </div>
            <div class="status-badge status-${isExpired ? 'expired' : status}">
                ${isExpired ? 'Expired' : status}
            </div>
        </div>
        <div class="transaction-details">
            <div class="detail-item">
                <span class="detail-label">Other Party</span>
                <span class="detail-value">${otherParty}</span>
            </div>
            <div class="detail-item">
                <span class="detail-label">Created</span>
                <span class="detail-value">${formatRelativeTime(transaction.createdAt)}</span>
            </div>
            <div class="detail-item">
                <span class="detail-label">Delivery Time</span>
                <span class="detail-value">${transaction.deliveryDays} days</span>
            </div>
            ${isExpired ? '' : getStatusSpecificDetails(transaction, userType)}
        </div>
        ${getActionButtons(transaction, userType)}
    `;

    return card;
}

function getStatusSpecificDetails(transaction, userType) {
    const status = transaction.status;
    
    if (status === 'pending' || status === 'delivered') {
        const now = new Date();
        const expiryDate = new Date(transaction.expiryDate);
        const timeLeft = expiryDate - now;
        const daysLeft = Math.ceil(timeLeft / (1000 * 60 * 60 * 24));
        
        return `
            <div class="detail-item">
                <span class="detail-label">Time Remaining</span>
                <span class="detail-value">${daysLeft > 0 ? `${daysLeft} days` : 'Expires soon'}</span>
            </div>
        `;
    }
    
    return '';
}

function getActionButtons(transaction, userType) {
    const status = getTransactionStatus(transaction);
    let buttons = '';

    if (status === 'pending' && userType === 'seller') {
        buttons += `
            <div class="transaction-actions">
                <button onclick="event.stopPropagation(); handleDelivered('${transaction.id}')" class="btn btn-success">
                    Mark as Delivered
                </button>
            </div>
        `;
    } else if (status === 'delivered' && userType === 'buyer') {
        buttons += `
            <div class="transaction-actions">
                <button onclick="event.stopPropagation(); handleConfirmDelivery('${transaction.id}')" class="btn btn-success">
                    Confirm Delivery
                </button>
            </div>
        `;
    }

    return buttons;
}

// Global action handlers
function handleDelivered(transactionId) {
    try {
        markAsDelivered(transactionId);
        // Reload the current page to show updated status
        window.location.reload();
    } catch (error) {
        showToast(error.message, 'error');
    }
}

function handleConfirmDelivery(transactionId) {
    try {
        confirmDelivery(transactionId);
        // Reload the current page to show updated status
        window.location.reload();
    } catch (error) {
        showToast(error.message, 'error');
    }
}