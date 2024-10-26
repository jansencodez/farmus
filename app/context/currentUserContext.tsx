// context/CurrentUserContext.js
import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const CurrentUserContext = createContext();

export const useCurrentUser = () => {
  return useContext(CurrentUserContext);
};

export const CurrentUserProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);

  const fetchCurrentUser = async () => {
    try {
      const userData = await AsyncStorage.getItem("currentUser");
      if (userData) {
        setCurrentUser(JSON.parse(userData));
      }
    } catch (error) {
      console.error("Failed to fetch current user:", error);
    }
  };

  const updateCurrentUser = (user) => {
    setCurrentUser(user);
    AsyncStorage.setItem("currentUser", JSON.stringify(user));
  };

  const clearUserSession = async () => {
    setCurrentUser(null);
    await AsyncStorage.removeItem("currentUser");
  };

  const logout = async () => {
    setCurrentUser(null);
    await AsyncStorage.removeItem("currentUser");
  };

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  return (
    <CurrentUserContext.Provider
      value={{ currentUser, updateCurrentUser, logout }}
    >
      {children}
    </CurrentUserContext.Provider>
  );
};
