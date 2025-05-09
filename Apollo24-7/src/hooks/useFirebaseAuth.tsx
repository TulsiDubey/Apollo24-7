
import { useState, useEffect } from 'react';
import { auth } from '../services/firebase';
import { User } from 'firebase/auth';

export function useFirebaseAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    try {
      const unsubscribe = auth.onAuthStateChanged((authUser) => {
        if (authUser) {
          console.log("Firebase auth state changed: User logged in", authUser.email);
          setUser(authUser);
        } else {
          console.log("Firebase auth state changed: No user logged in");
          setUser(null);
        }
        setError(null);
        setLoading(false);
      }, (authError) => {
        console.error("Firebase auth error:", authError);
        setError(authError.message);
        setLoading(false);
      });

    return () => unsubscribe();
    } catch (initError: any) {
      console.error("Firebase auth initialization error:", initError);
      setError(initError.message || "Authentication service failed to initialize");
      setLoading(false);
    }
  }, []);

  return {
    user,
    loading,
    error
  };
}
