
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

const AddDoctorButton = () => {
  const navigate = useNavigate();
  
  return (
    <Button 
      onClick={() => navigate('/add-doctor')}
      className="bg-green-600 hover:bg-green-700 text-white transition-colors"
    >
      <Plus size={16} className="mr-1" />
      Add Doctor
    </Button>
  );
};

export default AddDoctorButton;
