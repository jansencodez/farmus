import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // Added loading state

  // Function to sign in and store token
  const signIn = async (token) => {
    try {
      await AsyncStorage.setItem('token', token);
      setIsLoggedIn(true);
    } catch (error) {
      console.error('Error during sign in:', error);
    }
  };

  // Sign-out function
  const signOut = async () => {
    try {
      await AsyncStorage.removeItem('token');
      setIsLoggedIn(false);
    } catch (error) {
      console.error('Error during sign out:', error);
    }
  };

  // Check if the user is authenticated on app start
  const checkAuthStatus = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      setIsLoggedIn(!!token); // Update login state based on token existence
    } catch (error) {
      console.error('Error checking auth status:', error);
    } finally {
      setIsLoading(false); // Stop loading after checking
    }
  };

  useEffect(() => {
    checkAuthStatus(); // Run auth status check on component mount
  }, []);

  return (
    <AuthContext.Provider value={{ isLoggedIn, signIn, signOut, checkAuthStatus, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
