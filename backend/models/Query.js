const mongoose = require('mongoose');

const querySchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },  // Added phone field
  message: { type: String, required: true }
});

const Query = mongoose.model('Query', querySchema);
module.exports = Query;
