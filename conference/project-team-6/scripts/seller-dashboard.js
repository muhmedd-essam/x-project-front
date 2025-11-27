// Seller dashboard functionality

document.addEventListener('DOMContentLoaded', function() {
    if (!requireAuth()) return;

    const currentUser = getCurrentUser();
    if (currentUser.userType !== 'seller') {
        showToast('Access denied. Seller account required.', 'error');
        setTimeout(() => window.location.href = 'index.html', 2000);
        return;
    }

    loadSellerStats();
    loadSellerTransactions();
});

function loadSellerStats() {
    const currentUser = getCurrentUser();
    const transactions = getTransactionsBySeller(currentUser.email);
    
    // Calculate stats
    const pendingCount = transactions.filter(t => getTransactionStatus(t) === 'pending').length;
    const completedCount = transactions.filter(t => getTransactionStatus(t) === 'completed').length;
    const totalEarnings = transactions
        .filter(t => getTransactionStatus(t) === 'completed')
        .reduce((sum, t) => sum + t.amount, 0);
    
    // Update display
    const pendingElement = document.getElementById('pendingCount');
    const completedElement = document.getElementById('completedCount');
    const earningsElement = document.getElementById('totalEarnings');
    
    if (pendingElement) pendingElement.textContent = pendingCount;
    if (completedElement) completedElement.textContent = completedCount;
    if (earningsElement) earningsElement.textContent = formatCurrency(totalEarnings);
}

function loadSellerTransactions() {
    const currentUser = getCurrentUser();
    const transactions = getTransactionsBySeller(currentUser.email);
    const transactionsList = document.getElementById('transactionsList');
    
    if (!transactionsList) return;
    
    if (transactions.length === 0) {
        transactionsList.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">📋</div>
                <h3>No orders yet</h3>
                <p>You'll see incoming orders here when buyers send deposits.</p>
            </div>
        `;
        return;
    }
    
    // Sort transactions by status priority and creation date
    transactions.sort((a, b) => {
        const statusOrder = { 'pending': 0, 'delivered': 1, 'completed': 2, 'expired': 3 };
        const aStatus = getTransactionStatus(a);
        const bStatus = getTransactionStatus(b);
        
        if (statusOrder[aStatus] !== statusOrder[bStatus]) {
            return statusOrder[aStatus] - statusOrder[bStatus];
        }
        
        return new Date(b.createdAt) - new Date(a.createdAt);
    });
    
    transactionsList.innerHTML = '';
    transactions.forEach(transaction => {
        const card = renderTransactionCard(transaction, 'seller');
        transactionsList.appendChild(card);
    });
}