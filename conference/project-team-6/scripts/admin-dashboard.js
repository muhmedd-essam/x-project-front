// Admin dashboard functionality

document.addEventListener('DOMContentLoaded', function() {
    // Check if user is admin
    const currentUser = getCurrentUser();
    if (!currentUser || currentUser.userType !== 'admin') {
        showToast('Access denied. Admin privileges required.', 'error');
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 2000);
        return;
    }

    initializeAdminDashboard();
});

function initializeAdminDashboard() {
    // Fix any data issues first
    fixDataIssues();
    
    // Check if we have data, if not create sample data
    const users = getUsers();
    const tickets = getAllSupportTickets();
    
    if (users.length === 0) {
        console.log('No users found, creating sample data...');
        createSampleData();
    }
    
    if (tickets.length === 0) {
        console.log('No support tickets found, creating sample data...');
        createSampleData();
    }
    
    loadDashboardStats();
    loadTransactions();
    loadSupportTickets();
    loadUsers();
    
    // Initialize tab switching
    initializeTabs();
    
    // Initialize filters
    initializeFilters();
}

function initializeTabs() {
    const tabs = document.querySelectorAll('.admin-tab');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const targetTab = tab.getAttribute('data-tab');
            
            // Remove active class from all tabs and contents
            tabs.forEach(t => t.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            // Add active class to clicked tab and corresponding content
            tab.classList.add('active');
            document.getElementById(targetTab).classList.add('active');
            
            // Reload data for the active tab
            switch(targetTab) {
                case 'transactions':
                    loadTransactions();
                    break;
                case 'support':
                    loadSupportTickets();
                    break;
                case 'users':
                    loadUsers();
                    break;
            }
        });
    });
}

function initializeFilters() {
    // Transaction filters
    document.getElementById('transactionStatusFilter').addEventListener('change', loadTransactions);
    document.getElementById('transactionSortFilter').addEventListener('change', loadTransactions);
    
    // Support ticket filters
    document.getElementById('ticketStatusFilter').addEventListener('change', loadSupportTickets);
    document.getElementById('ticketPriorityFilter').addEventListener('change', loadSupportTickets);
    
    // User filters
    document.getElementById('userTypeFilter').addEventListener('change', loadUsers);
}

function loadDashboardStats() {
    const transactions = getAllTransactions();
    const users = getUsers();
    const supportTickets = getAllSupportTickets();
    
    // Calculate total revenue (completed transactions)
    const totalRevenue = transactions
        .filter(t => t.status === 'completed')
        .reduce((sum, t) => sum + t.amount, 0);
    
    document.getElementById('totalTransactions').textContent = transactions.length;
    document.getElementById('totalUsers').textContent = users.length;
    document.getElementById('openTickets').textContent = supportTickets.filter(t => t.status === 'open').length;
    document.getElementById('totalRevenue').textContent = formatCurrency(totalRevenue);
}

