const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema({
  itemName: { type: String, required: true },
  isVeg: { type: Boolean, default: true },
  quantity: { type: Number, required: true },
  quantityUnit: { type: String, default: 'servings' },
  items: [{
    id: String,
    name: String,
    isVeg: Boolean,
    quantity: Number,
    unit: String
  }],
  weight: { type: Number },
  location: { type: String, required: true },
  expiryTime: { type: Date, required: true },
  notes: { type: String },
  contactName: { type: String },
  contactPhone: { type: String },
  donorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  donorName: { type: String, required: true },
  status: { type: String, enum: ['available', 'requested', 'collected', 'cancelled'], default: 'available' },
  requestedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  requestedByName: { type: String, default: null },
  requestedAt: { type: Date, default: null },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Donation', donationSchema);
