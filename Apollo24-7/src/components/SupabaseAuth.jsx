
import React, { useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

// Initialize Supabase client - replace with your project URL and anon key
// These would typically come from environment variables
const supabaseUrl = 'https://your-project-url.supabase.co';
const supabaseAnonKey = 'your-anon-key';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const SupabaseAuth = ({ onAuthSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isLogin, setIsLogin] = useState(true); // Toggle between login and signup
  const { toast } = useToast();

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      let result;
      if (isLogin) {
        // Sign in with email and password
        result = await supabase.auth.signInWithPassword({
          email,
          password,
        });
      } else {
        // Sign up with email and password
        result = await supabase.auth.signUp({
          email,
          password,
        });
      }

      if (result.error) {
        throw new Error(result.error.message);
      }

      toast({
        title: isLogin ? "Login Successful" : "Account Created",
        description: isLogin ? "Welcome back!" : "Please check your email for verification.",
        duration: 3000,
      });
      
      if (isLogin && result.data?.user) {
        // Notify parent component of successful login
        if (onAuthSuccess) onAuthSuccess(result.data.user);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
        duration: 3000,
      });
    } finally {
      setLoading(false);
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
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            required
            className="w-full"
          />
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
      <div className="mt-4 text-center">
        <button 
          onClick={() => setIsLogin(!isLogin)} 
          className="text-blue-600 hover:underline text-sm"
        >
          {isLogin ? "Need an account? Sign up" : "Already have an account? Login"}
        </button>
      </div>
    </div>
  );
};

export default SupabaseAuth;
