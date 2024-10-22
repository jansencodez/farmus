import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  StyleProp,
  ViewStyle,
  TextStyle,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useTheme } from "./context/ThemeProvider"; // Import your theme hook
import { useAuth } from "./context/AuthContext";

type Theme = "light" | "dark";

interface SettingsScreenProps {
  theme: Theme;
}

export default function SettingsScreen() {
  const router = useRouter();
  const { isLoggedIn, signOut, checkAuthStatus } = useAuth();
  const { colors } = useTheme(); // Use the theme hook

  const [expandedSections, setExpandedSections] = useState<
    Record<string, boolean>
  >({
    profile: false,
    security: false,
    preferences: false,
    about: false,
  });

  const handleSignOut = async () => {
    try {
      await signOut(); // Call signOut function to handle sign-out logic
      router.push("/auth/signIn"); // Redirect to sign-in page after signing out
    } catch (error) {
      console.error("Sign Out Error:", error);
    }
  };

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView
        style={[styles.container, { backgroundColor: colors.background }]}
      >
        <Text style={[styles.title, { color: colors.primary }]}>Settings</Text>

        {/* Profile Section */}
        <Pressable
          style={styles.section}
          onPress={() => toggleSection("profile")}
        >
          <Text style={[styles.optionText, { color: colors.primary }]}>
            Profile
          </Text>
          <Ionicons
            name={
              expandedSections.profile
                ? "chevron-up-outline"
                : "chevron-down-outline"
            }
            size={24}
          />
        </Pressable>
        {expandedSections.profile && (
          <View style={styles.sectionContent}>
            <Pressable
              style={getOptionStyle(theme === "dark")}
              onPress={() => router.push("/profile")}
            >
              <Ionicons
                name="person-outline"
                size={24}
                color={theme === "dark" ? "#E0E0E0" : "#388E3C"}
              />
              <Text style={getOptionTextStyle(theme === "dark")}>
                Edit Profile
              </Text>
            </Pressable>
          </View>
        )}

        {/* Security Section */}
        <Pressable
          style={getSectionHeaderStyle()}
          onPress={() => toggleSection("security")}
        >
          <Text style={getTextStyle(theme === "dark")}>Security</Text>
          <Ionicons
            name={
              expandedSections.security
                ? "chevron-up-outline"
                : "chevron-down-outline"
            }
            size={24}
            color={theme === "dark" ? "#E0E0E0" : "#388E3C"}
          />
        </Pressable>
        {expandedSections.security && (
          <View style={styles.sectionContent}>
            <Pressable
              style={getOptionStyle(theme === "dark")}
              onPress={() => router.push("/settings/reset-password")}
            >
              <Ionicons
                name="lock-closed-outline"
                size={24}
                color={theme === "dark" ? "#E0E0E0" : "#388E3C"}
              />
              <Text style={getOptionTextStyle(theme === "dark")}>
                Change Password
              </Text>
            </Pressable>
            <Pressable
              style={getOptionStyle(theme === "dark")}
              onPress={() => router.push("/settings/privacy")}
            >
              <Ionicons
                name="shield-checkmark-outline"
                size={24}
                color={theme === "dark" ? "#E0E0E0" : "#388E3C"}
              />
              <Text style={getOptionTextStyle(theme === "dark")}>
                Privacy Settings
              </Text>
            </Pressable>
          </View>
        )}

        {/* Preferences Section */}
        <Pressable
          style={getSectionHeaderStyle()}
          onPress={() => toggleSection("preferences")}
        >
          <Text style={getTextStyle(theme === "dark")}>Preferences</Text>
          <Ionicons
            name={
              expandedSections.preferences
                ? "chevron-up-outline"
                : "chevron-down-outline"
            }
            size={24}
            color={theme === "dark" ? "#E0E0E0" : "#388E3C"}
          />
        </Pressable>
        {expandedSections.preferences && (
          <View style={styles.sectionContent}>
            <Pressable
              style={getOptionStyle(theme === "dark")}
              onPress={() => router.push("/settings/notifications")}
            >
              <Ionicons
                name="notifications-outline"
                size={24}
                color={theme === "dark" ? "#E0E0E0" : "#388E3C"}
              />
              <Text style={getOptionTextStyle(theme === "dark")}>
                Notification Settings
              </Text>
            </Pressable>
            <Pressable
              style={getOptionStyle(theme === "dark")}
              onPress={() => router.push("/settings/language")}
            >
              <Ionicons
                name="globe-outline"
                size={24}
                color={theme === "dark" ? "#E0E0E0" : "#388E3C"}
              />
              <Text style={getOptionTextStyle(theme === "dark")}>Language</Text>
            </Pressable>
            <Pressable
              style={getOptionStyle(theme === "dark")}
              onPress={() => router.push("/settings/theme")}
            >
              <Ionicons
                name="color-palette-outline"
                size={24}
                color={theme === "dark" ? "#E0E0E0" : "#388E3C"}
              />
              <Text style={getOptionTextStyle(theme === "dark")}>
                Theme Settings
              </Text>
            </Pressable>
          </View>
        )}

        {/* About Section */}
        <Pressable
          style={getSectionHeaderStyle()}
          onPress={() => toggleSection("about")}
        >
          <Text style={getTextStyle(theme === "dark")}>About</Text>
          <Ionicons
            name={
              expandedSections.about
                ? "chevron-up-outline"
                : "chevron-down-outline"
            }
            size={24}
            color={theme === "dark" ? "#E0E0E0" : "#388E3C"}
          />
        </Pressable>
        {expandedSections.about && (
          <View style={styles.sectionContent}>
            <Pressable
              style={getOptionStyle(theme === "dark")}
              onPress={() => router.push("/settings/about")}
            >
              <Ionicons
                name="information-circle-outline"
                size={24}
                color={theme === "dark" ? "#E0E0E0" : "#388E3C"}
              />
              <Text style={getOptionTextStyle(theme === "dark")}>
                About Farmus
              </Text>
            </Pressable>
            <Pressable
              style={getOptionStyle(theme === "dark")}
              onPress={() => {
                handleSignOut();
                router.push("/");
              }}
            >
              <Ionicons
                name="log-out-outline"
                size={24}
                color={theme === "dark" ? "#E0E0E0" : "#388E3C"}
              />
              <Text style={getOptionTextStyle(theme === "dark")}>Sign Out</Text>
            </Pressable>
          </View>
        )}
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
  },
  sectionHeaderText: {
    fontSize: 18,
  },
  sectionContent: {
    marginBottom: 15,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
  },
  optionText: {
    fontSize: 18,
    marginLeft: 15,
  },
});
