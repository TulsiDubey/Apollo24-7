
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "./firebase";

export interface Doctor {
  id: number | string;
  name: string;
  specialty: string;
  experience: string;
  education: string;
  languages: string[];
  gender: string;
  consultationFee: string;
  availability: string;
  rating: number;
  reviews: number;
  image: string;
}

// Get doctors from localStorage
export const getStoredDoctors = (): Doctor[] => {
  const storedDoctors = localStorage.getItem('doctors');
  return storedDoctors ? JSON.parse(storedDoctors) : [];
};

// Save doctor to localStorage
export const saveDoctor = (doctor: Doctor): void => {
  const doctors = getStoredDoctors();
  
  // Generate a new ID if not provided
  if (!doctor.id) {
    doctor.id = Date.now().toString();
  }
  
  doctors.push(doctor);
  localStorage.setItem('doctors', JSON.stringify(doctors));
};

// Upload doctor image to Firebase Storage
export const uploadDoctorImage = async (file: File): Promise<string> => {
  if (!file) return '';
  
  try {
    const storageRef = ref(storage, `doctor-images/${Date.now()}_${file.name}`);
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    return downloadURL;
  } catch (error) {
    console.error("Error uploading image: ", error);
    throw error;
  }
};
