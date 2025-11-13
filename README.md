# 🛒 E-Commerce Website - Full Stack with MongoDB

A complete full-stack e-commerce application built with Node.js, Express, MongoDB, and vanilla JavaScript. Features include product management, shopping cart, flash sales, real-time notifications, chatbot, and admin dashboard with analytics.

## ✨ Features

### Core Features (MVP)
- ✅ Product catalog with search and filters
- ✅ Shopping cart with persistent storage
- ✅ User authentication (register/login)
- ✅ Checkout and order placement
- ✅ Order history and tracking

### Advanced Features
- ⚡ Flash sale system with countdown timers
- 🔔 Real-time notifications
- 💬 AI chatbot for customer support
- 📊 Admin dashboard with analytics
- 👤 User profile management
- 📦 Order status updates

## 🚀 Tech Stack

**Backend:**
- Node.js & Express.js
- MongoDB & Mongoose
- JWT Authentication
- bcryptjs for password hashing

**Frontend:**
- HTML5, CSS3, JavaScript (ES6+)
- Responsive design
- No frontend frameworks (vanilla JS)

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

## 🔧 Installation

### 1. Clone the repository
```bash
git clone <repository-url>
cd emptypileEndsem
```

### 2. Install dependencies
```bash
npm install
```

### 3. Environment Setup

Create a `.env` file in the root directory:

```env
MONGODB_URI=mongodb://localhost:27017/fsdhackathon
JWT_SECRET=your_super_secret_key_change_this_in_production
PORT=5000
NODE_ENV=development
```

**For MongoDB Atlas (Cloud):**
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/fsdhackathon
```

**Using MongoDB Compass?**
- Connection string: `mongodb://localhost:27017`
- Database name: `fsdhackathon`
- See [MONGODB_COMPASS.md](MONGODB_COMPASS.md) for detailed guide

### 4. Seed the Database

Populate the database with your Excel data (NewDataset.xlsx):

```bash
npm run seed
```

This will create:
- Admin user: `admin@ecommerce.com` / `admin123`
- Customer user: `john@example.com` / `customer123`
- **505 products** from your NewDataset.xlsx file with real product images (50 with active flash sales)

### 5. Start the Server

**Development mode (with auto-restart):**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

The server will start on `http://localhost:5000`

## 📁 Project Structure

```
ecommerce-mongodb/
│
├── server.js                 # Main Express server
├── package.json
├── .env                      # Environment variables
│
├── config/
│   ├── db.js                # MongoDB connection
│   └── seed.js              # Database seeding script
│
├── models/
│   ├── User.js              # User schema
│   ├── Product.js           # Product schema
│   ├── Cart.js              # Cart schema
│   ├── Order.js             # Order schema
│   └── Notification.js      # Notification schema
│
├── routes/
│   ├── auth.js              # Authentication routes
│   ├── products.js          # Product CRUD routes
│   ├── cart.js              # Cart operations
│   ├── orders.js            # Order management
│   ├── admin.js             # Admin operations
│   └── notifications.js     # Notification routes
│
├── controllers/
│   ├── authController.js
│   ├── productController.js
│   ├── cartController.js
│   ├── orderController.js
│   ├── adminController.js
│   └── notificationController.js
│
├── middleware/
│   ├── auth.js              # JWT authentication
│   └── admin.js             # Admin role check
│
├── public/
│   ├── css/
│   │   └── style.css        # All styles
│   └── js/
│       ├── products.js      # Product listing
│       ├── cart.js          # Cart functionality
│       ├── checkout.js      # Checkout process
│       ├── flashsale.js     # Flash sale timers
│       ├── notifications.js # Notification system
│       └── chatbot.js       # Chatbot logic
│
└── views/                    # HTML pages
    ├── index.html           # Homepage
    ├── product.html         # Product details
    ├── cart.html            # Shopping cart
    ├── checkout.html        # Checkout page
    ├── login.html           # Login/Register
    ├── orders.html          # Order history
    └── admin.html           # Admin dashboard
```

## 🔌 API Endpoints

### Authentication
```
POST   /api/auth/register    # Register new user
POST   /api/auth/login       # Login user
GET    /api/auth/profile     # Get user profile (protected)
PUT    /api/auth/profile     # Update profile (protected)
```

### Products
```
GET    /api/products              # Get all products
GET    /api/products/flash-sales  # Get flash sale products
GET    /api/products/:id          # Get single product
POST   /api/products              # Create product (admin)
PUT    /api/products/:id          # Update product (admin)
DELETE /api/products/:id          # Delete product (admin)
```

### Cart
```
GET    /api/cart           # Get user cart
POST   /api/cart           # Add item to cart
PUT    /api/cart/:itemId   # Update quantity
DELETE /api/cart/:itemId   # Remove item
DELETE /api/cart           # Clear cart
```

