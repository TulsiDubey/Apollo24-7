import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, ChevronDown, User, Menu, X, Bell, ShoppingBag } from 'lucide-react';
import DoctorCard from '@/components/DoctorCard';
import FilterSidebar from '@/components/FilterSidebar';
import AddDoctorButton from '@/components/AddDoctorButton';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import SupabaseAuth from '@/components/SupabaseAuth';

const Index = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({
    specialty: 'general-physician-internal-medicine',
    experience: [],
    gender: [],
    availability: [],
    consultationFee: [],
    sortBy: 'relevance'
  });
  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [user, setUser] = useState(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchDoctors();
  }, [page, filters]);

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams();
      queryParams.append('page', page.toString());
      queryParams.append('specialty', filters.specialty);
      
      if (filters.experience.length) {
        queryParams.append('experience', filters.experience.join(','));
      }
      if (filters.gender.length) {
        queryParams.append('gender', filters.gender.join(','));
      }
      if (filters.availability.length) {
        queryParams.append('availability', filters.availability.join(','));
      }
      if (filters.consultationFee.length) {
        queryParams.append('consultationFee', filters.consultationFee.join(','));
      }
      queryParams.append('sortBy', filters.sortBy);
      
      // Get mock doctors data
      const mockDoctors = [
        {
          id: 1,
          name: "Dr. Rajesh Kumar",
          specialty: "General Physician",
          experience: "15+ years",
          education: "MBBS, MD (Internal Medicine)",
          languages: ["English", "Hindi"],
          gender: "male",
          consultationFee: "₹500",
          availability: "Today",
          rating: 4.8,
          reviews: 120,
          image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=2070&auto=format&fit=crop"
        },
        {
          id: 2,
          name: "Dr. Priya Singh",
          specialty: "General Physician",
          experience: "8+ years",
          education: "MBBS, DNB (Family Medicine)",
          languages: ["English", "Hindi", "Tamil"],
          gender: "female",
          consultationFee: "₹600",
          availability: "Tomorrow",
          rating: 4.5,
          reviews: 85,
          image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=2070&auto=format&fit=crop"
        },
        {
          id: 3,
          name: "Dr. Vikram Sharma",
          specialty: "Internal Medicine",
          experience: "12+ years",
          education: "MBBS, MD (General Medicine)",
          languages: ["English", "Hindi", "Punjabi"],
          gender: "male",
          consultationFee: "₹700",
          availability: "Today",
          rating: 4.9,
          reviews: 210,
          image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=2064&auto=format&fit=crop"
        },
        {
          id: 4,
          name: "Dr. Anjali Desai",
          specialty: "General Practitioner",
          experience: "10+ years",
          education: "MBBS, DNB (Family Medicine)",
          languages: ["English", "Hindi", "Gujarati"],
          gender: "female",
          consultationFee: "₹550",
          availability: "Next Week",
          rating: 4.7,
          reviews: 150,
          image: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?q=80&w=2070&auto=format&fit=crop"
        },
        {
          id: 5,
          name: "Dr. Suresh Patel",
          specialty: "Internal Medicine",
          experience: "20+ years",
          education: "MBBS, MD (General Medicine)",
          languages: ["English", "Hindi", "Gujarati"],
          gender: "male",
          consultationFee: "₹800",
          availability: "Today",
          rating: 4.9,
          reviews: 320,
          image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=2064&auto=format&fit=crop"
        },
        {
          id: 6,
          name: "Dr. Neha Gupta",
          specialty: "General Physician",
          experience: "7+ years",
          education: "MBBS, MD (Internal Medicine)",
          languages: ["English", "Hindi"],
          gender: "female",
          consultationFee: "₹450",
          availability: "Tomorrow",
          rating: 4.3,
          reviews: 78,
          image: "https://images.unsplash.com/photo-1651008376811-b90baee60c1f?q=80&w=1887&auto=format&fit=crop"
        },
        {
          id: 7,
          name: "Dr. Arjun Mehta",
          specialty: "General Practitioner",
          experience: "5+ years",
          education: "MBBS, FCPS (Family Medicine)",
          languages: ["English", "Hindi", "Marathi"],
          gender: "male",
          consultationFee: "₹400",
          availability: "Today",
          rating: 4.2,
          reviews: 45,
          image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=2070&auto=format&fit=crop"
        },
        {
          id: 8,
          name: "Dr. Kavita Reddy",
          specialty: "Internal Medicine",
          experience: "14+ years",
          education: "MBBS, MD (General Medicine)",
          languages: ["English", "Hindi", "Telugu"],
          gender: "female",
          consultationFee: "₹750",
          availability: "Tomorrow",
          rating: 4.8,
          reviews: 175,
          image: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?q=80&w=2787&auto=format&fit=crop"
        },
        {
          id: 9,
          name: "Dr. Sanjay Verma",
          specialty: "General Physician",
          experience: "18+ years",
          education: "MBBS, MD (Internal Medicine)",
          languages: ["English", "Hindi"],
          gender: "male",
          consultationFee: "₹850",
          availability: "Today",
          rating: 4.9,
          reviews: 230,
          image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=2064&auto=format&fit=crop"
        },
        {
          id: 10,
          name: "Dr. Maya Iyer",
          specialty: "General Practitioner",
          experience: "6+ years",
          education: "MBBS, DNB (Family Medicine)",
          languages: ["English", "Hindi", "Malayalam"],
          gender: "female",
          consultationFee: "₹500",
          availability: "Tomorrow",
          rating: 4.4,
          reviews: 60,
          image: "https://images.unsplash.com/photo-1651008376811-b90baee60c1f?q=80&w=1887&auto=format&fit=crop"
        },
        {
          id: 11,
          name: "Dr. Alok Sharma",
          specialty: "Internal Medicine",
          experience: "22+ years",
          education: "MBBS, MD (Internal Medicine), DM (Cardiology)",
          languages: ["English", "Hindi"],
          gender: "male",
          consultationFee: "₹1200",
          availability: "Next Week",
          rating: 4.9,
          reviews: 340,
          image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=2064&auto=format&fit=crop"
        },
        {
          id: 12,
          name: "Dr. Divya Nair",
          specialty: "General Physician",
          experience: "9+ years",
          education: "MBBS, DNB (Family Medicine)",
          languages: ["English", "Hindi", "Malayalam"],
          gender: "female",
          consultationFee: "₹550",
          availability: "Today",
          rating: 4.6,
          reviews: 95,
          image: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?q=80&w=2787&auto=format&fit=crop"
        },
        {
          id: 13,
          name: "Dr. Arun Kapoor",
          specialty: "Internal Medicine",
          experience: "16+ years",
          education: "MBBS, MD (General Medicine)",
          languages: ["English", "Hindi", "Punjabi"],
          gender: "male",
          consultationFee: "₹800",
          availability: "Tomorrow",
          rating: 4.7,
          reviews: 180,
          image: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?q=80&w=2070&auto=format&fit=crop"
        },
        {
          id: 14,
          name: "Dr. Ananya Sen",
          specialty: "General Practitioner",
          experience: "8+ years",
          education: "MBBS, DNB (Family Medicine)",
          languages: ["English", "Hindi", "Bengali"],
          gender: "female",
          consultationFee: "₹500",
          availability: "Today",
          rating: 4.5,
          reviews: 110,
          image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=2070&auto=format&fit=crop"
        },
        {
          id: 15,
          name: "Dr. Vivek Malhotra",
          specialty: "General Physician",
          experience: "12+ years",
          education: "MBBS, MD (Internal Medicine)",
          languages: ["English", "Hindi"],
          gender: "male",
          consultationFee: "₹700",
          availability: "Tomorrow",
          rating: 4.6,
          reviews: 140,
          image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=2064&auto=format&fit=crop"
        },
        {
          id: 16,
          name: "Dr. Meera Krishnan",
          specialty: "Internal Medicine",
          experience: "11+ years",
          education: "MBBS, MD (General Medicine)",
          languages: ["English", "Hindi", "Tamil"],
          gender: "female",
          consultationFee: "₹650",
          availability: "Next Week",
          rating: 4.7,
          reviews: 130,
          image: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?q=80&w=2787&auto=format&fit=crop"
        },
        {
          id: 17,
          name: "Dr. Rohit Chadha",
          specialty: "General Physician",
          experience: "14+ years",
          education: "MBBS, MD (Internal Medicine)",
          languages: ["English", "Hindi"],
          gender: "male",
          consultationFee: "₹750",
          availability: "Today",
          rating: 4.8,
          reviews: 160,
          image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=2070&auto=format&fit=crop"
        },
        {
          id: 18,
          name: "Dr. Pooja Sharma",
          specialty: "General Practitioner",
          experience: "7+ years",
          education: "MBBS, FCPS (Family Medicine)",
          languages: ["English", "Hindi"],
          gender: "female",
          consultationFee: "₹480",
          availability: "Tomorrow",
          rating: 4.3,
          reviews: 85,
          image: "https://images.unsplash.com/photo-1651008376811-b90baee60c1f?q=80&w=1887&auto=format&fit=crop"
        },
        {
          id: 19,
          name: "Dr. Harish Menon",
          specialty: "Internal Medicine",
          experience: "19+ years",
          education: "MBBS, MD (General Medicine)",
          languages: ["English", "Hindi", "Malayalam"],
          gender: "male",
          consultationFee: "₹900",
          availability: "Next Week",
          rating: 4.9,
          reviews: 210,
          image: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?q=80&w=2070&auto=format&fit=crop"
        },
        {
          id: 20,
          name: "Dr. Sneha Patil",
          specialty: "General Physician",
          experience: "10+ years",
          education: "MBBS, DNB (Family Medicine)",
          languages: ["English", "Hindi", "Marathi"],
          gender: "female",
          consultationFee: "₹600",
          availability: "Today",
          rating: 4.6,
          reviews: 120,
          image: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?q=80&w=2787&auto=format&fit=crop"
        },
        {
          id: 21,
          name: "Dr. Karthik Rajan",
          specialty: "General Practitioner",
          experience: "8+ years",
          education: "MBBS, MD (Family Medicine)",
          languages: ["English", "Hindi", "Tamil"],
          gender: "male",
          consultationFee: "₹550",
          availability: "Tomorrow",
          rating: 4.5,
          reviews: 90,
          image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=2070&auto=format&fit=crop"
        },
        {
          id: 22,
          name: "Dr. Leela Varma",
          specialty: "Internal Medicine",
          experience: "15+ years",
          education: "MBBS, MD (Internal Medicine)",
          languages: ["English", "Hindi", "Telugu"],
          gender: "female",
          consultationFee: "₹800",
          availability: "Today",
          rating: 4.8,
          reviews: 170,
          image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=2070&auto=format&fit=crop"
        },
        {
          id: 23,
          name: "Dr. Prakash Iyer",
          specialty: "General Physician",
          experience: "17+ years",
          education: "MBBS, DNB (General Medicine)",
          languages: ["English", "Hindi", "Malayalam"],
          gender: "male",
          consultationFee: "₹850",
          availability: "Next Week",
          rating: 4.9,
          reviews: 190,
          image: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?q=80&w=2070&auto=format&fit=crop"
        },
        {
          id: 24,
          name: "Dr. Nisha Deshmukh",
          specialty: "General Practitioner",
          experience: "6+ years",
          education: "MBBS, DNB (Family Medicine)",
          languages: ["English", "Hindi", "Marathi"],
          gender: "female",
          consultationFee: "₹480",
          availability: "Tomorrow",
          rating: 4.3,
          reviews: 70,
          image: "https://images.unsplash.com/photo-1651008376811-b90baee60c1f?q=80&w=1887&auto=format&fit=crop"
        },
        {
          id: 25,
          name: "Dr. Mohan Rao",
          specialty: "Internal Medicine",
          experience: "21+ years",
          education: "MBBS, MD (General Medicine), DM (Endocrinology)",
          languages: ["English", "Hindi", "Telugu"],
          gender: "male",
          consultationFee: "₹1100",
          availability: "Today",
          rating: 4.9,
          reviews: 280,
          image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=2064&auto=format&fit=crop"
        },
        {
          id: 26,
          name: "Dr. Radha Menon",
          specialty: "General Physician",
          experience: "9+ years",
          education: "MBBS, MD (Internal Medicine)",
          languages: ["English", "Hindi", "Malayalam"],
          gender: "female",
          consultationFee: "₹580",
          availability: "Today",
          rating: 4.6,
          reviews: 110,
          image: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?q=80&w=2787&auto=format&fit=crop"
        },
        {
          id: 27,
          name: "Dr. Nitin Verma",
          specialty: "General Practitioner",
          experience: "11+ years",
          education: "MBBS, DNB (Family Medicine)",
          languages: ["English", "Hindi"],
          gender: "male",
          consultationFee: "₹650",
          availability: "Tomorrow",
          rating: 4.7,
          reviews: 140,
          image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=2070&auto=format&fit=crop"
        },
        {
          id: 28,
          name: "Dr. Deepa Nair",
          specialty: "Internal Medicine",
          experience: "13+ years",
          education: "MBBS, MD (General Medicine)",
          languages: ["English", "Hindi", "Malayalam"],
          gender: "female",
          consultationFee: "₹720",
          availability: "Next Week",
          rating: 4.8,
          reviews: 150,
          image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=2070&auto=format&fit=crop"
        },
        {
          id: 29,
          name: "Dr. Anand Joshi",
          specialty: "General Physician",
          experience: "16+ years",
          education: "MBBS, MD (Internal Medicine)",
          languages: ["English", "Hindi", "Marathi"],
          gender: "male",
          consultationFee: "₹800",
          availability: "Today",
          rating: 4.8,
          reviews: 190,
          image: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?q=80&w=2070&auto=format&fit=crop"
        },
        {
          id: 30,
          name: "Dr. Shalini Khanna",
          specialty: "General Practitioner",
          experience: "8+ years",
          education: "MBBS, DNB (Family Medicine)",
          languages: ["English", "Hindi", "Punjabi"],
          gender: "female",
          consultationFee: "₹550",
          availability: "Tomorrow",
          rating: 4.5,
          reviews: 100,
          image: "https://images.unsplash.com/photo-1651008376811-b90baee60c1f?q=80&w=1887&auto=format&fit=crop"
        }
      ];
      
      // Fetch locally added doctors from localStorage
      let localDoctors = [];
      try {
        const storedDoctors = localStorage.getItem('doctors');
        if (storedDoctors) {
          localDoctors = JSON.parse(storedDoctors);
        }
      } catch (error) {
        console.error("Error retrieving local doctors:", error);
      }
      
      // Combine mock and local doctors
      const allDoctors = [...mockDoctors, ...localDoctors];
      
      // Apply filters on all doctors
      let filteredDoctors = [...allDoctors];
      
      // Filter by experience
      if (filters.experience.length > 0) {
        filteredDoctors = filteredDoctors.filter(doctor => {
          const yearsMatch = doctor.experience.match(/\d+/);
          const years = yearsMatch ? parseInt(yearsMatch[0]) : 0;
          
          return filters.experience.some(range => {
            if (range === '0-5') return years >= 0 && years <= 5;
            if (range === '5-10') return years > 5 && years <= 10;
            if (range === '10-15') return years > 10 && years <= 15;
            if (range === '15+') return years > 15;
            return false;
          });
        });
      }
      
      // Filter by gender
      if (filters.gender.length > 0) {
        filteredDoctors = filteredDoctors.filter(doctor => 
          filters.gender.includes(doctor.gender)
        );
      }
      
      // Filter by availability
      if (filters.availability.length > 0) {
        filteredDoctors = filteredDoctors.filter(doctor => {
          return filters.availability.some(avail => {
            if (avail === 'today') return doctor.availability.toLowerCase() === 'today';
            if (avail === 'tomorrow') return doctor.availability.toLowerCase() === 'tomorrow';
            if (avail === 'this_week') return doctor.availability.toLowerCase() === 'next week';
            return false;
          });
        });
      }
      
      // Filter by consultation fee
      if (filters.consultationFee.length > 0) {
        filteredDoctors = filteredDoctors.filter(doctor => {
          const feeText = doctor.consultationFee.replace(/[^\d]/g, '');
          const fee = feeText ? parseInt(feeText) : 0;
          
          return filters.consultationFee.some(range => {
            if (range === '0-300') return fee >= 0 && fee <= 300;
            if (range === '301-500') return fee > 300 && fee <= 500;
            if (range === '501-1000') return fee > 500 && fee <= 1000;
            if (range === '1000+') return fee > 1000;
            return false;
          });
        });
      }
      
      // Apply sorting
      if (filters.sortBy === 'experience_high_to_low') {
        filteredDoctors.sort((a, b) => {
          const yearsAMatch = a.experience.match(/\d+/);
          const yearsBMatch = b.experience.match(/\d+/);
          const yearsA = yearsAMatch ? parseInt(yearsAMatch[0]) : 0;
          const yearsB = yearsBMatch ? parseInt(yearsBMatch[0]) : 0;
          return yearsB - yearsA;
        });
      } else if (filters.sortBy === 'experience_low_to_high') {
        filteredDoctors.sort((a, b) => {
          const yearsAMatch = a.experience.match(/\d+/);
          const yearsBMatch = b.experience.match(/\d+/);
          const yearsA = yearsAMatch ? parseInt(yearsAMatch[0]) : 0;
          const yearsB = yearsBMatch ? parseInt(yearsBMatch[0]) : 0;
          return yearsA - yearsB;
        });
      } else if (filters.sortBy === 'fee_high_to_low') {
        filteredDoctors.sort((a, b) => {
          const feeAText = a.consultationFee.replace(/[^\d]/g, '');
          const feeBText = b.consultationFee.replace(/[^\d]/g, '');
          const feeA = feeAText ? parseInt(feeAText) : 0;
          const feeB = feeBText ? parseInt(feeBText) : 0;
          return feeB - feeA;
        });
      } else if (filters.sortBy === 'fee_low_to_high') {
        filteredDoctors.sort((a, b) => {
          const feeAText = a.consultationFee.replace(/[^\d]/g, '');
          const feeBText = b.consultationFee.replace(/[^\d]/g, '');
          const feeA = feeAText ? parseInt(feeAText) : 0;
          const feeB = feeBText ? parseInt(feeBText) : 0;
          return feeA - feeB;
        });
      } else {
        // Default sort by rating
        filteredDoctors.sort((a, b) => b.rating - a.rating);
      }
      
      // Apply search filter if there's a search term
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        filteredDoctors = filteredDoctors.filter(doctor => 
          doctor.name.toLowerCase().includes(term) || 
          doctor.specialty.toLowerCase().includes(term) ||
          doctor.education.toLowerCase().includes(term)
        );
      }
      
      setDoctors(filteredDoctors);
      setTotalPages(Math.ceil(filteredDoctors.length / 6)); // 6 per page

      setLoading(false);
    } catch (error) {
      console.error('Error fetching doctors:', error);
      toast({
        title: "Error",
        description: "Failed to fetch doctors. Please try again.",
        variant: "destructive"
      });
      setLoading(false);
    }
  };

  const handleFilterChange = (newFilters) => {
    setFilters({...filters, ...newFilters});
    setPage(1); // Reset to first page when filters change
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    // This will trigger the useEffect by changing searchTerm, which will refetch/filter doctors
    fetchDoctors();
  };

  const handleAuthSuccess = (userData) => {
    setUser(userData);
    setShowAuthModal(false);
    toast({
      title: "Login Successful",
      description: `Welcome back, ${userData.email}!`,
      duration: 3000,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Authentication Modal */}
      {showAuthModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="relative w-full max-w-md">
            <button 
              onClick={() => setShowAuthModal(false)} 
              className="absolute top-2 right-2 bg-white rounded-full p-1 hover:bg-gray-100"
            >
              <X size={20} />
            </button>
            <SupabaseAuth onAuthSuccess={handleAuthSuccess} />
          </div>
        </div>
      )}

      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <button 
                className="mr-2 sm:hidden" 
                onClick={() => setShowMobileMenu(!showMobileMenu)}
              >
                {showMobileMenu ? (
                  <X size={24} className="text-gray-700" />
                ) : (
                  <Menu size={24} className="text-gray-700" />
                )}
              </button>
              <Link to="/" className="text-2xl font-bold text-blue-600">
                Apollo 24*7
              </Link>
            </div>
            
            <div className={`${showMobileMenu ? 'flex' : 'hidden'} md:flex absolute md:static left-0 right-0 top-full bg-white md:bg-transparent p-4 md:p-0 flex-col md:flex-row shadow-md md:shadow-none items-start md:items-center space-y-3 md:space-y-0 md:space-x-6`}>
              <a href="#" className="text-gray-600 hover:text-blue-600 font-medium">Find Doctors</a>
              <a href="#" className="text-gray-600 hover:text-blue-600 font-medium">Medicines</a>
              <a href="#" className="text-gray-600 hover:text-blue-600 font-medium">Lab Tests</a>
              <a href="#" className="text-gray-600 hover:text-blue-600 font-medium">Health Records</a>
            </div>
            
            <div className="flex items-center space-x-4">
              <button className="text-gray-700 hover:text-blue-600">
                <ShoppingBag size={20} />
              </button>
              <button className="text-gray-700 hover:text-blue-600">
                <Bell size={20} />
              </button>
              
              {user ? (
                <div className="flex items-center space-x-2">
                  <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-white">
                    {user.email ? user.email.charAt(0).toUpperCase() : <User size={16} />}
                  </div>
                  <span className="hidden md:inline text-sm font-medium">{user.email}</span>
                </div>
              ) : (
                <Button 
                  variant="outline" 
                  className="flex items-center" 
                  onClick={() => setShowAuthModal(true)}
                >
                  <User size={16} className="mr-2" />
                  <span>Login</span>
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Title and Search Section */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Find the Best General Physicians Near You</h1>
          <p className="text-gray-600">Consult with experienced doctors for all your health needs</p>
          
          <div className="mt-6 relative">
            <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <Input 
                  placeholder="Search doctors by name, specialty..." 
                  className="pl-10 pr-4 py-2 w-full"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">
                Search
              </Button>
            </form>
          </div>
        </div>
        
        {/* Main Content */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Filters Sidebar - Mobile Toggle */}
          <div className="lg:hidden flex justify-between items-center mb-4">
            <Button 
              variant="outline" 
              className="flex items-center text-gray-700" 
              onClick={toggleFilters}
            >
              <Filter size={16} className="mr-2" />
              {showFilters ? "Hide Filters" : "Show Filters"}
            </Button>
            
            <div className="flex items-center">
              <span className="text-sm text-gray-600 mr-2">Sort By:</span>
              <Select 
                value={filters.sortBy} 
                onValueChange={(value) => handleFilterChange({sortBy: value})}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="relevance">Relevance</SelectItem>
                  <SelectItem value="experience_high_to_low">Experience: High to Low</SelectItem>
                  <SelectItem value="experience_low_to_high">Experience: Low to High</SelectItem>
                  <SelectItem value="fee_high_to_low">Fees: High to Low</SelectItem>
                  <SelectItem value="fee_low_to_high">Fees: Low to High</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {/* Filters Sidebar */}
          <div className={`${showFilters ? 'block' : 'hidden'} lg:block w-full lg:w-1/4 lg:min-w-[250px]`}>
            <FilterSidebar 
              filters={filters} 
              onFilterChange={handleFilterChange} 
            />
          </div>
          
          {/* Doctor Listings */}
          <div className="w-full lg:w-3/4">
            <div className="hidden lg:flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">
                {loading ? 'Loading doctors...' : `${doctors.length} Doctors Found`}
              </h2>
              
              <div className="flex items-center gap-4">
                <div className="flex items-center">
                  <span className="text-sm text-gray-600 mr-2">Sort By:</span>
                  <Select 
                    value={filters.sortBy} 
                    onValueChange={(value) => handleFilterChange({sortBy: value})}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="relevance">Relevance</SelectItem>
                      <SelectItem value="experience_high_to_low">Experience: High to Low</SelectItem>
                      <SelectItem value="experience_low_to_high">Experience: Low to High</SelectItem>
                      <SelectItem value="fee_high_to_low">Fees: High to Low</SelectItem>
                      <SelectItem value="fee_low_to_high">Fees: Low to High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <AddDoctorButton />
              </div>
            </div>
            
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
            ) : doctors.length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">No doctors found</h3>
                <p className="text-gray-600 mb-6">Try adjusting your filters or search criteria</p>
                <Button 
                  onClick={() => {
                    setFilters({
                      specialty: 'general-physician-internal-medicine',
                      experience: [],
                      gender: [],
                      availability: [],
                      consultationFee: [],
                      sortBy: 'relevance'
                    });
                    setSearchTerm('');
                  }}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Reset Filters
                </Button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  {doctors.slice((page - 1) * 6, page * 6).map((doctor) => (
                    <DoctorCard key={doctor.id} doctor={doctor} />
                  ))}
                </div>
                
                <div className="mt-8 flex justify-center">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious 
                          onClick={() => page > 1 && setPage(page - 1)}
                          className={page <= 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                        />
                      </PaginationItem>
                      
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                        <PaginationItem key={pageNum}>
                          <PaginationLink
                            onClick={() => setPage(pageNum)}
                            isActive={pageNum === page}
                          >
                            {pageNum}
                          </PaginationLink>
                        </PaginationItem>
                      ))}
                      
                      <PaginationItem>
                        <PaginationNext
                          onClick={() => page < totalPages && setPage(page + 1)}
                          className={page >= totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              </>
            )}
          </div>
        </div>
      </main>
      
      <footer className="bg-white border-t mt-16 py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4 text-gray-800">Apollo 24*7</h3>
              <p className="text-gray-600 mb-4">Your trusted healthcare partner available 24/7 for all your medical needs.</p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4 text-gray-800">Quick Links</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-600 hover:text-blue-600">About Us</a></li>
                <li><a href="#" className="text-gray-600 hover:text-blue-600">Find Doctors</a></li>
                <li><a href="#" className="text-gray-600 hover:text-blue-600">Health Articles</a></li>
                <li><a href="#" className="text-gray-600 hover:text-blue-600">Contact Us</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4 text-gray-800">Services</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-600 hover:text-blue-600">Online Consultations</a></li>
                <li><a href="#" className="text-gray-600 hover:text-blue-600">Medicines</a></li>
                <li><a href="#" className="text-gray-600 hover:text-blue-600">Lab Tests</a></li>
                <li><a href="#" className="text-gray-600 hover:text-blue-600">Health Records</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4 text-gray-800">Connect With Us</h3>
              <div className="flex space-x-4">
                <a href="#" className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all">
                  <span className="sr-only">Facebook</span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                  </svg>
                </a>
                <a href="#" className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center hover:bg-blue-400 hover:text-white transition-all">
                  <span className="sr-only">Twitter</span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                  </svg>
                </a>
                <a href="#" className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center hover:bg-pink-600 hover:text-white transition-all">
                  <span className="sr-only">Instagram</span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                  </svg>
                </a>
              </div>
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t text-center text-gray-600">
            <p>&copy; {new Date().getFullYear()} Apollo 24*7. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
