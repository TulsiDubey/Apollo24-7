
import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { saveDoctor, uploadDoctorImage } from '@/services/doctorService';
import { Upload, Image } from 'lucide-react';

const AddDoctor = () => {
  const [name, setName] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [experience, setExperience] = useState('');
  const [education, setEducation] = useState('');
  const [languages, setLanguages] = useState('');
  const [gender, setGender] = useState('');
  const [consultationFee, setConsultationFee] = useState('');
  const [availability, setAvailability] = useState('');
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageFile(file);
    
    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Upload image if selected
      let imageUrl = '';
      if (imageFile) {
        imageUrl = await uploadDoctorImage(imageFile);
      } else {
        // Default image if none provided
        imageUrl = 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=2070&auto=format&fit=crop';
      }

      // Save doctor data
      const newDoctor = {
        id: Date.now().toString(),
        name,
        specialty,
        experience: experience + '+ years',
        education,
        languages: languages.split(',').map(lang => lang.trim()),
        gender,
        consultationFee: '₹' + consultationFee,
        availability,
        rating: 4.5, // Default rating for new doctors
        reviews: 0,   // New doctors start with 0 reviews
        image: imageUrl
      };

      saveDoctor(newDoctor);

      toast({
        title: "Success!",
        description: `Dr. ${name} has been added successfully.`,
        duration: 3000,
      });

      // Navigate back to home page after successful submission
      navigate('/');
    } catch (error) {
      console.error("Error adding doctor:", error);
      toast({
        title: "Error",
        description: "Failed to add doctor. Please try again.",
        variant: "destructive",
        duration: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Add New Doctor</CardTitle>
          <CardDescription className="text-center">Fill in the details to add a new doctor to Apollo 24*7</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex flex-col items-center mb-6">
              <div 
                className="w-32 h-32 rounded-full mb-4 bg-gray-200 flex items-center justify-center overflow-hidden border-2 border-dashed border-gray-400 cursor-pointer"
                onClick={triggerFileInput}
              >
                {imagePreview ? (
                  <img 
                    src={imagePreview} 
                    alt="Doctor preview" 
                    className="w-full h-full object-cover" 
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center text-gray-500">
                    <Image size={40} />
                    <span className="text-xs mt-1">Add Photo</span>
                  </div>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
              <Button 
                type="button" 
                variant="outline"
                onClick={triggerFileInput}
                className="flex items-center"
              >
                <Upload size={16} className="mr-2" />
                Upload Photo
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name">Doctor's Name</Label>
                <Input 
                  id="name" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  placeholder="Dr. Full Name" 
                  required 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="specialty">Specialty</Label>
                <Select 
                  value={specialty} 
                  onValueChange={setSpecialty}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a specialty" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="General Physician">General Physician</SelectItem>
                    <SelectItem value="Internal Medicine">Internal Medicine</SelectItem>
                    <SelectItem value="General Practitioner">General Practitioner</SelectItem>
                    <SelectItem value="Cardiologist">Cardiologist</SelectItem>
                    <SelectItem value="Neurologist">Neurologist</SelectItem>
                    <SelectItem value="Dermatologist">Dermatologist</SelectItem>
                    <SelectItem value="Pediatrician">Pediatrician</SelectItem>
                    <SelectItem value="Orthopedic Surgeon">Orthopedic Surgeon</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="experience">Years of Experience</Label>
                <Input 
                  id="experience" 
                  type="number" 
                  value={experience} 
                  onChange={(e) => setExperience(e.target.value)} 
                  placeholder="Years" 
                  required 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="consultationFee">Consultation Fee (₹)</Label>
                <Input 
                  id="consultationFee" 
                  type="number" 
                  value={consultationFee} 
                  onChange={(e) => setConsultationFee(e.target.value)} 
                  placeholder="Amount in INR" 
                  required 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="education">Education/Qualifications</Label>
                <Textarea 
                  id="education" 
                  value={education} 
                  onChange={(e) => setEducation(e.target.value)} 
                  placeholder="e.g., MBBS, MD (Internal Medicine)" 
                  required 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="languages">Languages Spoken</Label>
                <Input 
                  id="languages" 
                  value={languages} 
                  onChange={(e) => setLanguages(e.target.value)} 
                  placeholder="English, Hindi, etc. (comma separated)" 
                  required 
                />
              </div>
              
              <div className="space-y-2">
                <Label>Gender</Label>
                <RadioGroup 
                  value={gender} 
                  onValueChange={setGender}
                  className="flex space-x-4"
                  required
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="male" id="male" />
                    <Label htmlFor="male">Male</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="female" id="female" />
                    <Label htmlFor="female">Female</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="other" id="other" />
                    <Label htmlFor="other">Other</Label>
                  </div>
                </RadioGroup>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="availability">Availability</Label>
                <Select 
                  value={availability} 
                  onValueChange={setAvailability}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select availability" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Today">Today</SelectItem>
                    <SelectItem value="Tomorrow">Tomorrow</SelectItem>
                    <SelectItem value="Next Week">Next Week</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="pt-4 flex justify-end space-x-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => navigate('/')}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={loading}
                className="bg-green-600 hover:bg-green-700"
              >
                {loading ? 'Adding...' : 'Add Doctor'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddDoctor;
