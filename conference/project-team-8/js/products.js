// Product display and management

function createProductCard(product, currentCategory) {
    const categoryEmoji = {
        'shop': '🛍️',
        'learn': '📚',
        'materials': '✂️'
    };

    const imageDisplay = product.image && product.image.startsWith('http') 
        ? `<img src="${product.image}" alt="${product.title}" class="product-image">` 
        : `<div class="product-image">${categoryEmoji[product.category] || '📦'}</div>`;

    const metaInfo = product.category === 'learn' 
        ? `<div class="product-meta">
            <span class="product-teacher">by ${product.teacher}</span>
            <span class="product-rating">⭐ ${product.rating}</span>
           </div>
           <div class="product-duration">${product.duration} • ${product.students} students</div>`
        : product.category === 'materials'
        ? `<div class="product-meta">
            <span class="product-teacher">${product.brand}</span>
            <span class="product-rating">⭐ ${product.rating}</span>
           </div>`
        : `<div class="product-meta">
            <span class="product-teacher">by ${product.seller}</span>
            <span class="product-rating">⭐ ${product.rating}</span>
           </div>`;

    return `
        <div class="product-card" onclick="viewProduct('${product.id}')">
            ${imageDisplay}
            <div class="product-info">
                <h3 class="product-title">${product.title}</h3>
                <p class="product-description">${product.description}</p>
                <div class="product-price">$${product.price.toFixed(2)}</div>
                ${metaInfo}
                <button class="btn btn-primary" onclick="event.stopPropagation(); cart.addItem('${product.id}')" style="width: 100%; margin-top: 16px;">
                    ${product.category === 'learn' ? 'Enroll Now' : 'Add to Cart'}
                </button>
            </div>
        </div>
    `;
}

function viewProduct(productId) {
    localStorage.setItem('current-product', productId);
    window.location.href = 'product.html';
}

function loadProducts(category) {
    const container = document.getElementById('products-container');
    if (!container) return;

    const products = getProductsByCategory(category);
    
    if (products.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <h3>No products found</h3>
                <p>Check back soon for new items!</p>
            </div>
        `;
        return;
    }

    container.innerHTML = products.map(product => createProductCard(product, category)).join('');
}

function loadProductDetail() {
    const productId = localStorage.getItem('current-product');
    const product = getProductById(productId);
    
    if (!product) {
        document.body.innerHTML = `
            <div class="container" style="padding: 48px 16px; text-align: center;">
                <h2>Product not found</h2>
                <p>The product you're looking for doesn't exist.</p>
                <a href="index.html" class="btn btn-primary">Go Home</a>
            </div>
        `;
        return;
    }

    const imageDisplay = product.image && product.image.startsWith('http') 
        ? `<img src="${product.image}" alt="${product.title}" style="width: 100%; height: 400px; object-fit: cover; border-radius: 12px;">` 
        : `<div style="width: 100%; height: 400px; background: var(--gray-light); border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 6rem;">${getEmojiForCategory(product.category)}</div>`;

    const metaInfo = product.category === 'learn' 
        ? `<div class="product-meta-detail">
            <p><strong>Instructor:</strong> ${product.teacher}</p>
            <p><strong>Duration:</strong> ${product.duration}</p>
            <p><strong>Students:</strong> ${product.students}</p>
            <p><strong>Rating:</strong> ⭐ ${product.rating}</p>
           </div>`
        : product.category === 'materials'
        ? `<div class="product-meta-detail">
            <p><strong>Brand:</strong> ${product.brand}</p>
            <p><strong>Rating:</strong> ⭐ ${product.rating}</p>
            <p><strong>In Stock:</strong> ${product.stock} items</p>
           </div>`
        : `<div class="product-meta-detail">
            <p><strong>Artisan:</strong> ${product.seller}</p>
            <p><strong>Rating:</strong> ⭐ ${product.rating}</p>
            <p><strong>In Stock:</strong> ${product.stock} items</p>
           </div>`;

    document.getElementById('product-detail').innerHTML = `
        <div class="container">
            <div class="product-detail-grid">
                <div class="product-detail-image">
                    ${imageDisplay}
                </div>
                <div class="product-detail-info">
                    <h1 class="product-detail-title">${product.title}</h1>
                    <div class="product-detail-price">$${product.price.toFixed(2)}</div>
                    <div class="product-detail-description">
                        <p>${product.description}</p>
                    </div>
                    ${metaInfo}
                    <div class="product-detail-actions">
                        <button class="btn btn-primary btn-large" onclick="cart.addItem('${product.id}')">
                            ${product.category === 'learn' ? 'Enroll in Course' : 'Add to Cart'}
                        </button>
                        <button class="btn btn-outline" onclick="window.history.back()">Back</button>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function getEmojiForCategory(category) {
    const emojis = {
        'shop': '🛍️',
        'learn': '📚',
        'materials': '✂️'
    };
    return emojis[category] || '📦';
}

// Search functionality
function setupSearch() {
    const searchInput = document.getElementById('search-input');
    const searchBtn = document.getElementById('search-btn');
    
    if (searchInput && searchBtn) {
        searchBtn.addEventListener('click', performSearch);
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                performSearch();
            }
        });
    }
}

function performSearch() {
    const searchInput = document.getElementById('search-input');
    const query = searchInput.value.toLowerCase().trim();
    
    if (!query) return;

    const allProducts = getAllProducts();
    const results = allProducts.filter(product => 
        product.title.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query)
    );

    const container = document.getElementById('products-container');
    if (container) {
        if (results.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <h3>No results found</h3>
                    <p>Try searching with different keywords.</p>
                </div>
            `;
        } else {
            container.innerHTML = results.map(product => createProductCard(product, product.category)).join('');
        }
    }
}