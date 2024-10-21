import React, { createContext, useState, useEffect, useContext } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ThemeContext = createContext();

const lightPalette = {
  background: "#C8E6C9", // light green
  primary: "#388E3C", // dark green
  secondary: "#795548", // brown
  text: "#000000", // black text
  placeholder: "#795548", // brown placeholder
};

const darkPalette = {
  background: "#1E1E1E", // dark background
  primary: "#4CAF50", // lighter green for dark mode
  secondary: "#BDBDBD", // lighter grayish brown
  text: "#FFFFFF", // white text
  placeholder: "#BDBDBD", // lighter gray placeholder
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState("light"); // Default to light theme
  const [colors, setColors] = useState(lightPalette); // Use light palette by default

  const toggleTheme = async () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    setColors(newTheme === "light" ? lightPalette : darkPalette);
    await AsyncStorage.setItem("theme", newTheme);
  };

  useEffect(() => {
    const loadTheme = async () => {
      const storedTheme = await AsyncStorage.getItem("theme");
      if (storedTheme) {
        setTheme(storedTheme);
        setColors(storedTheme === "light" ? lightPalette : darkPalette);
      }
    };

    loadTheme();
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, colors, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
