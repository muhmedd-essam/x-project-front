// LocalStorage management for Trusti application

// User management
function saveUser(user) {
    const users = getUsers();
    users.push(user);
    localStorage.setItem('trusti_users', JSON.stringify(users));
}

function getUsers() {
    const usersStr = localStorage.getItem('trusti_users');
    return usersStr ? JSON.parse(usersStr) : [];
}

function findUserByEmail(email) {
    const users = getUsers();
    return users.find(user => user.email === email);
}

function setCurrentUser(user) {
    localStorage.setItem('trusti_current_user', JSON.stringify(user));
}

// Transaction management
function saveTransaction(transaction) {
    const transactions = getAllTransactions();
    transactions.push(transaction);
    localStorage.setItem('trusti_transactions', JSON.stringify(transactions));
}

function getAllTransactions() {
    const transactionsStr = localStorage.getItem('trusti_transactions');
    return transactionsStr ? JSON.parse(transactionsStr) : [];
}

function getTransactionById(id) {
    const transactions = getAllTransactions();
    return transactions.find(transaction => transaction.id === id);
}

function updateTransaction(updatedTransaction) {
    const transactions = getAllTransactions();
    const index = transactions.findIndex(t => t.id === updatedTransaction.id);
    if (index !== -1) {
        transactions[index] = updatedTransaction;
        localStorage.setItem('trusti_transactions', JSON.stringify(transactions));
        return true;
    }
    return false;
}

function saveTransactions(transactions) {
    localStorage.setItem('trusti_transactions', JSON.stringify(transactions));
}

function getTransactionsByBuyer(buyerEmail) {
    const transactions = getAllTransactions();
    return transactions.filter(t => t.buyerEmail === buyerEmail);
}

function getTransactionsBySeller(sellerEmail) {
    const transactions = getAllTransactions();
    return transactions.filter(t => t.sellerEmail === sellerEmail);
}

// Chat management
function saveMessage(transactionId, message) {
    const messages = getMessages(transactionId);
    messages.push({
        ...message,
        id: generateId(),
        timestamp: new Date().toISOString()
    });
    localStorage.setItem(`trusti_chat_${transactionId}`, JSON.stringify(messages));
}

function getMessages(transactionId) {
    const messagesStr = localStorage.getItem(`trusti_chat_${transactionId}`);
    return messagesStr ? JSON.parse(messagesStr) : [];
}

// Support ticket management
function saveSupportTicket(ticket) {
    const tickets = getAllSupportTickets();
    tickets.push(ticket);
    localStorage.setItem('trusti_support_tickets', JSON.stringify(tickets));
}

function getAllSupportTickets() {
    const ticketsStr = localStorage.getItem('trusti_support_tickets');
    return ticketsStr ? JSON.parse(ticketsStr) : [];
}

function getSupportTicketById(id) {
    const tickets = getAllSupportTickets();
    return tickets.find(ticket => ticket.id === id);
}

function updateSupportTicket(updatedTicket) {
    const tickets = getAllSupportTickets();
    const index = tickets.findIndex(t => t.id === updatedTicket.id);
    if (index !== -1) {
        tickets[index] = updatedTicket;
        localStorage.setItem('trusti_support_tickets', JSON.stringify(tickets));
        return true;
    }
    return false;
}

function getSupportTicketsByStatus(status) {
    const tickets = getAllSupportTickets();
    return tickets.filter(ticket => ticket.status === status);
}

function getSupportTicketsByPriority(priority) {
    const tickets = getAllSupportTickets();
    return tickets.filter(ticket => ticket.priority === priority);
}

