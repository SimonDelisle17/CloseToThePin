const mongoose = require('mongoose');
const argon2 = require('argon2');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  handicap: {
    type: Number,
    default: 0,
    min: -10,
    max: 54
  },
  totalRounds: {
    type: Number,
    default: 0
  },
  bestScore: {
    type: Number,
    default: null
  },
  averageScore: {
    type: Number,
    default: null
  },
  lowestRound: {
    type: Number,
    default: null
  },
  parTotal: {
    type: Number,
    default: 72
  },
  totalStrokes: {
    type: Number,
    default: 0
  },
  currentStreak: {
    type: Number,
    default: 0
  },
  bestStreak: {
    type: Number,
    default: 0
  },
  coursesPlayed: [{
    courseName: String,
    location: String,
    par: { type: Number, default: 72 },
    playedCount: { type: Number, default: 1 }
  }]
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();

  try {
    this.password = await argon2.hash(this.password);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  try {
    return await argon2.verify(this.password, candidatePassword);
  } catch (error) {
    return false;
  }
};

module.exports = mongoose.model('User', userSchema);