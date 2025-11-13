const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/fsdhackathon', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    
    // Create indexes for better performance
    await createIndexes();
    
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

const createIndexes = async () => {
  try {
    const Product = require('../models/Product');
    const Cart = require('../models/Cart');
    const Order = require('../models/Order');
    const Notification = require('../models/Notification');

    // Product indexes
    await Product.collection.createIndex({ name: 'text', description: 'text' });
    await Product.collection.createIndex({ category: 1 });
    await Product.collection.createIndex({ 'flashSale.endTime': 1 });
    
    // Cart indexes
    await Cart.collection.createIndex({ userId: 1 });
    
    // Order indexes
    await Order.collection.createIndex({ userId: 1 });
    await Order.collection.createIndex({ orderId: 1 }, { unique: true });
    await Order.collection.createIndex({ createdAt: -1 });
    
    // Notification indexes
    await Notification.collection.createIndex({ userId: 1, isRead: 1 });
    
    console.log('✅ Database indexes created');
  } catch (error) {
    console.log('⚠️  Index creation skipped:', error.message);
  }
};

module.exports = connectDB;