// Initialize sample data only once
function initializeSampleData() {
    try {
        const users = getUsers();
        
        // Add sample users if none exist
        if (users.length === 0) {
            const sampleUsers = [
                {
                    id: 'buyer1',
                    name: 'John Buyer',
                    email: 'buyer@example.com',
                    password: 'password',
                    userType: 'buyer'
                },
                {
                    id: 'seller1',
                    name: 'Jane Seller',
                    email: 'seller@example.com',
                    password: 'password',
                    userType: 'seller'
                },
                {
                    id: 'admin1',
                    name: 'Admin User',
                    email: 'admin@trusti.com',
                    password: 'admin123',
                    userType: 'admin'
                }
            ];
            
            sampleUsers.forEach(user => saveUser(user));
        }
        
        // Add sample support tickets if none exist
        const tickets = getAllSupportTickets();
        if (tickets.length === 0) {
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
                    createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
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
                    createdAt: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
                    userId: 'seller1'
                }
            ];
            
                    sampleTickets.forEach(ticket => saveSupportTicket(ticket));
    }
    
    // Add sample chat messages if none exist
    const transactions = getAllTransactions();
    if (transactions.length > 0) {
        const firstTransaction = transactions[0];
        const existingMessages = getMessages(firstTransaction.id);
        
        if (existingMessages.length === 0) {
            const sampleMessages = [
                {
                    id: generateId(),
                    senderEmail: firstTransaction.buyerEmail,
                    senderName: firstTransaction.buyerName,
                    content: 'Hi! I\'ve sent the payment. When can I expect delivery?',
                    timestamp: new Date(Date.now() - 3600000).toISOString() // 1 hour ago
                },
                {
                    id: generateId(),
                    senderEmail: firstTransaction.sellerEmail,
                    senderName: firstTransaction.sellerName,
                    content: 'Thank you! I\'ve received the payment. I\'ll start working on it right away.',
                    timestamp: new Date(Date.now() - 1800000).toISOString() // 30 minutes ago
                },
                {
                    id: generateId(),
                    senderEmail: firstTransaction.buyerEmail,
                    senderName: firstTransaction.buyerName,
                    content: 'Great! Looking forward to it.',
                    timestamp: new Date(Date.now() - 900000).toISOString() // 15 minutes ago
                }
            ];
            
            sampleMessages.forEach(message => {
                const messages = getMessages(firstTransaction.id);
                messages.push(message);
                localStorage.setItem(`trusti_chat_${firstTransaction.id}`, JSON.stringify(messages));
            });
            
            console.log('Sample chat messages created for transaction:', firstTransaction.id);
        }
    }
} catch (error) {
    console.error('Error initializing sample data:', error);
}
}

// Ensure admin user exists
function ensureAdminUser() {
    const users = getUsers();
    const adminUser = users.find(user => user.userType === 'admin');
    
    if (!adminUser) {
        const newAdmin = {
            id: 'admin1',
            name: 'Admin User',
            email: 'admin@trusti.com',
            password: 'admin123',
            userType: 'admin',
            createdAt: new Date().toISOString()
        };
        saveUser(newAdmin);
        console.log('Admin user created');
    }
}

// Debug function to check users
function debugUsers() {
    const users = getUsers();
    console.log('All users:', users);
    const adminUser = users.find(user => user.userType === 'admin');
    console.log('Admin user:', adminUser);
}

// Helper function to create admin user manually
function createAdminUser() {
    const newAdmin = {
        id: 'admin1',
        name: 'Admin User',
        email: 'admin@trusti.com',
        password: 'admin123',
        userType: 'admin',
        createdAt: new Date().toISOString()
    };
    saveUser(newAdmin);
    console.log('Admin user created manually');
    return newAdmin;
}

// Helper function to reset all data and recreate sample data
function resetAllData() {
    localStorage.removeItem('trusti_users');
    localStorage.removeItem('trusti_transactions');
    localStorage.removeItem('trusti_support_tickets');
    localStorage.removeItem('trusti_current_user');
    console.log('All data cleared');
    initializeSampleData();
    ensureAdminUser();
    console.log('Sample data recreated');
}

// Initialize sample data when the script loads (only if localStorage is available)
if (typeof localStorage !== 'undefined') {
    initializeSampleData();
    ensureAdminUser(); // Ensure admin user exists
    debugUsers(); // Debug: show users in console
}