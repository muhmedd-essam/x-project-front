// Dummy data for the Arty store

// Shop Products (Handmade Items)
const shopProducts = [
    {
        id: 'shop-1',
        title: 'Handwoven Boho Bag',
        description: 'Beautiful handwoven bag perfect for everyday use. Made with sustainable materials.',
        price: 45.99,
        image: 'https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg',
        category: 'shop',
        seller: 'Emma Craft',
        rating: 4.8,
        stock: 12
    },
    {
        id: 'shop-2',
        title: 'Lavender Soy Candle',
        description: 'Hand-poured soy candle with natural lavender essential oil. Burns for 40+ hours.',
        price: 28.50,
        image: 'https://images.pexels.com/photos/6489663/pexels-photo-6489663.jpeg',
        category: 'shop',
        seller: 'Sarah Light',
        rating: 4.9,
        stock: 8
    },
    {
        id: 'shop-3',
        title: 'Crochet Baby Blanket',
        description: 'Soft and cozy baby blanket crocheted with organic cotton yarn in pastel colors.',
        price: 65.00,
        image: 'https://images.pexels.com/photos/8636707/pexels-photo-8636707.jpeg',
        category: 'shop',
        seller: 'Maya Threads',
        rating: 5.0,
        stock: 5
    },
    {
        id: 'shop-4',
        title: 'Sterling Silver Earrings',
        description: 'Handcrafted sterling silver earrings with turquoise stones. Perfect for any occasion.',
        price: 89.99,
        image: 'https://images.pexels.com/photos/1454673/pexels-photo-1454673.jpeg',
        category: 'shop',
        seller: 'Luna Jewelry',
        rating: 4.7,
        stock: 15
    },
    {
        id: 'shop-5',
        title: 'Ceramic Coffee Mug Set',
        description: 'Set of 2 handmade ceramic mugs with unique glazed finish. Microwave and dishwasher safe.',
        price: 32.00,
        image: 'https://images.pexels.com/photos/6267/coffee-cup-mug-blue.jpg',
        category: 'shop',
        seller: 'Clay & Co',
        rating: 4.6,
        stock: 20
    },
    {
        id: 'shop-6',
        title: 'Macrame Wall Hanging',
        description: 'Beautiful macrame wall hanging made with natural cotton cord. Adds boho charm to any space.',
        price: 55.75,
        image: 'https://images.pexels.com/photos/6585759/pexels-photo-6585759.jpeg',
        category: 'shop',
        seller: 'Knot Art Studio',
        rating: 4.8,
        stock: 7
    },
    {
        id: 'shop-7',
        title: 'Wooden Cutting Board',
        description: 'Handcrafted cutting board made from sustainable bamboo. Perfect for kitchen use.',
        price: 38.25,
        image: 'https://images.pexels.com/photos/4109743/pexels-photo-4109743.jpeg',
        category: 'shop',
        seller: 'Wood Works',
        rating: 4.9,
        stock: 18
    },
    {
        id: 'shop-8',
        title: 'Hand-painted Scarf',
        description: 'Silk scarf with hand-painted floral design. Each piece is unique and one-of-a-kind.',
        price: 72.50,
        image: 'https://images.pexels.com/photos/5867718/pexels-photo-5867718.jpeg',
        category: 'shop',
        seller: 'Silk Dreams',
        rating: 4.7,
        stock: 9
    },
    {
        id: 'shop-9',
        title: 'Leather Passport Holder',
        description: 'Genuine leather passport holder with hand-stitched details. Perfect for travelers.',
        price: 42.00,
        image: 'https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg',
        category: 'shop',
        seller: 'Leather Legacy',
        rating: 4.8,
        stock: 14
    },
    {
        id: 'shop-10',
        title: 'Handmade Soap Set',
        description: 'Set of 4 natural handmade soaps with essential oils. Vegan and cruelty-free.',
        price: 24.99,
        image: 'https://images.pexels.com/photos/4465828/pexels-photo-4465828.jpeg',
        category: 'shop',
        seller: 'Pure Naturals',
        rating: 4.9,
        stock: 25
    }
];

