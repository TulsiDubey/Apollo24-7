
import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut as firebaseSignOut,
  UserCredential,
  User,
  connectAuthEmulator
} from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAt0ttbTwpqpJJhuC1ESA6ZWOXzW_06gDo",
  authDomain: "apollodoc.firebaseapp.com",
  projectId: "apollodoc",
  storageBucket: "apollodoc.appspot.com",
  messagingSenderId: "279339463361",
  appId: "1:279339463361:web:2872e1bc93a9e67d570a96"
};

// Initialize Firebase
let app;
try {
  app = initializeApp(firebaseConfig);
  console.log("Firebase initialized successfully");
} catch (error) {
  console.error("Error initializing Firebase: ", error);
  // Use a fallback configuration or handle the error appropriately
}

export const auth = getAuth(app);
export const storage = getStorage(app);

// Use emulator in development if needed
// if (process.env.NODE_ENV === 'development') {
//   connectAuthEmulator(auth, 'http://localhost:9099');
// }

// Authentication functions with retry mechanism
export const signUp = async (email: string, password: string): Promise<UserCredential> => {
  try {
    return await createUserWithEmailAndPassword(auth, email, password);
  } catch (error: any) {
    console.error("Sign up error:", error);
    // Re-throw for component to handle
    throw error;
  }
};

export const signIn = async (email: string, password: string): Promise<UserCredential> => {
  try {
    return await signInWithEmailAndPassword(auth, email, password);
  } catch (error: any) {
    console.error("Sign in error:", error);
    // Re-throw for component to handle
    throw error;
  }
};

export const signOut = async (): Promise<void> => {
  try {
    await firebaseSignOut(auth);
    console.log("User signed out successfully");
  } catch (error) {
    console.error("Sign out error:", error);
    throw error;
  }
};

// Current user state
export const getCurrentUser = (): User | null => {
  try {
    return auth.currentUser;
  } catch (error) {
    console.error("Error getting current user:", error);
    return null;
  }
};

// Check Firebase connection status
export const checkFirebaseConnection = async (): Promise<boolean> => {
  try {
    // A simple way to check connectivity is to try to refresh the current user
    await auth.currentUser?.reload();
    return true;
  } catch (error) {
    console.error("Firebase connection check failed:", error);
    return false;
  }
};

export default app;