### Orders
```
POST   /api/orders                # Create order
GET    /api/orders                # Get user orders
GET    /api/orders/:id            # Get order details
GET    /api/admin/orders          # Get all orders (admin)
PUT    /api/admin/orders/:id      # Update order status (admin)
```

### Admin
```
GET    /api/admin/analytics                 # Dashboard analytics
PUT    /api/admin/products/:id/flash-sale   # Set flash sale
GET    /api/admin/low-stock                 # Low stock products
```

### Notifications
```
GET    /api/notifications              # Get user notifications
PUT    /api/notifications/:id          # Mark as read
PUT    /api/notifications/mark-all-read # Mark all as read
DELETE /api/notifications/:id          # Delete notification
```

### Chatbot
```
POST   /api/chatbot       # Send message to chatbot
```

## 👥 User Roles

### Customer
- Browse and search products
- Add items to cart
- Place orders
- View order history
- Receive notifications
- Chat with support bot

### Admin
- All customer features
- Add/edit/delete products
- Set flash sales
- View all orders
- Update order status
- View analytics dashboard
- Manage inventory

## 📊 Database Schemas

### Users Collection
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  phone: String,
  address: {
    street, city, state, pincode
  },
  role: "customer" | "admin",
  createdAt: Date
}
```

### Products Collection
```javascript
{
  name: String,
  description: String,
  price: Number,
  category: String,
  image: String,
  stock: Number,
  flashSale: {
    isActive: Boolean,
    salePrice: Number,
    endTime: Date
  },
  createdAt: Date,
  updatedAt: Date
}
```

### Orders Collection
```javascript
{
  orderId: String (unique),
  userId: ObjectId,
  items: [{
    productId, name, quantity, price
  }],
  totalAmount: Number,
  shippingAddress: Object,
  status: "pending" | "processing" | "shipped" | "delivered",
  paymentStatus: "pending" | "paid" | "failed",
  createdAt: Date
}
```

## 🎯 Features Breakdown

### 1. Flash Sale System
- **Time Complexity**: O(1) query with index
- Automatic countdown timers
- Special pricing during sale period
- Notifications to all users when activated

### 2. Notifications
- **Time Complexity**: O(1) insert, O(n) fetch
- Real-time updates via polling (5s interval)
- Order status notifications
- Flash sale alerts
- Mark as read functionality

### 3. Chatbot
- **Time Complexity**: O(n) keyword matching
- FAQ-based responses
- Keyword matching algorithm
- Quick action buttons
- Handles: shipping, returns, payments, tracking

### 4. Analytics Dashboard
- **Time Complexity**: O(n) aggregations
- Total sales and orders
- Top-selling products
- Sales trends (7 days)
- Category statistics
- Low stock alerts

## 🔐 Security Features

- Password hashing with bcryptjs
- JWT-based authentication
- Protected routes with middleware
- Role-based access control
- Input validation
- CORS enabled

## 🌐 Pages

1. **Homepage** (`/`) - Product listing with filters
2. **Product Detail** (`/product/:id`) - Individual product page
3. **Cart** (`/cart`) - Shopping cart management
4. **Checkout** (`/checkout`) - Order placement
5. **Login/Register** (`/login`) - Authentication
6. **Orders** (`/orders`) - Order history
7. **Admin Dashboard** (`/admin`) - Admin panel

## 📱 Responsive Design

- Mobile-friendly layout
- Flexible grid system
- Touch-optimized UI
- Responsive navigation

## 🧪 Testing

Test the application:

1. **Register/Login** as customer
2. **Browse products** and add to cart
3. **Complete checkout** process
4. **View order** in orders page
5. **Login as admin** (admin@ecommerce.com / admin123)
6. **Set flash sale** on a product
7. **View analytics** dashboard

## 🚧 Future Enhancements

- [ ] Payment gateway integration (Razorpay/Stripe)
- [ ] Image upload functionality
- [ ] Product reviews and ratings
- [ ] Wishlist feature
- [ ] Advanced search with filters
- [ ] Email notifications
- [ ] Socket.io for real-time notifications
- [ ] Progressive Web App (PWA)
- [ ] Dark mode

## 🐛 Troubleshooting

**MongoDB Connection Error:**
```bash
# Make sure MongoDB is running
mongod
```

**Port Already in Use:**
```bash
# Change PORT in .env file
PORT=3000
```

**Missing Dependencies:**
```bash
npm install
```

## 📄 License

This project is open source and available under the MIT License.

## 👨‍💻 Author

Created for Full Stack Development Course - End Semester Project

---

**Happy Coding! 🚀**