// Learn Products (Tutorials and Courses)
const learnProducts = [
    {
        id: 'learn-1',
        title: 'DIY Tote Bag Masterclass',
        description: 'Learn to create your own stylish tote bag from scratch. Includes patterns and video tutorials.',
        price: 29.99,
        image: 'https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg',
        category: 'learn',
        teacher: 'Emma Craft',
        rating: 4.9,
        duration: '3 hours',
        students: 1250
    },
    {
        id: 'learn-2',
        title: 'Crochet Basics for Beginners',
        description: 'Complete beginner course covering all basic crochet stitches and techniques.',
        price: 39.99,
        image: 'https://images.pexels.com/photos/8636707/pexels-photo-8636707.jpeg',
        category: 'learn',
        teacher: 'Maya Threads',
        rating: 4.8,
        duration: '5 hours',
        students: 2100
    },
    {
        id: 'learn-3',
        title: 'Candle Making Workshop',
        description: 'Learn the art of candle making with soy wax, wicks, and natural fragrances.',
        price: 34.99,
        image: 'https://images.pexels.com/photos/6489663/pexels-photo-6489663.jpeg',
        category: 'learn',
        teacher: 'Sarah Light',
        rating: 4.7,
        duration: '2.5 hours',
        students: 890
    },
    {
        id: 'learn-4',
        title: 'Jewelry Making Fundamentals',
        description: 'Create beautiful jewelry pieces using wire wrapping and beading techniques.',
        price: 49.99,
        image: 'https://images.pexels.com/photos/1454673/pexels-photo-1454673.jpeg',
        category: 'learn',
        teacher: 'Luna Jewelry',
        rating: 4.9,
        duration: '4 hours',
        students: 1650
    },
    {
        id: 'learn-5',
        title: 'Macrame Wall Art Course',
        description: 'Master the art of macrame and create stunning wall hangings for your home.',
        price: 44.99,
        image: 'https://images.pexels.com/photos/6585759/pexels-photo-6585759.jpeg',
        category: 'learn',
        teacher: 'Knot Art Studio',
        rating: 4.8,
        duration: '3.5 hours',
        students: 1120
    }
];

// Materials Products (Crafting Supplies)
const materialsProducts = [
    {
        id: 'materials-1',
        title: 'Premium Cotton Yarn Set',
        description: 'Set of 12 premium cotton yarn skeins in assorted colors. Perfect for crochet and knitting.',
        price: 34.99,
        image: 'https://images.pexels.com/photos/8636707/pexels-photo-8636707.jpeg',
        category: 'materials',
        brand: 'CraftPro',
        rating: 4.8,
        stock: 45
    },
    {
        id: 'materials-2',
        title: 'Fabric Cutting Mat',
        description: 'Large self-healing cutting mat with grid lines. Essential for precision cutting.',
        price: 28.50,
        image: 'https://images.pexels.com/photos/6621342/pexels-photo-6621342.jpeg',
        category: 'materials',
        brand: 'PrecisionCraft',
        rating: 4.9,
        stock: 32
    },
    {
        id: 'materials-3',
        title: 'Professional Scissors Set',
        description: 'Set of 3 precision crafting scissors for fabric, paper, and thread cutting.',
        price: 42.75,
        image: 'https://images.pexels.com/photos/6621342/pexels-photo-6621342.jpeg',
        category: 'materials',
        brand: 'SharpEdge',
        rating: 4.7,
        stock: 28
    },
    {
        id: 'materials-4',
        title: 'Soy Wax for Candle Making',
        description: '5lb bag of premium soy wax flakes. Clean burning and eco-friendly.',
        price: 22.99,
        image: 'https://images.pexels.com/photos/6489663/pexels-photo-6489663.jpeg',
        category: 'materials',
        brand: 'EcoWax',
        rating: 4.8,
        stock: 50
    },
    {
        id: 'materials-5',
        title: 'Glass Bead Assortment',
        description: 'Large assortment of glass beads in various sizes and colors for jewelry making.',
        price: 19.99,
        image: 'https://images.pexels.com/photos/1454673/pexels-photo-1454673.jpeg',
        category: 'materials',
        brand: 'BeadBox',
        rating: 4.6,
        stock: 38
    },
    {
        id: 'materials-6',
        title: 'Embroidery Thread Kit',
        description: 'Complete embroidery thread kit with 50 colors and organizer case.',
        price: 31.25,
        image: 'https://images.pexels.com/photos/6621330/pexels-photo-6621330.jpeg',
        category: 'materials',
        brand: 'ThreadMaster',
        rating: 4.9,
        stock: 22
    },
    {
        id: 'materials-7',
        title: 'Macrame Cord Bundle',
        description: 'Natural cotton cord bundle in 3mm, 4mm, and 5mm thicknesses for macrame projects.',
        price: 26.80,
        image: 'https://images.pexels.com/photos/6585759/pexels-photo-6585759.jpeg',
        category: 'materials',
        brand: 'CordCraft',
        rating: 4.8,
        stock: 35
    },
    {
        id: 'materials-8',
        title: 'Polymer Clay Starter Kit',
        description: 'Complete polymer clay kit with 20 colors, tools, and baking instructions.',
        price: 48.90,
        image: 'https://images.pexels.com/photos/6621342/pexels-photo-6621342.jpeg',
        category: 'materials',
        brand: 'ClayMaster',
        rating: 4.7,
        stock: 18
    }
];

