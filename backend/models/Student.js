const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  studentId: { type: String, required: true, unique: true, trim: true },
  name: { type: String, required: true, trim: true },
  branch: { type: String, required: true, trim: true },
  totalPoint: { type: Number, required: true },
  rand: { type: Number, required: true },

  // New fields
  rank: { type: Number, default: null },
  rankChange: { type: Number, default: 0 },
  pointsChange: { type: Number, default: 0 }, 
  oldPoints: { type: Number, default: null }, // to store previous points for comparison
}, { timestamps: true });

module.exports = mongoose.model('Student', studentSchema);
