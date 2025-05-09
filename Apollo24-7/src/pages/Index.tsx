import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, Filter, ChevronDown, User, Menu, X, Bell, ShoppingBag 
} from 'lucide-react';
import DoctorCard from '@/components/DoctorCard';
import FilterSidebar from '@/components/FilterSidebar';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import FirebaseAuth from '@/components/FirebaseAuth';
import { getStoredDoctors, Doctor } from '@/services/doctorService';
import { useFirebaseAuth } from '@/hooks/useFirebaseAuth';
import AddDoctorButton from '@/components/AddDoctorButton';

const Index = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
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
  
  const { user } = useFirebaseAuth();
  const { toast } = useToast();

  useEffect(() => {
    fetchDoctors();
  }, [page, filters]);

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      const storedDoctors = getStoredDoctors();
      
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
      
      console.log(`API call parameters: ${queryParams.toString()}`);
      
      setTimeout(() => {
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
            image: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?q=80&w=2787&auto=format&fit=crop"
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
            image: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?q=80&w=2070&auto=format&fit=crop"
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
        
        let allDoctors = [...storedDoctors, ...mockDoctors];
        
        let filteredDoctors = [...allDoctors];
        
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
        
        if (filters.gender.length > 0) {
          filteredDoctors = filteredDoctors.filter(doctor => 
            filters.gender.includes(doctor.gender)
          );
        }
        
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
          filteredDoctors.sort((a, b) => b.rating - a.rating);
        }
        
        if (searchTerm) {
          const term = searchTerm.toLowerCase();
          filteredDoctors = filteredDoctors.filter(doctor => 
            doctor.name.toLowerCase().includes(term) || 
            doctor.specialty.toLowerCase().includes(term) ||
            doctor.education.toLowerCase().includes(term)
          );
        }
        
        const uniqueDoctors = Array.from(new Map(filteredDoctors.map(doctor => 
          [doctor.id, doctor]
        )).values());
        
        setDoctors(uniqueDoctors);
        setTotalPages(Math.ceil(uniqueDoctors.length / 6));
        setLoading(false);
      }, 1000);
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
    setPage(1);
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchDoctors();
  };

  const handleAuthSuccess = (userData) => {
    setShowAuthModal(false);
    toast({
      title: "Login Successful",
      description: `Welcome back, ${userData.email}!`,
      duration: 3000,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {showAuthModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="relative w-full max-w-md">
            <button 
              onClick={() => setShowAuthModal(false)} 
              className="absolute top-2 right-2 bg-white rounded-full p-1 hover:bg-gray-100"
            >
              <X size={20} />
            </button>
            <FirebaseAuth onAuthSuccess={handleAuthSuccess} />
          </div>
        </div>
      )}

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
                    {user.email?.substring(0, 1).toUpperCase() || "U"}
                  </div>
                  <span className="hidden md:inline text-sm font-medium">
                    {user.email?.split('@')[0] || "User"}
                  </span>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-gray-700 hover:text-red-600"
                    onClick={() => {
                      import('../services/firebase').then(({ signOut }) => {
                        signOut();
                        toast({
                          title: "Logged Out",
                          description: "You have been logged out successfully.",
                          duration: 3000,
                        });
                      });
                    }}
                  >
                    Logout
                  </Button>
                </div>
              ) : (
                <Button 
                  variant="outline" 
                  className="flex items-center space-x-1"
                  onClick={() => setShowAuthModal(true)}
                >
                  <User size={16} />
                  <span>Login / Register</span>
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Find the Best Doctors Near You</h1>
          {user && <AddDoctorButton />}
        </div>
        
        {/* Search and Filter Bar */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <form onSubmit={handleSearch} className="flex-1">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={18} className="text-gray-400" />
              </div>
              <Input
                type="text"
                placeholder="Search for doctors by name, specialty, or education"
                className="w-full pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button
                type="submit"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                <span className="text-blue-600 text-sm font-medium">Search</span>
              </button>
            </div>
          </form>
          
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              className="flex items-center space-x-1"
              onClick={toggleFilters}
            >
              <Filter size={16} className="text-gray-500" />
              <span>Filters</span>
            </Button>
            
            <div className="relative inline-block">
              <Select value={filters.sortBy} onValueChange={(value) => handleFilterChange({ sortBy: value })}>
                <SelectTrigger className="w-[180px]">
                  <div className="flex items-center space-x-1">
                    <span>Sort By</span>
                    <ChevronDown size={14} className="text-gray-500" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="relevance">Relevance</SelectItem>
                  <SelectItem value="experience_high_to_low">Experience: High to Low</SelectItem>
                  <SelectItem value="experience_low_to_high">Experience: Low to High</SelectItem>
                  <SelectItem value="fee_high_to_low">Fee: High to Low</SelectItem>
                  <SelectItem value="fee_low_to_high">Fee: Low to High</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        
        {/* Main Content */}
        <div className="flex flex-col md:flex-row gap-6">
          {/* Filter Sidebar - Visible on desktop, hidden on mobile unless toggled */}
          {(showFilters || window.innerWidth >= 768) && (
            <aside className={`md:w-72 ${showFilters ? 'block' : 'hidden md:block'} bg-white rounded-lg shadow mb-4 md:mb-0`}>
              <FilterSidebar 
                filters={filters} 
                onChange={handleFilterChange}
                onClose={() => setShowFilters(false)}
              />
            </aside>
          )}
          
          {/* Doctor List */}
          <div className="flex-1">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Array.from({ length: 6 }).map((_, index) => (
                  <div key={index} className="bg-white rounded-lg shadow p-4 h-72 animate-pulse">
                    <div className="w-full h-32 bg-gray-200 rounded mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                  </div>
                ))}
              </div>
            ) : (
              <>
                {doctors.length === 0 ? (
                  <div className="bg-white rounded-lg shadow p-6 text-center">
                    <p className="text-xl text-gray-600">No doctors found matching your criteria.</p>
                    <p className="text-gray-500 mt-2">Try adjusting your filters or search terms.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {doctors.slice((page - 1) * 6, page * 6).map((doctor) => (
                      <DoctorCard key={doctor.id} doctor={doctor} />
                    ))}
                  </div>
                )}
                
                {totalPages > 1 && (
                  <Pagination className="mt-8">
                    <PaginationContent>
                      <PaginationItem>
                        {page === 1 ? (
                          <PaginationPrevious 
                            className="pointer-events-none opacity-50"
                            onClick={() => {}}
                          />
                        ) : (
                          <PaginationPrevious 
                            onClick={() => setPage(Math.max(1, page - 1))}
                          />
                        )}
                      </PaginationItem>
                      
                      {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
                        // Show a window of pages around the current page
                        let pageNum;
                        if (totalPages <= 5) {
                          // If 5 or fewer pages, show all
                          pageNum = i + 1;
                        } else if (page <= 3) {
                          // Near the start
                          pageNum = i + 1;
                        } else if (page >= totalPages - 2) {
                          // Near the end
                          pageNum = totalPages - 4 + i;
                        } else {
                          // In the middle
                          pageNum = page - 2 + i;
                        }
                        
                        return (
                          <PaginationItem key={i}>
                            <PaginationLink 
                              isActive={pageNum === page}
                              onClick={() => setPage(pageNum)}
                            >
                              {pageNum}
                            </PaginationLink>
                          </PaginationItem>
                        );
                      })}
                      
                      <PaginationItem>
                        {page === totalPages ? (
                          <PaginationNext 
                            className="pointer-events-none opacity-50"
                            onClick={() => {}}
                          />
                        ) : (
                          <PaginationNext 
                            onClick={() => setPage(Math.min(totalPages, page + 1))}
                          />
                        )}
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                )}
              </>
            )}
          </div>
        </div>
      </main>
      
      <footer className="bg-gray-800 text-white py-8 mt-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-bold mb-4">Apollo 24*7</h3>
              <p className="text-gray-300">Your trusted healthcare partner, providing access to the best doctors and medical services online.</p>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-300 hover:text-white">About Us</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white">Contact Us</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white">Careers</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white">Press</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">Important Links</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-300 hover:text-white">Privacy Policy</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white">Terms of Use</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white">Refund Policy</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white">FAQs</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-6 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} Apollo 24*7. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
