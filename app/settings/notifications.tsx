import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Switch,
  Pressable,
  StyleProp,
  ViewStyle,
  TextStyle,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../context/ThemeProvider";

const NotificationSettingsScreen: React.FC = () => {
  const { theme } = useTheme(); // Use the theme hook
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);

  // Apply appropriate styles based on theme
  const getContainerStyle = (): StyleProp<ViewStyle> => [
    styles.container,
    theme === "dark" ? styles.darkContainer : styles.lightContainer,
  ];

  const getTextStyle = (isDark: boolean): StyleProp<TextStyle> => [
    styles.text,
    isDark ? styles.darkText : styles.lightText,
  ];

  // Save settings function (implement actual save logic)
  const handleSaveSettings = () => {
    // Implement save logic here (e.g., API call to update settings)
    console.log("Settings saved:", {
      notificationsEnabled,
      emailNotifications,
      pushNotifications,
    });
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={getContainerStyle()}>
        <Text
          style={[
            styles.title,
            theme === "dark" ? styles.darkTitle : styles.lightTitle,
          ]}
        >
          Notification Settings
        </Text>

        <View style={styles.section}>
          <Text style={getTextStyle(theme === "dark")}>
            Enable Notifications
          </Text>
          <Switch
            value={notificationsEnabled}
            onValueChange={(value) => setNotificationsEnabled(value)}
            thumbColor={notificationsEnabled ? "#388E3C" : "#E0E0E0"}
            trackColor={{ false: "#E0E0E0", true: "#388E3C" }}
          />
        </View>

        {notificationsEnabled && (
          <>
            <View style={styles.section}>
              <Text style={getTextStyle(theme === "dark")}>
                Email Notifications
              </Text>
              <Switch
                value={emailNotifications}
                onValueChange={(value) => setEmailNotifications(value)}
                thumbColor={emailNotifications ? "#388E3C" : "#E0E0E0"}
                trackColor={{ false: "#E0E0E0", true: "#388E3C" }}
              />
            </View>

            <View style={styles.section}>
              <Text style={getTextStyle(theme === "dark")}>
                Push Notifications
              </Text>
              <Switch
                value={pushNotifications}
                onValueChange={(value) => setPushNotifications(value)}
                thumbColor={pushNotifications ? "#388E3C" : "#E0E0E0"}
                trackColor={{ false: "#E0E0E0", true: "#388E3C" }}
              />
            </View>
          </>
        )}

        <Pressable
          style={[
            styles.button,
            theme === "dark" ? styles.darkButton : styles.lightButton,
          ]}
          onPress={handleSaveSettings}
        >
          <Text style={styles.buttonText}>Save Settings</Text>
        </Pressable>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  darkContainer: {
    backgroundColor: "#1E1E1E",
  },
  lightContainer: {
    backgroundColor: "#F5F5F5",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  darkTitle: {
    color: "#E0E0E0",
  },
  lightTitle: {
    color: "#388E3C",
  },
  text: {
    fontSize: 18,
    marginVertical: 10,
  },
  darkText: {
    color: "#E0E0E0",
  },
  lightText: {
    color: "#388E3C",
  },
  section: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
  },
  button: {
    marginTop: 20,
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
  },
  darkButton: {
    backgroundColor: "#388E3C",
  },
  lightButton: {
    backgroundColor: "#E0E0E0",
  },
  buttonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default NotificationSettingsScreen;
