require('dotenv').config();
const mongoose = require('mongoose');
const XLSX = require('xlsx');
const path = require('path');

// Import models
const User = require('../models/User');
const Product = require('../models/Product');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/fsdhackathon');
        console.log('✅ Connected to MongoDB');
    } catch (error) {
        console.error('❌ MongoDB connection error:', error);
        process.exit(1);
    }
};

const seedData = async () => {
    try {
        // Clear existing data
        await User.deleteMany({});
        await Product.deleteMany({});
        console.log('🧹 Cleared existing data');

        // Create Admin User (password will be hashed by User model pre-save hook)
        const admin = await User.create({
            name: 'Admin User',
            email: 'admin@ecommerce.com',
            password: 'admin123',
            phone: '1234567890',
            address: {
                street: '123 Admin St',
                city: 'Mumbai',
                state: 'Maharashtra',
                pincode: '400001'
            },
            role: 'admin'
        });
        console.log('✅ Admin user created: admin@ecommerce.com / admin123');

        // Create Sample Customer (password will be hashed by User model pre-save hook)
        const customer = await User.create({
            name: 'John Doe',
            email: 'john@example.com',
            password: 'customer123',
            phone: '9876543210',
            address: {
                street: '456 Customer Ave',
                city: 'Delhi',
                state: 'Delhi',
                pincode: '110001'
            },
            role: 'customer'
        });
        console.log('✅ Customer user created: john@example.com / customer123');

        // Read Excel file
        console.log('📖 Reading NewDataset.xlsx...');
        const excelFilePath = path.join(__dirname, '..', 'NewDataset.xlsx');
        const workbook = XLSX.readFile(excelFilePath);
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const excelData = XLSX.utils.sheet_to_json(worksheet);

        console.log(`📊 Found ${excelData.length} products in Excel file`);

        // Map categories from Excel to our schema categories
        const categoryMap = {
            'beauty & hygiene': 'Beauty',
            'kitchen, garden & pets': 'Home',
            'foodgrains, oil & masala': 'Home',
            'bakery, cakes & dairy': 'Food',
            'beverages': 'Food',
            'snacks & branded foods': 'Food',
            'cleaning & household': 'Home',
            'gourmet & world food': 'Food',
            'eggs, meat & fish': 'Food',
            'fruits & vegetables': 'Home',
            'baby care': 'Other'
        };

        // Transform Excel data to match our Product schema
        const products = excelData.map((item, index) => {
            const category = categoryMap[item.Category?.toLowerCase()] || 'Other';
            
            // Extract price from MRP string (e.g., "₹176" -> 176)
            let price = 100;
            if (item.MRP) {
                const priceMatch = item.MRP.toString().replace(/[₹,]/g, '').trim();
                price = parseFloat(priceMatch) || 100;
            }
            
            // First 50 items as flash sale with 15-25% discount
            const isFlashSale = index < 50;
            const discountPercent = isFlashSale ? 15 + (index % 10) : 0;
            const salePrice = isFlashSale ? Math.round(price * (1 - discountPercent / 100)) : 0;
            
            return {
                name: item['SKU Name'] || `Product ${index + 1}`,
                description: item['About the Product'] || `${item['SKU Name']} - ${item.Brand}. ${item.Category}`,
                price: price,
                category: category,
                image: item['Image Link'] || 'https://via.placeholder.com/300x300?text=No+Image',
                stock: 50 + (index % 100), // Random stock between 50-150
                flashSale: isFlashSale ? {
                    isActive: true,
                    salePrice: salePrice,
                    endTime: new Date(Date.now() + (12 + index % 24) * 60 * 60 * 1000) // 12-36 hours from now
                } : {
                    isActive: false,
                    salePrice: 0,
                    endTime: null
                }
            };
        });

        // Insert products in batches to avoid memory issues
        const batchSize = 100;
        let insertedCount = 0;
        
        for (let i = 0; i < products.length; i += batchSize) {
            const batch = products.slice(i, i + batchSize);
            await Product.insertMany(batch);
            insertedCount += batch.length;
            console.log(`✅ Inserted ${insertedCount}/${products.length} products...`);
        }

        const flashSaleCount = products.filter(p => p.flashSale.isActive).length;
        console.log(`✅ Created ${products.length} products from Excel with images (${flashSaleCount} with flash sales)`);

        console.log('\n🎉 Database seeded successfully!');
        console.log('\n📝 Login credentials:');
        console.log('   Admin: admin@ecommerce.com / admin123');
        console.log('   Customer: john@example.com / customer123');
        console.log(`\n📊 Product Stats:`);
        console.log(`   Total Products: ${products.length}`);
        console.log(`   Flash Sales: ${flashSaleCount}`);
        console.log(`   All products have images from BigBasket! 🖼️`);
        
        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding data:', error);
        process.exit(1);
    }
};

// Run seed
connectDB().then(seedData);
