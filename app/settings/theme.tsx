import React from "react";
import { View, Text, StyleSheet, Pressable, Switch } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../context/ThemeProvider";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";

export default function ThemeSettingsScreen() {
  const { theme, toggleTheme, colors } = useTheme();
  const isDarkMode = theme === "dark";

  const handleSwitchToggle = () => {
    toggleTheme();
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView
        style={[styles.container, { backgroundColor: colors.background }]}
      >
        <ThemedText style={[styles.title, { color: colors.primary }]}>
          Theme Settings
        </ThemedText>
        <ThemedView
          style={[
            styles.option,
            isDarkMode ? styles.darkOption : styles.lightOption,
          ]}
        >
          <ThemedText style={[styles.optionText, { color: colors.text }]}>
            Dark Mode
          </ThemedText>
          <Switch
            trackColor={colors.text}
            thumbColor={colors.secondary}
            onValueChange={handleSwitchToggle}
            value={isDarkMode}
          />
        </ThemedView>
        <Pressable
          style={[styles.saveButton, { backgroundColor: colors.primary }]}
          onPress={() => console.log("Save Settings")}
        >
          <ThemedText style={[styles.saveButtonText, { color: colors.text }]}>
            Save Changes
          </ThemedText>
        </Pressable>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  darkContainer: {
    backgroundColor: "#1E1E1E", // Dark background color
  },
  lightContainer: {
    backgroundColor: "#F5F5F5", // Light background color
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  darkTitle: {
    color: "#E0E0E0", // Light text color for dark theme
  },
  lightTitle: {
    color: "#388E3C", // Dark text color for light theme
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 15,
    borderBottomWidth: 1,
  },
  darkOption: {
    borderBottomColor: "#424242", // Darker border color for dark theme
  },
  lightOption: {
    borderBottomColor: "#E0E0E0", // Lighter border color for light theme
  },
  optionText: {
    fontSize: 18,
  },
  darkOptionText: {
    color: "#E0E0E0", // Light text color for dark theme
  },
  lightOptionText: {
    color: "#388E3C", // Dark text color for light theme
  },
  saveButton: {
    marginTop: 20,
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
  },
  darkSaveButton: {
    backgroundColor: "#388E3C", // Button color for dark theme
  },
  lightSaveButton: {
    backgroundColor: "#388E3C", // Button color for light theme
  },
  saveButtonText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  darkSaveButtonText: {
    color: "#FFFFFF", // Text color for dark theme
  },
  lightSaveButtonText: {
    color: "#FFFFFF", // Text color for light theme
  },
});