// Sample Users with different roles
const sampleUsers = [
    {
        id: 'user-1',
        email: 'demo@arty.com',
        password: 'demo123',
        name: 'Demo User',
        role: 'customer',
        avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg',
        joinDate: '2024-01-15',
        orders: [],
        wishlist: []
    },
    {
        id: 'user-2',
        email: 'admin@arty.com',
        password: 'admin123',
        name: 'Admin User',
        role: 'admin',
        avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg',
        joinDate: '2023-12-01',
        permissions: ['manage_users', 'manage_products', 'view_analytics', 'manage_orders']
    },
    {
        id: 'user-3',
        email: 'seller1@arty.com',
        password: 'seller123',
        name: 'Emma Craft',
        role: 'seller',
        avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg',
        joinDate: '2024-02-10',
        shopName: 'Emma Craft Studio',
        description: 'Handmade bags and accessories',
        products: ['shop-1'],
        rating: 4.8,
        totalSales: 1250,
        earnings: 5675.50
    },
    {
        id: 'user-4',
        email: 'seller2@arty.com',
        password: 'seller123',
        name: 'Sarah Light',
        role: 'seller',
        avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg',
        joinDate: '2024-01-20',
        shopName: 'Sarah Light Candles',
        description: 'Natural soy candles and home fragrances',
        products: ['shop-2', 'learn-3'],
        rating: 4.9,
        totalSales: 890,
        earnings: 3240.75
    },
    {
        id: 'user-5',
        email: 'seller3@arty.com',
        password: 'seller123',
        name: 'Maya Threads',
        role: 'seller',
        avatar: 'https://images.pexels.com/photos/1462630/pexels-photo-1462630.jpeg',
        joinDate: '2024-02-05',
        shopName: 'Maya Threads',
        description: 'Crochet and knitting creations',
        products: ['shop-3', 'learn-2'],
        rating: 5.0,
        totalSales: 650,
        earnings: 4225.00
    }
];

// Sample Orders for analytics
const sampleOrders = [
    {
        id: 'order-1',
        userId: 'user-1',
        items: [
            { productId: 'shop-1', quantity: 1, price: 45.99 },
            { productId: 'materials-1', quantity: 2, price: 34.99 }
        ],
        total: 115.97,
        status: 'completed',
        date: '2024-03-15',
        shippingAddress: '123 Main St, City, Country'
    },
    {
        id: 'order-2',
        userId: 'user-1',
        items: [
            { productId: 'learn-1', quantity: 1, price: 29.99 }
        ],
        total: 29.99,
        status: 'pending',
        date: '2024-03-18',
        shippingAddress: '123 Main St, City, Country'
    },
    {
        id: 'order-3',
        userId: 'user-3',
        items: [
            { productId: 'shop-4', quantity: 1, price: 89.99 }
        ],
        total: 89.99,
        status: 'completed',
        date: '2024-03-10',
        shippingAddress: '456 Oak Ave, City, Country'
    }
];

// Helper function to get all products
function getAllProducts() {
    return [...shopProducts, ...learnProducts, ...materialsProducts];
}

// Helper function to get product by ID
function getProductById(id) {
    const allProducts = getAllProducts();
    return allProducts.find(product => product.id === id);
}

// Helper function to get products by category
function getProductsByCategory(category) {
    switch(category) {
        case 'shop':
            return shopProducts;
        case 'learn':
            return learnProducts;
        case 'materials':
            return materialsProducts;
        default:
            return [];
    }
}