function loadTransactions() {
    const transactions = getAllTransactions();
    const statusFilter = document.getElementById('transactionStatusFilter').value;
    const sortFilter = document.getElementById('transactionSortFilter').value;
    
    // Apply filters
    let filteredTransactions = transactions;
    if (statusFilter) {
        filteredTransactions = filteredTransactions.filter(t => t.status === statusFilter);
    }
    
    // Apply sorting
    filteredTransactions.sort((a, b) => {
        switch (sortFilter) {
            case 'amount':
                return b.amount - a.amount;
            case 'status':
                return a.status.localeCompare(b.status);
            case 'date':
            default:
                return new Date(b.createdAt) - new Date(a.createdAt);
        }
    });
    
    const transactionsList = document.getElementById('transactionsList');
    transactionsList.innerHTML = '';
    
    if (filteredTransactions.length === 0) {
        transactionsList.innerHTML = '<p class="text-center">No transactions found.</p>';
        return;
    }
    
    filteredTransactions.forEach(transaction => {
        const transactionElement = document.createElement('div');
        transactionElement.className = 'transaction-item';
        transactionElement.innerHTML = `
            <div class="transaction-header">
                <div>
                    <h3>${transaction.description}</h3>
                    <p>ID: ${transaction.id}</p>
                </div>
                <div class="transaction-amount">${formatCurrency(transaction.amount)}</div>
            </div>
            <div class="transaction-details">
                <p><strong>Buyer:</strong> ${transaction.buyerName} (${transaction.buyerEmail})</p>
                <p><strong>Seller:</strong> ${transaction.sellerName} (${transaction.sellerEmail})</p>
                <p><strong>Status:</strong> <span class="status-badge status-${transaction.status}">${transaction.status}</span></p>
                <p><strong>Created:</strong> ${formatDate(transaction.createdAt)}</p>
                ${transaction.deliveredAt ? `<p><strong>Delivered:</strong> ${formatDate(transaction.deliveredAt)}</p>` : ''}
                ${transaction.completedAt ? `<p><strong>Completed:</strong> ${formatDate(transaction.completedAt)}</p>` : ''}
            </div>
        `;
        transactionsList.appendChild(transactionElement);
    });
}

function loadSupportTickets() {
    try {
        console.log('Loading support tickets...');
        const tickets = getAllSupportTickets();
        console.log('All tickets:', tickets);
        
        const statusFilter = document.getElementById('ticketStatusFilter').value;
        const priorityFilter = document.getElementById('ticketPriorityFilter').value;
    
    // Apply filters
    let filteredTickets = tickets;
    if (statusFilter) {
        filteredTickets = filteredTickets.filter(t => t.status === statusFilter);
    }
    if (priorityFilter) {
        filteredTickets = filteredTickets.filter(t => t.priority === priorityFilter);
    }
    
    // Sort by priority and date
    filteredTickets.sort((a, b) => {
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority];
        if (priorityDiff !== 0) return priorityDiff;
        return new Date(b.createdAt) - new Date(a.createdAt);
    });
    
    const ticketsList = document.getElementById('supportTicketsList');
    ticketsList.innerHTML = '';
    
    if (filteredTickets.length === 0) {
        ticketsList.innerHTML = '<p class="text-center">No support tickets found.</p>';
        return;
    }
    
    filteredTickets.forEach(ticket => {
        const ticketElement = document.createElement('div');
        ticketElement.className = 'support-ticket';
        ticketElement.innerHTML = `
            <div class="ticket-header">
                <div>
                    <h3>${ticket.subject}</h3>
                    <p><strong>From:</strong> ${ticket.name} (${ticket.email})</p>
                </div>
                <div>
                    <span class="ticket-priority priority-${ticket.priority}">${ticket.priority}</span>
                    <span class="ticket-status status-${ticket.status}">${ticket.status}</span>
                </div>
            </div>
            <div class="ticket-content">
                <p><strong>Category:</strong> ${ticket.category}</p>
                <p><strong>Message:</strong></p>
                <p>${ticket.message}</p>
                <p><strong>Created:</strong> ${formatDate(ticket.createdAt)}</p>
            </div>
            <div class="ticket-actions">
                ${ticket.status === 'open' ? 
                    `<button class="btn btn-success btn-small" onclick="closeTicket('${ticket.id}')">Close Ticket</button>` :
                    `<button class="btn btn-primary btn-small" onclick="reopenTicket('${ticket.id}')">Reopen Ticket</button>`
                }
                <button class="btn btn-secondary btn-small" onclick="deleteTicket('${ticket.id}')">Delete</button>
            </div>
        `;
        ticketsList.appendChild(ticketElement);
    });
    } catch (error) {
        console.error('Error loading support tickets:', error);
        const ticketsList = document.getElementById('supportTicketsList');
        if (ticketsList) {
            ticketsList.innerHTML = '<p class="text-center" style="color: red;">Error loading support tickets. Please check console for details.</p>';
        }
    }
}

