# 🧭 MongoDB Compass Guide

## What is MongoDB Compass?
MongoDB Compass is a GUI tool to visually explore and interact with your MongoDB database.

---

## 📊 Viewing Your Data

### 1. Connect to Database
In MongoDB Compass, use this connection string:
```
mongodb://localhost:27017
```
Click **Connect**

### 2. Select Database
- Look for database named: `fsdhackathon`
- Click on it to expand

### 3. View Collections
You should see these collections:
- **users** (2 users: admin & customer)
- **products** (3,732 products from your Excel file!)
- **carts** (empty initially)
- **orders** (empty initially)
- **notifications** (empty initially)

---

## 🔍 Exploring Products

### View All Products
1. Click on **products** collection
2. You'll see all 3,732 products from InventoryDataset.xlsx

### Sample Product Document
```json
{
  "_id": ObjectId("..."),
  "name": "Onion",
  "description": "Onion - Fruits & Vegetables. Weight: 1000g. 16% discount!",
  "price": 2500,
  "category": "Home",
  "stock": 3,
  "flashSale": {
    "isActive": true,
    "salePrice": 2100,
    "endTime": ISODate("2025-11-14T12:00:00Z")
  },
  "createdAt": ISODate("..."),
  "updatedAt": ISODate("...")
}
```

### Filter Products
In the **Filter** field, try:

**Find flash sale products:**
```json
{ "flashSale.isActive": true }
```

**Find products by category:**
```json
{ "category": "Beauty" }
```

**Find out of stock:**
```json
{ "stock": 0 }
```

**Find products under ₹100:**
```json
{ "price": { "$lt": 100 } }
```

**Find products with "Onion" in name:**
```json
{ "name": /Onion/i }
```

---

## 👥 Viewing Users

### Click on **users** collection

You should see 2 users:

**Admin User:**
```json
{
  "_id": ObjectId("..."),
  "name": "Admin User",
  "email": "admin@ecommerce.com",
  "role": "admin",
  "phone": "1234567890"
}
```

**Customer User:**
```json
{
  "_id": ObjectId("..."),
  "name": "John Doe",
  "email": "john@example.com",
  "role": "customer",
  "phone": "9876543210"
}
```

---

## 📦 After Using the App

Once you start using the application, you'll see data populate in:

### Carts Collection
```json
{
  "_id": ObjectId("..."),
  "userId": ObjectId("..."),
  "items": [
    {
      "productId": ObjectId("..."),
      "quantity": 2,
      "priceAtAdd": 2500
    }
  ],
  "updatedAt": ISODate("...")
}
```

### Orders Collection
```json
{
  "_id": ObjectId("..."),
  "orderId": "ORD-2025-00001",
  "userId": ObjectId("..."),
  "items": [...],
  "totalAmount": 5000,
  "status": "pending",
  "shippingAddress": {...}
}
```

### Notifications Collection
```json
{
  "_id": ObjectId("..."),
  "userId": ObjectId("..."),
  "type": "order",
  "message": "Your order #ORD-2025-00001 has been placed",
  "isRead": false
}
```

---

## 🛠️ Useful Compass Features

### 1. Schema Analysis
- Click **Schema** tab to see field types and distributions
- Great for understanding your data structure

### 2. Indexes
- Click **Indexes** tab to see database indexes
- Should see indexes on:
  - `userId` (for carts)
  - `orderId` (for orders)
  - `flashSale.endTime` (for products)

### 3. Explain Plan
- Use to analyze query performance
- Click **Explain** after running a filter

### 4. Aggregation Pipeline
Click **Aggregations** tab to run complex queries:

**Top 10 most expensive products:**
```json
[
  { "$sort": { "price": -1 } },
  { "$limit": 10 }
]
```

**Count products by category:**
```json
[
  {
    "$group": {
      "_id": "$category",
      "count": { "$sum": 1 }
    }
  },
  { "$sort": { "count": -1 } }
]
```

**Flash sale products only:**
```json
[
  { "$match": { "flashSale.isActive": true } },
  { "$project": { "name": 1, "price": 1, "flashSale.salePrice": 1 } }
]
```

---

## 🎯 Quick Stats to Check

### Product Statistics
1. Total products: Should be **3,732**
2. Flash sale products: Should be **50**
3. Categories: Multiple (Home, Beauty, Other, etc.)

### Run this in Aggregations:
```json
[
  {
    "$facet": {
      "totalProducts": [{ "$count": "count" }],
      "flashSales": [
        { "$match": { "flashSale.isActive": true } },
        { "$count": "count" }
      ],
      "outOfStock": [
        { "$match": { "stock": 0 } },
        { "$count": "count" }
      ],
      "byCategory": [
        { "$group": { "_id": "$category", "count": { "$sum": 1 } } },
        { "$sort": { "count": -1 } }
      ]
    }
  }
]
```

---

## 🔄 Refreshing Data

If you want to reset and reload:
```bash
npm run seed
```

Then refresh MongoDB Compass (click the refresh icon ↻)

---

## 💡 Pro Tips

1. **Use JSON View**: Switch between List/JSON/Table views using the view toggle
2. **Export Data**: Click ... menu → Export Collection
3. **Import Data**: Click ... menu → Import Data (for adding more data)
4. **Create Indexes**: Click Indexes tab → Create Index (for performance)
5. **Monitor Performance**: Use Performance tab to see slow queries

---

## 🚀 Next Steps

1. ✅ Verify your 3,732 products are loaded
2. ✅ Check that 50 flash sales are active
3. ✅ Start your server: `npm run dev`
4. ✅ Visit: http://localhost:5000
5. ✅ Browse products from your Excel file!
6. ✅ After using the app, come back to Compass to see carts, orders, and notifications populate

---

## 📞 Need Help?

**Can't see data?**
- Run: `npm run seed`
- Refresh Compass

**Connection failed?**
- Make sure MongoDB is running
- Check connection string: `mongodb://localhost:27017`

**Want to clear everything?**
- In Compass, click on `fsdhackathon` database
- Click trash icon to drop database
- Run `npm run seed` again

---

**Happy Data Exploring! 🧭**
