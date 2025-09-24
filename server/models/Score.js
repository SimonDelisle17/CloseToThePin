const mongoose = require('mongoose');

const holeSchema = new mongoose.Schema({
  holeNumber: {
    type: Number,
    required: true,
    min: 1,
    max: 18
  },
  par: {
    type: Number,
    required: true,
    min: 3,
    max: 5
  },
  strokes: {
    type: Number,
    required: true,
    min: 1
  },
  distance: {
    type: Number, // Distance to pin in yards/meters
    default: null
  },
  fairwayHit: {
    type: Boolean,
    default: false
  },
  greenInRegulation: {
    type: Boolean,
    default: false
  },
  putts: {
    type: Number,
    min: 0,
    default: null
  }
});

const scoreSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  courseName: {
    type: String,
    required: true,
    trim: true
  },
  courseLocation: {
    type: String,
    trim: true
  },
  coursePar: {
    type: Number,
    required: true,
    default: 72
  },
  totalScore: {
    type: Number,
    required: true
  },
  scoreToPar: {
    type: Number,
    required: true
  },
  holes: [holeSchema],
  datePlayed: {
    type: Date,
    default: Date.now
  },
  weather: {
    temperature: Number,
    conditions: String, // sunny, cloudy, rainy, windy
    windSpeed: Number
  },
  notes: {
    type: String,
    maxlength: 500
  },
  isOfficial: {
    type: Boolean,
    default: true
  },
  // PGA-style statistics
  fairwaysHit: {
    type: Number,
    default: 0
  },
  greensInRegulation: {
    type: Number,
    default: 0
  },
  totalPutts: {
    type: Number,
    default: 0
  },
  birdies: {
    type: Number,
    default: 0
  },
  eagles: {
    type: Number,
    default: 0
  },
  bogeys: {
    type: Number,
    default: 0
  },
  doubleBogeys: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Calculate statistics before saving
scoreSchema.pre('save', function(next) {
  if (this.holes && this.holes.length > 0) {
    let birdies = 0;
    let eagles = 0;
    let bogeys = 0;
    let doubleBogeys = 0;
    let fairwaysHit = 0;
    let greensInRegulation = 0;
    let totalPutts = 0;

    this.holes.forEach(hole => {
      const scoreToPar = hole.strokes - hole.par;

      if (scoreToPar === -2) eagles++;
      else if (scoreToPar === -1) birdies++;
      else if (scoreToPar === 1) bogeys++;
      else if (scoreToPar >= 2) doubleBogeys++;

      if (hole.fairwayHit) fairwaysHit++;
      if (hole.greenInRegulation) greensInRegulation++;
      if (hole.putts) totalPutts += hole.putts;
    });

    this.birdies = birdies;
    this.eagles = eagles;
    this.bogeys = bogeys;
    this.doubleBogeys = doubleBogeys;
    this.fairwaysHit = fairwaysHit;
    this.greensInRegulation = greensInRegulation;
    this.totalPutts = totalPutts;

    // Calculate total score and score to par
    this.totalScore = this.holes.reduce((total, hole) => total + hole.strokes, 0);
    this.scoreToPar = this.totalScore - this.coursePar;
  }

  next();
});

// Create indexes for better query performance
scoreSchema.index({ userId: 1, datePlayeded: -1 });
scoreSchema.index({ userId: 1, totalScore: 1 });

module.exports = mongoose.model('Score', scoreSchema);