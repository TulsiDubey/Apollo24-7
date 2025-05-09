
// This file would be in a separate backend project
const express = require('express');
const router = express.Router();
const Doctor = require('../models/Doctor');
const axios = require('axios');
const cheerio = require('cheerio');

/**
 * @route   POST /api/doctors
 * @desc    Add a new doctor
 * @access  Private (would require authentication in a real app)
 */
router.post('/', async (req, res) => {
  try {
    const newDoctor = new Doctor(req.body);
    const doctor = await newDoctor.save();
    res.status(201).json(doctor);
  } catch (error) {
    console.error('Error adding doctor:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

/**
 * @route   GET /api/doctors
 * @desc    Get all doctors with filtering and pagination
 * @access  Public
 */
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    // Build filter object
    const filter = {};
    
    // Filter by specialty
    if (req.query.specialty) {
      filter.specialty = { $regex: req.query.specialty.replace(/-/g, ' '), $options: 'i' };
    }
    
    // Filter by experience
    if (req.query.experience) {
      const experienceRanges = req.query.experience.split(',');
      const expFilter = [];
      
      experienceRanges.forEach(range => {
        if (range === '0-5') {
          expFilter.push({ experienceYears: { $gte: 0, $lte: 5 } });
        } else if (range === '5-10') {
          expFilter.push({ experienceYears: { $gt: 5, $lte: 10 } });
        } else if (range === '10-15') {
          expFilter.push({ experienceYears: { $gt: 10, $lte: 15 } });
        } else if (range === '15+') {
          expFilter.push({ experienceYears: { $gt: 15 } });
        }
      });
      
      if (expFilter.length > 0) {
        filter.$or = expFilter;
      }
    }
    
    // Filter by gender
    if (req.query.gender) {
      const genders = req.query.gender.split(',');
      filter.gender = { $in: genders };
    }
    
    // Filter by availability
    if (req.query.availability) {
      const availabilityOptions = req.query.availability.split(',');
      const avFilter = [];
      
      availabilityOptions.forEach(option => {
        if (option === 'today') {
          avFilter.push({ availability: { $regex: 'Today', $options: 'i' } });
        } else if (option === 'tomorrow') {
          avFilter.push({ availability: { $regex: 'Tomorrow', $options: 'i' } });
        } else if (option === 'this_week') {
          avFilter.push({ availability: { $regex: 'This Week', $options: 'i' } });
        }
      });
      
      if (avFilter.length > 0) {
        filter.$or = filter.$or ? [...filter.$or, ...avFilter] : avFilter;
      }
    }
    
    // Filter by consultation fee
    if (req.query.consultationFee) {
      const feeRanges = req.query.consultationFee.split(',');
      const feeFilter = [];
      
      feeRanges.forEach(range => {
        if (range === '0-300') {
          feeFilter.push({ feeAmount: { $gte: 0, $lte: 300 } });
        } else if (range === '301-500') {
          feeFilter.push({ feeAmount: { $gt: 300, $lte: 500 } });
        } else if (range === '501-1000') {
          feeFilter.push({ feeAmount: { $gt: 500, $lte: 1000 } });
        } else if (range === '1000+') {
          feeFilter.push({ feeAmount: { $gt: 1000 } });
        }
      });
      
      if (feeFilter.length > 0) {
        filter.$or = filter.$or ? [...filter.$or, ...feeFilter] : feeFilter;
      }
    }
    
    // Sort options
    let sortOption = {};
    if (req.query.sortBy === 'experience_high_to_low') {
      sortOption = { experienceYears: -1 };
    } else if (req.query.sortBy === 'experience_low_to_high') {
      sortOption = { experienceYears: 1 };
    } else if (req.query.sortBy === 'fee_high_to_low') {
      sortOption = { feeAmount: -1 };
    } else if (req.query.sortBy === 'fee_low_to_high') {
      sortOption = { feeAmount: 1 };
    } else {
      // Default sorting by relevance (rating)
      sortOption = { rating: -1 };
    }
    
    // Execute query with pagination
    const doctors = await Doctor.find(filter)
      .sort(sortOption)
      .skip(skip)
      .limit(limit);
    
    // Get total count for pagination
    const totalDoctors = await Doctor.countDocuments(filter);
    
    res.json({
      doctors,
      currentPage: page,
      totalPages: Math.ceil(totalDoctors / limit),
      totalDoctors
    });
  } catch (error) {
    console.error('Error fetching doctors:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

/**
 * @route   GET /api/doctors/fetch-apollo
 * @desc    Fetch doctors from Apollo247 website and save to database
 * @access  Private (would require authentication in a real app)
 */
router.get('/fetch-apollo', async (req, res) => {
  try {
    const url = 'https://www.apollo247.com/specialties/general-physician-internal-medicine';
    const response = await axios.get(url);
    const html = response.data;
    const $ = cheerio.load(html);

    const doctors = [];
    
    // Extract doctor information from the Apollo247 website
    // This is a simplified scraper example, actual implementation would need to match their structure
    $('.doctor-card').each((index, element) => {
      const name = $(element).find('.doctor-name').text().trim();
      const specialty = $(element).find('.doctor-specialty').text().trim() || 'General Physician';
      const experience = $(element).find('.doctor-experience').text().trim() || '5+ years';
      const experienceYears = parseInt(experience.match(/\d+/) || [5])[0];
      const education = $(element).find('.doctor-education').text().trim() || 'MBBS, MD';
      const languages = $(element).find('.doctor-languages').text().trim().split(',').map(lang => lang.trim()) || ['English', 'Hindi'];
      const gender = index % 2 === 0 ? 'male' : 'female'; // Example logic
      const consultationFee = $(element).find('.doctor-fee').text().trim() || '₹500';
      const feeAmount = parseInt(consultationFee.replace(/[^\d]/g, '')) || 500;
      const availability = ['Today', 'Tomorrow', 'This Week'][Math.floor(Math.random() * 3)];
      const rating = parseFloat((3.5 + Math.random() * 1.5).toFixed(1));
      const reviews = Math.floor(50 + Math.random() * 200);
      const image = $(element).find('img').attr('src') || 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=2070&auto=format&fit=crop';
      
      doctors.push({
        name,
        specialty,
        experience,
        experienceYears,
        education,
        languages,
        gender,
        consultationFee,
        feeAmount,
        availability,
        rating,
        reviews,
        image
      });
    });
    
    if (doctors.length === 0) {
      // If no doctors found via scraping, create mock data
      const mockDoctors = [
        {
          name: "Dr. Rajesh Kumar",
          specialty: "General Physician",
          experience: "15+ years",
          experienceYears: 15,
          education: "MBBS, MD (Internal Medicine)",
          languages: ["English", "Hindi"],
          gender: "male",
          consultationFee: "₹500",
          feeAmount: 500,
          availability: "Today",
          rating: 4.8,
          reviews: 120,
          image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=2070&auto=format&fit=crop"
        },
        // Add more mock doctors here...
        {
          name: "Dr. Priya Singh",
          specialty: "General Physician",
          experience: "8+ years",
          experienceYears: 8,
          education: "MBBS, DNB (Family Medicine)",
          languages: ["English", "Hindi", "Tamil"],
          gender: "female",
          consultationFee: "₹600",
          feeAmount: 600,
          availability: "Tomorrow",
          rating: 4.5,
          reviews: 85,
          image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=2070&auto=format&fit=crop"
        },
        {
          name: "Dr. Vikram Sharma",
          specialty: "Internal Medicine",
          experience: "12+ years",
          experienceYears: 12,
          education: "MBBS, MD (General Medicine)",
          languages: ["English", "Hindi", "Punjabi"],
          gender: "male",
          consultationFee: "₹700",
          feeAmount: 700,
          availability: "Today",
          rating: 4.9,
          reviews: 210,
          image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=2064&auto=format&fit=crop"
        }
      ];
      
      // Save mock doctors to database
      for (const doctor of mockDoctors) {
        const newDoctor = new Doctor(doctor);
        await newDoctor.save();
      }
      
      res.json({
        message: 'Added mock doctor data to database',
        count: mockDoctors.length
      });
    } else {
      // Save scraped doctors to database
      for (const doctor of doctors) {
        const newDoctor = new Doctor(doctor);
        await newDoctor.save();
      }
      
      res.json({
        message: 'Successfully fetched and saved doctors from Apollo247',
        count: doctors.length
      });
    }
  } catch (error) {
    console.error('Error fetching Apollo247 data:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
