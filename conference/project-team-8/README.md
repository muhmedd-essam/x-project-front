# Arty - Handmade Marketplace

A modern e-commerce platform for handmade items, tutorials, and crafting materials with role-based user management.

## Features

### 🔐 Enhanced Authentication System
- **Role-based access control** with three user types:
  - **Customer**: Can browse, purchase, and learn
  - **Seller**: Can sell handmade items and create tutorials
  - **Admin**: Full system management capabilities

### 👤 User Management
- **Customer Features**:
  - Browse and purchase products
  - View order history
  - Manage wishlist
  - Update profile and password

- **Seller Features**:
  - Dedicated seller dashboard
  - Product management
  - Sales analytics
  - Order tracking
  - Shop profile management

- **Admin Features**:
  - Complete user management
  - Order management
  - Product oversight
  - Analytics dashboard
  - System statistics

### 🛍️ E-commerce Features
- Product browsing by category (Shop, Learn, Materials)
- Shopping cart functionality
- Order management
- User profiles and preferences

## Demo Accounts

### Customer Account
- **Email**: demo@arty.com
- **Password**: demo123
- **Features**: Browse products, make purchases, view orders

### Admin Account
- **Email**: admin@arty.com
- **Password**: admin123
- **Features**: Full system access, user management, analytics

### Seller Accounts
- **Email**: seller1@arty.com
- **Password**: seller123
- **Shop**: Emma Craft Studio (Handmade bags and accessories)

- **Email**: seller2@arty.com
- **Password**: seller123
- **Shop**: Sarah Light Candles (Natural soy candles)

## Getting Started

1. **Clone or download** the project files
2. **Open** `index.html` in your web browser
3. **Login** using one of the demo accounts above
4. **Explore** different user roles and features

## Testing the Dropdown Menu

If the dropdown menu is not working, follow these steps:

1. **Open** `menu-test.html` in your browser
2. **Click** "Test Login" to login with a demo account
3. **Click** "Test Menu" to manually trigger the dropdown
4. **Check** the debug console for any error messages
5. **Try** clicking on the "Hi, [Name]" button in the navigation

### Troubleshooting

- **Clear browser cache** and reload the page
- **Check browser console** for JavaScript errors
- **Ensure all files** are in the correct directory structure
- **Try different browsers** (Chrome recommended)

## File Structure

```
project/
├── index.html              # Home page
├── login.html              # Login page
├── register.html           # Registration page
├── shop.html              # Shop products
├── learn.html             # Tutorials and courses
├── materials.html         # Crafting materials
├── cart.html              # Shopping cart
├── checkout.html          # Checkout process
├── profile.html           # User profile
├── orders.html            # Order history
├── admin-dashboard.html   # Admin dashboard
├── seller-dashboard.html  # Seller dashboard
├── css/
│   ├── main.css          # Main styles
│   └── components.css    # Component styles
└── js/
    ├── auth.js           # Authentication system
    ├── data.js           # Sample data
    ├── cart.js           # Shopping cart
    ├── products.js       # Product management
    └── navigation.js     # Navigation functionality
```

## Key Improvements Made

### 1. Enhanced User Authentication
- Added role-based user types (Customer, Seller, Admin)
- Improved login/logout functionality
- Added user menu dropdown
- Automatic role-based redirects

### 2. Admin Dashboard
- Complete user management interface
- Order tracking and management
- Product oversight
- Sales analytics and statistics
- Real-time data display

### 3. Seller Dashboard
- Dedicated seller interface
- Product management tools
- Sales tracking and analytics
- Shop profile management
- Order fulfillment tools

### 4. User Profile System
- Comprehensive user profiles
- Order history tracking
- Wishlist management
- Password change functionality
- Role-specific information display

### 5. Order Management
- Detailed order tracking
- Order history for customers
- Order management for sellers
- Status tracking (pending, completed, cancelled)

## Technical Features

### Frontend
- **HTML5** with semantic markup
- **CSS3** with modern styling and responsive design
- **Vanilla JavaScript** for functionality
- **Local Storage** for data persistence
- **Responsive design** for mobile and desktop

### User Experience
- **Intuitive navigation** with role-based menus
- **Clean, modern UI** with consistent styling
- **Responsive design** that works on all devices
- **Fast loading** with optimized assets

## Usage Instructions

### For Customers
1. Login with customer account
2. Browse products in Shop, Learn, or Materials sections
3. Add items to cart and checkout
4. View order history in Profile section

### For Sellers
1. Login with seller account
2. Access seller dashboard
3. Manage products and view sales
4. Track orders and earnings

### For Admins
1. Login with admin account
2. Access admin dashboard
3. Manage users, orders, and products
4. View system analytics

## Browser Compatibility

- Chrome (recommended)
- Firefox
- Safari
- Edge

## Future Enhancements

- Real-time notifications
- Advanced search and filtering
- Payment gateway integration
- Review and rating system
- Advanced analytics
- Mobile app development

## Support

For questions or issues, please refer to the demo accounts and explore the different user roles to understand the full functionality of the system.

---

**Note**: This is a demo project using local storage for data persistence. In a production environment, you would need to implement a proper backend database and API. 