// Cart functionality

class Cart {
    constructor() {
        this.items = JSON.parse(localStorage.getItem('arty-cart')) || [];
        this.updateCartDisplay();
    }

    addItem(productId, quantity = 1) {
        const product = getProductById(productId);
        if (!product) return false;

        const existingItem = this.items.find(item => item.id === productId);
        
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            this.items.push({
                id: productId,
                quantity: quantity,
                ...product
            });
        }
        
        this.saveCart();
        this.updateCartDisplay();
        this.showNotification(`${product.title} added to cart!`);
        return true;
    }

    removeItem(productId) {
        this.items = this.items.filter(item => item.id !== productId);
        this.saveCart();
        this.updateCartDisplay();
        this.renderCartPage();
    }

    updateQuantity(productId, quantity) {
        const item = this.items.find(item => item.id === productId);
        if (item) {
            if (quantity <= 0) {
                this.removeItem(productId);
            } else {
                item.quantity = quantity;
                this.saveCart();
                this.updateCartDisplay();
                this.renderCartPage();
            }
        }
    }

    getTotal() {
        return this.items.reduce((total, item) => total + (item.price * item.quantity), 0);
    }

    getItemCount() {
        return this.items.reduce((count, item) => count + item.quantity, 0);
    }

    clear() {
        this.items = [];
        this.saveCart();
        this.updateCartDisplay();
        this.renderCartPage();
    }

    saveCart() {
        localStorage.setItem('arty-cart', JSON.stringify(this.items));
    }

    updateCartDisplay() {
        const cartCountElement = document.getElementById('cart-count');
        if (cartCountElement) {
            cartCountElement.textContent = this.getItemCount();
        }
    }

    renderCartPage() {
        const cartContainer = document.getElementById('cart-items');
        const cartSummary = document.getElementById('cart-summary');
        
        if (!cartContainer) return;

        if (this.items.length === 0) {
            cartContainer.innerHTML = `
                <div class="empty-state">
                    <h3>Your cart is empty</h3>
                    <p>Add some amazing handmade items to get started!</p>
                    <a href="shop.html" class="btn btn-primary">Start Shopping</a>
                </div>
            `;
            if (cartSummary) cartSummary.style.display = 'none';
            return;
        }

        cartContainer.innerHTML = this.items.map(item => `
            <div class="cart-item">
                <div class="cart-item-image">
                    ${this.getImageDisplay(item)}
                </div>
                <div class="cart-item-info">
                    <h4 class="cart-item-title">${item.title}</h4>
                    <p class="cart-item-price">$${item.price.toFixed(2)}</p>
                </div>
                <div class="cart-item-controls">
                    <div class="quantity-controls">
                        <button class="quantity-btn" onclick="cart.updateQuantity('${item.id}', ${item.quantity - 1})">-</button>
                        <span class="quantity-display">${item.quantity}</span>
                        <button class="quantity-btn" onclick="cart.updateQuantity('${item.id}', ${item.quantity + 1})">+</button>
                    </div>
                    <button class="remove-btn" onclick="cart.removeItem('${item.id}')">Remove</button>
                </div>
            </div>
        `).join('');

        if (cartSummary) {
            cartSummary.style.display = 'block';
            cartSummary.innerHTML = `
                <div class="cart-total">Total: $${this.getTotal().toFixed(2)}</div>
                <a href="checkout.html" class="btn btn-primary" style="width: 100%;">Proceed to Checkout</a>
            `;
        }
    }

    getImageDisplay(item) {
        if (item.image && item.image.startsWith('http')) {
            return `<img src="${item.image}" alt="${item.title}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 8px;">`;
        }
        return this.getCategoryEmoji(item.category);
    }

    getCategoryEmoji(category) {
        const emojis = {
            'shop': '🛍️',
            'learn': '📚',
            'materials': '✂️'
        };
        return emojis[category] || '📦';
    }

    showNotification(message) {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = 'notification success-message';
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 90px;
            right: 20px;
            z-index: 1001;
            min-width: 250px;
            animation: slideIn 0.3s ease;
        `;

        document.body.appendChild(notification);

        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
}

// Initialize cart
const cart = new Cart();

// Add notification animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);