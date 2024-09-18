import React from 'react';
import { View, Text, StyleSheet, Pressable, Switch } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeProvider';

export default function ThemeSettingsScreen() {
  const { theme, toggleTheme } = useTheme();
  const isDarkMode = theme === 'dark';

  const handleSwitchToggle = () => {
    toggleTheme();
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={[styles.container, isDarkMode ? styles.darkContainer : styles.lightContainer]}>
        <Text style={[styles.title, isDarkMode ? styles.darkTitle : styles.lightTitle]}>Theme Settings</Text>
        <View style={[styles.option, isDarkMode ? styles.darkOption : styles.lightOption]}>
          <Text style={[styles.optionText, isDarkMode ? styles.darkOptionText : styles.lightOptionText]}>Dark Mode</Text>
          <Switch
            trackColor={{ false: '#767577', true: '#388E3C' }}
            thumbColor={isDarkMode ? '#fff' : '#f4f3f4'}
            onValueChange={handleSwitchToggle}
            value={isDarkMode}
          />
        </View>
        <Pressable style={[styles.saveButton, isDarkMode ? styles.darkSaveButton : styles.lightSaveButton]} onPress={() => console.log('Save Settings')}>
          <Text style={[styles.saveButtonText, isDarkMode ? styles.darkSaveButtonText : styles.lightSaveButtonText]}>Save Changes</Text>
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
    backgroundColor: '#1E1E1E', // Dark background color
  },
  lightContainer: {
    backgroundColor: '#F5F5F5', // Light background color
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  darkTitle: {
    color: '#E0E0E0', // Light text color for dark theme
  },
  lightTitle: {
    color: '#388E3C', // Dark text color for light theme
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    borderBottomWidth: 1,
  },
  darkOption: {
    borderBottomColor: '#424242', // Darker border color for dark theme
  },
  lightOption: {
    borderBottomColor: '#E0E0E0', // Lighter border color for light theme
  },
  optionText: {
    fontSize: 18,
  },
  darkOptionText: {
    color: '#E0E0E0', // Light text color for dark theme
  },
  lightOptionText: {
    color: '#388E3C', // Dark text color for light theme
  },
  saveButton: {
    marginTop: 20,
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  darkSaveButton: {
    backgroundColor: '#388E3C', // Button color for dark theme
  },
  lightSaveButton: {
    backgroundColor: '#388E3C', // Button color for light theme
  },
  saveButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  darkSaveButtonText: {
    color: '#FFFFFF', // Text color for dark theme
  },
  lightSaveButtonText: {
    color: '#FFFFFF', // Text color for light theme
  },
});
