
import React from 'react';
import { Star, Clock, MapPin, ThumbsUp, Award, Languages } from 'lucide-react';
import { Button } from '@/components/ui/button';

const DoctorCard = ({ doctor }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow border border-gray-100">
      <div className="flex flex-col sm:flex-row">
        {/* Doctor Image and Rating */}
        <div className="sm:mr-6 mb-4 sm:mb-0 flex flex-col items-center">
          <div className="relative">
            <img 
              src={doctor.image} 
              alt={doctor.name} 
              className="w-28 h-28 object-cover rounded-lg mb-2 shadow-sm"
            />
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-white px-2 py-1 rounded-full shadow-sm flex items-center">
              <Star size={14} className="text-yellow-400 fill-yellow-400 mr-1" />
              <span className="font-bold text-sm">{doctor.rating}</span>
              <span className="text-gray-500 text-xs ml-1">({doctor.reviews})</span>
            </div>
          </div>
          
          <span className="mt-3 text-sm text-blue-600 font-medium">
            {doctor.gender === 'male' ? 'Male Doctor' : 'Female Doctor'}
          </span>
        </div>
        
        {/* Doctor Information */}
        <div className="flex-1">
          <h3 className="text-xl font-bold text-gray-800 flex items-center gap-1">
            {doctor.name}
            <ThumbsUp size={14} className="text-blue-500 ml-2" />
          </h3>
          <p className="text-blue-600 font-medium">{doctor.specialty}</p>
          
          <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-sm text-gray-600">
            <div className="flex items-center">
              <Award size={14} className="mr-1 text-gray-500" />
              <span>{doctor.experience} experience</span>
            </div>
            <div className="flex items-center">
              <Languages size={14} className="mr-1 text-gray-500" />
              <span>{doctor.languages.join(", ")}</span>
            </div>
          </div>
          
          <p className="text-gray-600 text-sm mt-2">{doctor.education}</p>
          
          <div className="mt-4 pt-4 border-t border-gray-100 flex flex-wrap sm:flex-nowrap items-center justify-between gap-4">
            <div>
              <p className="text-gray-500 text-xs mb-1">Consultation Fee</p>
              <p className="font-semibold text-gray-800">{doctor.consultationFee}</p>
            </div>
            
            <div>
              <p className="text-gray-500 text-xs mb-1">Available</p>
              <div className="flex items-center">
                <Clock size={14} className="text-green-500 mr-1" />
                <p className="font-semibold text-green-600">{doctor.availability}</p>
              </div>
            </div>
            
            <Button className="bg-blue-600 hover:bg-blue-700 text-white transition px-6 py-2 h-auto">
              Book Now
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorCard;
