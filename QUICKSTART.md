# 🚀 Quick Start Guide

## Prerequisites Check
Before starting, ensure you have:
- ✅ Node.js installed (run: `node --version`)
- ✅ MongoDB installed and running (run: `mongod`)
  - OR use MongoDB Atlas (cloud database)

## Setup Steps

### 1️⃣ Install Dependencies
Already done! ✅

### 2️⃣ Configure MongoDB

**Option A: Local MongoDB**
```bash
# Start MongoDB (in a new terminal)
mongod
```

**Option B: MongoDB Atlas (Cloud)**
1. Create account at https://www.mongodb.com/cloud/atlas
2. Create a free cluster
3. Get connection string
4. Update `.env` file:
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/fsdhackathon
```

### 3️⃣ Seed the Database
```bash
npm run seed
```

This creates:
- Admin user: `admin@ecommerce.com` / `admin123`
- Customer user: `john@example.com` / `customer123`
- 15 sample products with 2 flash sales

### 4️⃣ Start the Server
```bash
npm run dev
```

### 5️⃣ Open Your Browser
Navigate to: **http://localhost:5000**

---

## 🎯 Testing the Application

### As Customer:
1. **Browse products** on homepage
2. **Search/filter** by category
3. **Click product** to view details
4. **Add to cart** (login required)
5. **Login**: `john@example.com` / `customer123`
6. **Checkout** and place order
7. **View orders** in Orders page
8. **Check notifications** (bell icon)
9. **Chat with bot** (bottom-right corner)

### As Admin:
1. **Login**: `admin@ecommerce.com` / `admin123`
2. **Go to Admin** dashboard
3. **Add new products**
4. **Set flash sales** on products
5. **View analytics** and reports
6. **Manage orders** and update status
7. **Check low stock** alerts

---

## 📋 Available Commands

```bash
# Start development server (auto-restart)
npm run dev

# Start production server
npm start

# Seed database with sample data
npm run seed
```

---

## 🌟 Key Features to Test

### ⚡ Flash Sale
- Look for products with "⚡ FLASH SALE" badge
- See countdown timer
- Notice reduced price

### 🔔 Notifications
- Place an order → Get notification
- Admin sets flash sale → All users notified
- Click bell icon to view all

### 💬 Chatbot
- Click chat icon (bottom-right)
- Try: "shipping", "return", "payment", "track"
- Ask questions about the store

### 📊 Admin Analytics
- Total sales and revenue
- Top selling products
- Sales trends (last 7 days)
- Order management
- Low stock alerts

---

## 🐛 Common Issues

### MongoDB Not Connected
```
Error: MongoDB Connection Error
```
**Solution**: Make sure MongoDB is running
```bash
mongod
```

### Port Already in Use
```
Error: Port 5000 is already in use
```
**Solution**: Change port in `.env` file
```env
PORT=3000
```

### Cannot Login
**Solution**: Run seed script again
```bash
npm run seed
```

---

## 📱 Responsive Design
Try the app on:
- 💻 Desktop
- 📱 Mobile
- 📱 Tablet

All features work perfectly on all devices!

---

## 🎨 Customization

### Change Colors
Edit `public/css/style.css`:
```css
:root {
    --primary-color: #3498db;  /* Change this */
    --secondary-color: #2ecc71; /* And this */
}
```

### Add More Products
1. Login as admin
2. Go to Admin Dashboard
3. Click "Add Product"
4. Fill the form

### Set Flash Sale
1. Admin Dashboard → Products tab
2. Click "Flash Sale" button on any product
3. Set sale price and end time
4. All users will be notified!

---

## 🎓 Architecture Overview

```
Frontend (HTML/CSS/JS)
         ↓
    REST API (Express)
         ↓
   Controllers (Business Logic)
         ↓
     Models (Mongoose)
         ↓
    MongoDB Database
```

---

## 📚 Learn More

- **MongoDB**: https://docs.mongodb.com/
- **Express**: https://expressjs.com/
- **Mongoose**: https://mongoosejs.com/
- **JWT**: https://jwt.io/

---

## 💡 Tips

1. **Clear cookies** if having login issues
2. **Check browser console** for errors (F12)
3. **Check terminal** for server logs
4. **Test both roles**: customer and admin
5. **Try all features** to see the full functionality

---

## 🎉 Enjoy Your E-Commerce Website!

If everything works, you should see:
- ✅ Products loading
- ✅ Flash sales active
- ✅ Cart working
- ✅ Orders placing
- ✅ Notifications appearing
- ✅ Chatbot responding
- ✅ Admin dashboard functioning

**Happy Shopping! 🛒**
