const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide product name'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Please provide product description']
  },
  price: {
    type: Number,
    required: [true, 'Please provide product price'],
    min: 0
  },
  category: {
    type: String,
    required: [true, 'Please provide product category'],
    enum: ['Food', 'Home', 'Beauty']
  },
  image: {
    type: String,
    default: 'default-product.jpg'
  },
  stock: {
    type: Number,
    required: [true, 'Please provide stock quantity'],
    min: 0,
    default: 0
  },
  flashSale: {
    isActive: {
      type: Boolean,
      default: false
    },
    salePrice: {
      type: Number,
      min: 0
    },
    endTime: {
      type: Date
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update updatedAt on save
productSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Method to get current price (regular or sale)
productSchema.methods.getCurrentPrice = function() {
  if (this.flashSale.isActive && this.flashSale.endTime > new Date()) {
    return this.flashSale.salePrice;
  }
  return this.price;
};

module.exports = mongoose.model('Product', productSchema);
