import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter, useSegments } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import { supabase } from '@/lib/supabase';
import { Session } from '@supabase/supabase-js';
import { Platform } from 'react-native';

interface User {
  id: string;
  email: string | null;
  phone: string | null;
  name: string;
  title: string;
  company: string;
  batch: string;
  industry: string;
  photo: string;
  looking_for: string | null;
  offering: string | null;
  points: number;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  login: (phone: string) => Promise<void>;
  verifyOTP: (phone: string, otp: string) => Promise<void>;
  signInWithLinkedIn: () => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function useProtectedRoute(user: User | null) {
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    const inAuthGroup = segments[0] === 'auth';
    
    if (!user && !inAuthGroup) {
      router.replace('/auth');
    } else if (user) {
      if (!user.name) {
        if (!inAuthGroup || segments[1] !== 'complete-profile') {
          router.replace('/auth/complete-profile');
        }
      } else if (inAuthGroup) {
        router.replace('/(tabs)');
      }
    }
  }, [user, segments]);
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const fetchUser = async (userId: string) => {
    try {
      // First check if user exists
      const { data: existingUser, error: fetchError } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (fetchError && fetchError.code !== 'PGRST116') {
        throw fetchError;
      }

      if (existingUser) {
        setUser(existingUser);
        return;
      }

      // User doesn't exist, create new user with retry logic
      let retries = 3;
      while (retries > 0) {
        try {
          const { data: newUser, error: createError } = await supabase
            .from('users')
            .insert([{ 
              id: userId,
              name: '',
              title: '',
              company: '',
              batch: '',
              industry: '',
              photo: '',
              points: 0
            }])
            .select()
            .single();

          if (!createError && newUser) {
            setUser(newUser);
            return;
          }

          // If error is not a duplicate key error, throw it
          if (createError && createError.code !== '23505') {
            throw createError;
          }

          // If it was a duplicate key error, try fetching again
          const { data: retryUser, error: retryError } = await supabase
            .from('users')
            .select('*')
            .eq('id', userId)
            .single();

          if (!retryError && retryUser) {
            setUser(retryUser);
            return;
          }

          retries--;
          if (retries === 0) {
            throw new Error('Max retries reached while creating user');
          }

          // Wait before retrying
          await new Promise(resolve => setTimeout(resolve, 1000));
        } catch (error) {
          if (retries === 1) throw error;
          retries--;
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }
    } catch (error) {
      console.error('Error in fetchUser:', error);
      setUser(null);
      router.replace('/auth');
    } finally {
      setIsLoading(false);
    }
  };

  const refreshUser = async () => {
    if (session?.user) {
      await fetchUser(session.user.id);
    }
  };
  
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user) {
        fetchUser(session.user.id);
      } else {
        setIsLoading(false);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      if (session?.user) {
        await fetchUser(session.user.id);
      } else {
        setUser(null);
        setIsLoading(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const validatePhoneNumber = (phone: string): string => {
    const cleaned = phone.replace(/\D/g, '');
    
    if (cleaned.length !== 10) {
      throw new Error('Please enter a valid 10-digit mobile number');
    }
    
    const firstDigit = parseInt(cleaned[0]);
    if (firstDigit < 6 || firstDigit > 9) {
      throw new Error('Mobile number must start with 6, 7, 8, or 9');
    }
    
    return `+91${cleaned}`;
  };

  const login = async (phone: string) => {
    try {
      const validatedPhone = validatePhoneNumber(phone);
      
      const { error } = await supabase.auth.signInWithOtp({
        phone: validatedPhone
      });

      if (error) throw error;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Failed to send OTP');
    }
  };

  const verifyOTP = async (phone: string, otp: string) => {
    try {
      const validatedPhone = validatePhoneNumber(phone);
      
      const { data, error } = await supabase.auth.verifyOtp({
        phone: validatedPhone,
        token: otp,
        type: 'sms'
      });

      if (error) throw error;

      if (data.session) {
        setSession(data.session);
        if (data.session.user) {
          await fetchUser(data.session.user.id);
        }
      }
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Failed to verify OTP');
    }
  };

  const getRedirectUrl = () => {
    if (Platform.OS === 'web') {
      return window.location.origin + '/auth/callback';
    }
    return 'your-app-scheme://auth/callback';
  };

  const signInWithLinkedIn = async () => {
    try {
      const redirectUrl = getRedirectUrl();
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'linkedin',
        options: {
          redirectTo: redirectUrl,
          skipBrowserRedirect: Platform.OS !== 'web',
          scopes: 'r_liteprofile r_emailaddress',
        },
      });

      if (error) throw error;

      if (data.url && Platform.OS !== 'web') {
        const result = await WebBrowser.openAuthSessionAsync(
          data.url,
          redirectUrl
        );

        if (result.type === 'success') {
          const { url } = result;
          const params = new URLSearchParams(url.split('#')[1]);
          const accessToken = params.get('access_token');
          
          if (accessToken) {
            // Handle successful LinkedIn auth
            // Navigation will be handled by useProtectedRoute
          }
        }
      }
    } catch (error) {
      console.error('LinkedIn sign in error:', error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Failed to sign in with LinkedIn');
    }
  };

  const handleSignOut = async () => {
    try {
      setUser(null);
      setSession(null);
      
      const { data: { session: currentSession } } = await supabase.auth.getSession();
      if (currentSession) {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
      }
      
      router.replace('/auth');
    } catch (error) {
      console.error('Error in handleSignOut:', error);
      setUser(null);
      setSession(null);
      router.replace('/auth');
    }
  };

  const logout = async () => {
    await handleSignOut();
  };

  useProtectedRoute(user);

  return (
    <AuthContext.Provider value={{ 
      user, 
      session, 
      login, 
      verifyOTP, 
      signInWithLinkedIn, 
      logout, 
      isLoading,
      refreshUser 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export { AuthProvider };
export { useAuth };