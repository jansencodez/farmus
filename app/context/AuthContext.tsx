import React, { createContext, useState, useContext, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { baseUrl } from "../baseUrl";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Function to sign in and store token
  const signIn = async (token, refreshToken, expirationTime) => {
    try {
      await AsyncStorage.setItem("token", token);
      await AsyncStorage.setItem("refreshToken", refreshToken);
      await AsyncStorage.setItem("tokenExpiration", expirationTime.toString()); // Store expiration time
      setIsLoggedIn(true);
    } catch (error) {
      console.error("Error during sign in:", error);
    }
  };

  // Sign-out function
  const signOut = async () => {
    try {
      await AsyncStorage.removeItem("token");
      await AsyncStorage.removeItem("refreshToken");
      await AsyncStorage.removeItem("tokenExpiration");
      setIsLoggedIn(false);
    } catch (error) {
      console.error("Error during sign out:", error);
    }
  };

  // Function to refresh the token if it's about to expire
  const refreshAuthToken = async () => {
    try {
      const refreshToken = await AsyncStorage.getItem("refreshToken");
      if (!refreshToken) {
        throw new Error("No refresh token found");
      }

      // Call the refresh token API
      const response = await fetch(`${baseUrl}/refresh-token`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken }),
      });

      if (response.ok) {
        const { newToken, newRefreshToken } = await response.json();

        // Update tokens and expiration time
        const newExpirationTime = Date.now() + 15 * 60 * 1000; // 15 minutes from now

        await AsyncStorage.setItem("token", newToken);
        await AsyncStorage.setItem("refreshToken", newRefreshToken);
        await AsyncStorage.setItem(
          "tokenExpiration",
          newExpirationTime.toString()
        );
        setIsLoggedIn(true);
      } else {
        throw new Error("Token refresh failed");
      }
    } catch (error) {
      console.error("Error refreshing token:", error);
      signOut(); // If token refresh fails, log the user out
    }
  };

  // Function to check if the token is still valid
  const checkAuthStatus = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const tokenExpiration = await AsyncStorage.getItem("tokenExpiration");

      if (!token || !tokenExpiration) {
        setIsLoggedIn(false);
      } else {
        const currentTime = Date.now();
        const expirationTime = parseInt(tokenExpiration, 10);

        if (currentTime >= expirationTime) {
          // Token has expired, attempt to refresh the token
          await refreshAuthToken();
        } else {
          // Token is still valid
          setIsLoggedIn(true);
        }
      }
    } catch (error) {
      console.error("Error checking auth status:", error);
    } finally {
      setIsLoading(false); // Stop loading after checking
    }
  };

  useEffect(() => {
    checkAuthStatus(); // Run auth status check on component mount
  }, []);

  return (
    <AuthContext.Provider
      value={{ isLoggedIn, signIn, signOut, checkAuthStatus, isLoading }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