function loadUsers() {
    try {
        console.log('Loading users...');
        const users = getUsers();
        console.log('All users:', users);
        
        // Fix users without createdAt
        let hasChanges = false;
        users.forEach(user => {
            if (!user.createdAt) {
                user.createdAt = new Date().toISOString();
                hasChanges = true;
            }
        });
        
        if (hasChanges) {
            // Save updated users
            localStorage.setItem('trusti_users', JSON.stringify(users));
            console.log('Fixed users without createdAt');
        }
        
        const userTypeFilter = document.getElementById('userTypeFilter').value;
    
    // Apply filters
    let filteredUsers = users;
    if (userTypeFilter) {
        filteredUsers = filteredUsers.filter(u => u.userType === userTypeFilter);
    }
    
    // Sort by registration date (handle missing createdAt)
    filteredUsers.sort((a, b) => {
        const dateA = a.createdAt ? new Date(a.createdAt) : new Date(0);
        const dateB = b.createdAt ? new Date(b.createdAt) : new Date(0);
        return dateB - dateA;
    });
    
    const usersList = document.getElementById('usersList');
    usersList.innerHTML = '';
    
    if (filteredUsers.length === 0) {
        usersList.innerHTML = '<p class="text-center">No users found.</p>';
        return;
    }
    
    filteredUsers.forEach(user => {
        const userElement = document.createElement('div');
        userElement.className = 'transaction-item';
        userElement.innerHTML = `
            <div class="transaction-header">
                <div>
                    <h3>${user.name}</h3>
                    <p>${user.email}</p>
                </div>
                <div>
                    <span class="status-badge status-${user.userType}">${user.userType}</span>
                </div>
            </div>
            <div class="transaction-details">
                <p><strong>User ID:</strong> ${user.id}</p>
                <p><strong>Registered:</strong> ${formatDate(user.createdAt)}</p>
                <p><strong>Account Type:</strong> ${user.userType}</p>
            </div>
        `;
        usersList.appendChild(userElement);
    });
    } catch (error) {
        console.error('Error loading users:', error);
        const usersList = document.getElementById('usersList');
        if (usersList) {
            usersList.innerHTML = '<p class="text-center" style="color: red;">Error loading users. Please check console for details.</p>';
        }
    }
}

function closeTicket(ticketId) {
    const ticket = getSupportTicketById(ticketId);
    if (ticket) {
        ticket.status = 'closed';
        ticket.closedAt = new Date().toISOString();
        updateSupportTicket(ticket);
        loadSupportTickets();
        loadDashboardStats();
        showToast('Ticket closed successfully', 'success');
    }
}

function reopenTicket(ticketId) {
    const ticket = getSupportTicketById(ticketId);
    if (ticket) {
        ticket.status = 'open';
        delete ticket.closedAt;
        updateSupportTicket(ticket);
        loadSupportTickets();
        loadDashboardStats();
        showToast('Ticket reopened successfully', 'success');
    }
}

function deleteTicket(ticketId) {
    if (confirm('Are you sure you want to delete this ticket?')) {
        const tickets = getAllSupportTickets();
        const filteredTickets = tickets.filter(t => t.id !== ticketId);
        localStorage.setItem('trusti_support_tickets', JSON.stringify(filteredTickets));
        loadSupportTickets();
        loadDashboardStats();
        showToast('Ticket deleted successfully', 'success');
    }
}

// Debug function to check data
function debugAdminData() {
    console.log('=== ADMIN DEBUG ===');
    console.log('Users:', getUsers());
    console.log('Support Tickets:', getAllSupportTickets());
    console.log('Transactions:', getAllTransactions());
    console.log('Current User:', getCurrentUser());
    console.log('==================');
}

