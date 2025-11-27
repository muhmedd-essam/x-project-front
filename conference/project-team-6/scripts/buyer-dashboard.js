// Buyer dashboard functionality

document.addEventListener('DOMContentLoaded', function() {
    if (!requireAuth()) return;

    const currentUser = getCurrentUser();
    if (currentUser.userType !== 'buyer') {
        showToast('Access denied. Buyer account required.', 'error');
        setTimeout(() => window.location.href = 'index.html', 2000);
        return;
    }

    loadBuyerTransactions();
    
    // Handle deposit form submission
    const depositForm = document.getElementById('depositForm');
    if (depositForm) {
        depositForm.addEventListener('submit', handleDepositSubmission);
    }
});

function handleDepositSubmission(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const transactionData = {
        amount: formData.get('amount'),
        description: formData.get('description'),
        sellerEmail: formData.get('sellerEmail'),
        deliveryDays: formData.get('deliveryDays')
    };

    try {
        // Validate seller exists
        const seller = findUserByEmail(transactionData.sellerEmail);
        if (!seller) {
            showToast('Seller with this email address not found', 'error');
            return;
        }
        
        if (seller.userType !== 'seller') {
            showToast('The email address does not belong to a seller account', 'error');
            return;
        }

        // Create transaction
        const transaction = createTransaction(transactionData);
        
        showToast(
            `Deposit sent successfully! Transaction ID: ${transaction.id}`,
            'success'
        );
        
        // Reset form
        event.target.reset();
        
        // Reload transactions
        loadBuyerTransactions();
        
    } catch (error) {
        showToast(error.message, 'error');
    }
}

function loadBuyerTransactions() {
    const currentUser = getCurrentUser();
    const transactions = getTransactionsByBuyer(currentUser.email);
    const transactionsList = document.getElementById('transactionsList');
    
    if (!transactionsList) return;
    
    if (transactions.length === 0) {
        transactionsList.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">📦</div>
                <h3>No transactions yet</h3>
                <p>Create your first escrow transaction by sending a deposit.</p>
            </div>
        `;
        return;
    }
    
    // Sort transactions by creation date (newest first)
    transactions.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    transactionsList.innerHTML = '';
    transactions.forEach(transaction => {
        const card = renderTransactionCard(transaction, 'buyer');
        transactionsList.appendChild(card);
    });
}