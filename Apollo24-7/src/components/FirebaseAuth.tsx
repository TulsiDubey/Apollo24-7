
import React, { useState } from 'react';
import { signIn, signUp, getCurrentUser } from '../services/firebase';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Eye, EyeOff } from 'lucide-react';

interface FirebaseAuthProps {
  onAuthSuccess: (user: any) => void;
}

const FirebaseAuth = ({ onAuthSuccess }: FirebaseAuthProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isLogin, setIsLogin] = useState(true); // Toggle between login and signup
  const [showPassword, setShowPassword] = useState(false);
  const { toast } = useToast();

  // Maximum retry attempts
  const MAX_RETRIES = 2;
  const [retryCount, setRetryCount] = useState(0);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Validate input first
      if (!email || !email.includes('@')) {
        throw new Error('Please enter a valid email address');
      }
      
      if (password.length < 6) {
        throw new Error('Password must be at least 6 characters long');
      }
      
      console.log(`Attempting to ${isLogin ? 'login' : 'signup'} with email: ${email}`);
      
      let result;
      if (isLogin) {
        // Sign in with email and password
        result = await signIn(email, password);
      } else {
        // Sign up with email and password
        result = await signUp(email, password);
      }

      console.log("Authentication successful:", result);
      
      toast({
        title: isLogin ? "Login Successful" : "Account Created",
        description: isLogin ? "Welcome back!" : "Please check your email for verification.",
        duration: 3000,
      });
      
      if (result.user) {
        // Reset retry count on success
        setRetryCount(0);
        // Notify parent component of successful login
        onAuthSuccess(result.user);
      }
    } catch (error: any) {
      console.error("Firebase auth error:", error);
      
      // Check if we should retry
      if (retryCount < MAX_RETRIES && error.code && 
         (error.code.includes('network') || error.code.includes('timeout'))) {
        setRetryCount(prevCount => prevCount + 1);
        toast({
          title: "Connection Issue",
          description: `Retrying... (${retryCount + 1}/${MAX_RETRIES})`,
          duration: 3000,
        });
        
        // Wait a moment and retry
        setTimeout(() => handleAuth(e), 1000);
        return;
      }
      
      // Provide user-friendly error messages
      let errorMessage = "Authentication failed. Please try again.";
      
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
        errorMessage = "Invalid email or password. Please try again.";
      } else if (error.code === 'auth/email-already-in-use') {
        errorMessage = "This email is already registered. Please login instead.";
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = "Please enter a valid email address.";
      } else if (error.code === 'auth/weak-password') {
        errorMessage = "Password should be at least 6 characters.";
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
        duration: 5000,
      });
      
      // Reset retry count
      setRetryCount(0);
    } finally {
      setLoading(false);
    }
  };
  
  // Fallback function if Firebase auth fails completely
  const handleAuthFallback = () => {
    console.log("Using fallback authentication method");
    
    // Check if user exists in localStorage (demo purposes only)
    const storedUsers = JSON.parse(localStorage.getItem('demo_users') || '[]');
    
    if (isLogin) {
      const user = storedUsers.find((u: any) => u.email === email && u.password === password);
      
      if (user) {
        toast({
          title: "Fallback Login Successful",
          description: "Using local authentication as fallback.",
          duration: 3000,
        });
        
        // Create a mock user object similar to Firebase
        const mockUser = {
          uid: user.id || 'local-user',
          email: user.email,
          displayName: user.name || email.split('@')[0],
          emailVerified: true,
          // Add other properties needed by your app
        };
        
        onAuthSuccess(mockUser);
        return;
      }
      
      toast({
        title: "Fallback Login Failed",
        description: "Invalid email or password",
        variant: "destructive",
        duration: 3000,
      });
    } else {
      // Simple signup - store in localStorage (demo only)
      const newUser = {
        id: `local-${Date.now()}`,
        email,
        password,
        name: email.split('@')[0],
        createdAt: new Date().toISOString()
      };
      
      storedUsers.push(newUser);
      localStorage.setItem('demo_users', JSON.stringify(storedUsers));
      
      toast({
        title: "Fallback Signup Successful",
        description: "Account created using local storage fallback.",
        duration: 3000,
      });
      
      const mockUser = {
        uid: newUser.id,
        email: newUser.email,
        displayName: newUser.name,
        emailVerified: true,
      };
      
      onAuthSuccess(mockUser);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md mx-auto">
      <h2 className="text-2xl font-bold text-center mb-6 text-blue-600">
        {isLogin ? "Login to Apollo 24*7" : "Create an Account"}
      </h2>
      <form onSubmit={handleAuth} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
            className="w-full"
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              className="w-full pr-10"
            />
            <button 
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>
        <Button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700">
          {loading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </span>
          ) : isLogin ? (
            "Login"
          ) : (
            "Sign Up"
          )}
        </Button>
      </form>
      
      {getCurrentUser() === null && (
        <div className="mt-4">
          <Button 
            type="button" 
            variant="outline" 
            className="w-full" 
            onClick={handleAuthFallback}
            disabled={loading}
          >
            {isLogin ? "Try Alternative Login" : "Try Alternative Signup"}
          </Button>
        </div>
      )}
      
      <div className="mt-4 text-center">
        <button 
          type="button"
          onClick={() => setIsLogin(!isLogin)} 
          className="text-blue-600 hover:underline text-sm"
        >
          {isLogin ? "Need an account? Sign up" : "Already have an account? Login"}
        </button>
      </div>
    </div>
  );
};

export default FirebaseAuth;
