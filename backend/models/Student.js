const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  branch: { type: String, required: true },
  totalPoint: { type: Number, required: true },
  rand: { type: Number, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Student', studentSchema);
