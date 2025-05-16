import { useState, useEffect } from 'react';
import { checkAuthState, setupAuthListener, handleSignOut } from '../services/auth/authService';

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      const authState = await checkAuthState();
      setIsAuthenticated(authState);
      setIsLoading(false);
    };

    initializeAuth();
    const listener = setupAuthListener(setIsAuthenticated);

    return () => listener();
  }, []);

  const signOut = async () => {
    try {
      await handleSignOut();
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Error in signOut:', error);
    }
  };

  return {
    isAuthenticated,
    isLoading,
    signOut,
  };
};
