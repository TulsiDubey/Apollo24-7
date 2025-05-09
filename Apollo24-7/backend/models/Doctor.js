
// This file would be in a separate backend project
const mongoose = require('mongoose');

const DoctorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  specialty: {
    type: String,
    required: true
  },
  experience: {
    type: String,
    required: true
  },
  experienceYears: {
    type: Number,
    required: true
  },
  education: {
    type: String,
    required: true
  },
  languages: {
    type: [String],
    default: ['English']
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'other'],
    required: true
  },
  consultationFee: {
    type: String,
    required: true
  },
  feeAmount: {
    type: Number,
    required: true
  },
  availability: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0
  },
  reviews: {
    type: Number,
    default: 0
  },
  image: {
    type: String,
    default: ''
  },
  hospitalAffiliations: {
    type: [String],
    default: []
  },
  specializations: {
    type: [String],
    default: []
  },
  location: {
    city: {
      type: String,
      default: 'Delhi'
    },
    address: {
      type: String,
      default: ''
    },
    coordinates: {
      lat: {
        type: Number,
        default: 0
      },
      lng: {
        type: Number,
        default: 0
      }
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Create indexes for better query performance
DoctorSchema.index({ specialty: 1 });
DoctorSchema.index({ experienceYears: 1 });
DoctorSchema.index({ gender: 1 });
DoctorSchema.index({ feeAmount: 1 });
DoctorSchema.index({ 'location.city': 1 });
DoctorSchema.index({ specializations: 1 });

module.exports = mongoose.model('Doctor', DoctorSchema);
