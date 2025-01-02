const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      match: /.+\@.+\..+/,
    },
    pickupLocation: {
      type: String,
      required: true,
    },
    pickupPhone: {
      type: String,
      required: true,
      validate: {
        validator: (v) => /\d{10}/.test(v),
        message: (props) => `${props.value} is not a valid 10-digit phone number!`,
      },
    },
    dropLocation: {
      type: String,
      required: true,
      enum: ['Mumbai', 'Delhi', 'Kolkata', 'Surat'],
    },
    dropPhone: {
      type: String,
      required: true,
      validate: {
        validator: (v) => /\d{10}/.test(v),
        message: (props) => `${props.value} is not a valid 10-digit phone number!`,
      },
    },
    goodsType: {
      type: String,
      required: true,
      enum: ['Fragile', 'Solid', 'Liquid'],
    },
    weight: {
      type: String,
      required: true,
      enum: ['0-500kg', '500-1000kg', '1000-1500kg', '1500-2000kg', 'Over 2000kg'],
    },
    date: {
      type: Date,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      default: 'Active',
      enum: ['Active', 'Pending', 'Shipped', 'Delivered', 'Cancelled'],
    },
    deliveredDate: {
      type: Date,
      default: null, // Set null initially
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Booking', BookingSchema);
