
import React from 'react';
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown } from 'lucide-react';

const FilterSidebar = ({ filters, onFilterChange }) => {
  // Filter options
  const experienceOptions = [
    { value: '0-5', label: '0-5 years' },
    { value: '5-10', label: '5-10 years' },
    { value: '10-15', label: '10-15 years' },
    { value: '15+', label: '15+ years' },
  ];
  
  const genderOptions = [
    { value: 'male', label: 'Male Doctor' },
    { value: 'female', label: 'Female Doctor' },
  ];
  
  const availabilityOptions = [
    { value: 'today', label: 'Today' },
    { value: 'tomorrow', label: 'Tomorrow' },
    { value: 'this_week', label: 'This Week' },
  ];
  
  const consultationFeeOptions = [
    { value: '0-300', label: '₹0 - ₹300' },
    { value: '301-500', label: '₹301 - ₹500' },
    { value: '501-1000', label: '₹501 - ₹1000' },
    { value: '1000+', label: '₹1000+' },
  ];
  
  const handleCheckboxChange = (filterType, value) => {
    const currentValues = [...filters[filterType]];
    if (currentValues.includes(value)) {
      // Remove value if already selected
      onFilterChange({
        [filterType]: currentValues.filter(item => item !== value)
      });
    } else {
      // Add value if not selected
      onFilterChange({
        [filterType]: [...currentValues, value]
      });
    }
  };

  // Create a filter section component for reusability
  const FilterSection = ({ title, options, filterType }) => (
    <Collapsible defaultOpen={true} className="mb-6">
      <CollapsibleTrigger className="flex items-center justify-between w-full">
        <h4 className="font-medium text-gray-800">{title}</h4>
        <ChevronDown className="h-5 w-5 text-gray-500 transition-transform ui-expanded:rotate-180" />
      </CollapsibleTrigger>
      <CollapsibleContent className="pt-2 space-y-2">
        {options.map((option) => (
          <div key={option.value} className="flex items-center gap-2">
            <Checkbox
              id={`${filterType}-${option.value}`}
              checked={filters[filterType].includes(option.value)}
              onCheckedChange={() => handleCheckboxChange(filterType, option.value)}
            />
            <Label
              htmlFor={`${filterType}-${option.value}`}
              className="text-gray-700 cursor-pointer"
            >
              {option.label}
            </Label>
          </div>
        ))}
      </CollapsibleContent>
    </Collapsible>
  );
  
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-bold text-lg">Filters</h3>
        <button 
          onClick={() => onFilterChange({
            experience: [],
            gender: [],
            availability: [],
            consultationFee: []
          })}
          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
        >
          Clear All
        </button>
      </div>
      
      <FilterSection 
        title="Experience" 
        options={experienceOptions} 
        filterType="experience" 
      />
      
      <FilterSection 
        title="Gender" 
        options={genderOptions} 
        filterType="gender" 
      />
      
      <FilterSection 
        title="Availability" 
        options={availabilityOptions} 
        filterType="availability" 
      />
      
      <FilterSection 
        title="Consultation Fee" 
        options={consultationFeeOptions} 
        filterType="consultationFee" 
      />
    </div>
  );
};

export default FilterSidebar;