// Function to fix all data issues
function fixDataIssues() {
    console.log('Fixing data issues...');
    
    // Fix users
    const users = getUsers();
    let usersChanged = false;
    users.forEach(user => {
        if (!user.createdAt) {
            user.createdAt = new Date().toISOString();
            usersChanged = true;
        }
    });
    
    if (usersChanged) {
        localStorage.setItem('trusti_users', JSON.stringify(users));
        console.log('Fixed users data');
    }
    
    // Fix transactions
    const transactions = getAllTransactions();
    let transactionsChanged = false;
    transactions.forEach(transaction => {
        if (!transaction.createdAt) {
            transaction.createdAt = new Date().toISOString();
            transactionsChanged = true;
        }
    });
    
    if (transactionsChanged) {
        localStorage.setItem('trusti_transactions', JSON.stringify(transactions));
        console.log('Fixed transactions data');
    }
    
    // Fix support tickets
    const tickets = getAllSupportTickets();
    let ticketsChanged = false;
    tickets.forEach(ticket => {
        if (!ticket.createdAt) {
            ticket.createdAt = new Date().toISOString();
            ticketsChanged = true;
        }
    });
    
    if (ticketsChanged) {
        localStorage.setItem('trusti_support_tickets', JSON.stringify(tickets));
        console.log('Fixed support tickets data');
    }
    
    console.log('Data issues fixed');
    return { usersChanged, transactionsChanged, ticketsChanged };
}

// Function to manually create sample data
function createSampleData() {
    // Create sample support tickets
    const sampleTickets = [
        {
            id: 'ticket1',
            name: 'John Buyer',
            email: 'buyer@example.com',
            subject: 'Payment Issue',
            priority: 'high',
            category: 'payment',
            message: 'I made a payment but it\'s not showing in my transaction history. Please help!',
            status: 'open',
            createdAt: new Date(Date.now() - 86400000).toISOString(),
            userId: 'buyer1'
        },
        {
            id: 'ticket2',
            name: 'Jane Seller',
            email: 'seller@example.com',
            subject: 'Account Verification',
            priority: 'medium',
            category: 'account',
            message: 'I need help with account verification process. How long does it usually take?',
            status: 'open',
            createdAt: new Date(Date.now() - 172800000).toISOString(),
            userId: 'seller1'
        },
        {
            id: 'ticket3',
            name: 'Mike Customer',
            email: 'mike@example.com',
            subject: 'Technical Problem',
            priority: 'low',
            category: 'technical',
            message: 'The website is loading slowly. Is there a maintenance going on?',
            status: 'closed',
            createdAt: new Date(Date.now() - 259200000).toISOString(), // 3 days ago
            userId: 'buyer2'
        }
    ];
    
    sampleTickets.forEach(ticket => saveSupportTicket(ticket));
    console.log('Sample support tickets created');
    
    // Create sample transactions if none exist
    const transactions = getAllTransactions();
    if (transactions.length === 0) {
        const sampleTransactions = [
            {
                id: 'trans1',
                buyerEmail: 'buyer@example.com',
                buyerName: 'John Buyer',
                sellerEmail: 'seller@example.com',
                sellerName: 'Jane Seller',
                amount: 150.00,
                description: 'Web Design Service',
                deliveryDays: 7,
                status: 'pending',
                createdAt: new Date(Date.now() - 86400000).toISOString(),
                expiryDate: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000).toISOString()
            },
            {
                id: 'trans2',
                buyerEmail: 'mike@example.com',
                buyerName: 'Mike Customer',
                sellerEmail: 'seller@example.com',
                sellerName: 'Jane Seller',
                amount: 75.50,
                description: 'Logo Design',
                deliveryDays: 3,
                status: 'completed',
                createdAt: new Date(Date.now() - 172800000).toISOString(),
                deliveredAt: new Date(Date.now() - 86400000).toISOString(),
                completedAt: new Date(Date.now() - 43200000).toISOString()
            }
        ];
        
        sampleTransactions.forEach(transaction => saveTransaction(transaction));
        console.log('Sample transactions created');
    }
    
    // Refresh the display
    loadSupportTickets();
    loadDashboardStats();
} 