import React, { useState } from "react";
import { Pressable, StyleSheet } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useTheme } from "./context/ThemeProvider"; // Import your theme hook
import { useAuth } from "./context/AuthContext";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
// Update the import path accordingly

export default function SettingsScreen() {
  const router = useRouter();
  const { signOut } = useAuth();
  const { colors } = useTheme(); // Use the theme hook

  const [expandedSections, setExpandedSections] = useState<{
    profile: boolean;
    security: boolean;
    preferences: boolean;
    about: boolean;
  }>({
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
        <ThemedText style={styles.title}>Settings</ThemedText>

        {/* Profile Section */}
        <Pressable
          style={styles.section}
          onPress={() => toggleSection("profile")}
        >
          <ThemedText style={styles.optionText}>Profile</ThemedText>
          <Ionicons
            name={
              expandedSections.profile
                ? "chevron-up-outline"
                : "chevron-down-outline"
            }
            size={24}
            color={colors.primary}
          />
        </Pressable>
        {expandedSections.profile && (
          <ThemedView style={styles.sectionContent}>
            <Pressable
              style={styles.option}
              onPress={() => router.push("/profile")}
            >
              <Ionicons
                name="person-outline"
                size={24}
                color={colors.primary}
              />
              <ThemedText style={styles.optionText}>Edit Profile</ThemedText>
            </Pressable>
          </ThemedView>
        )}

        {/* Security Section */}
        <Pressable
          style={styles.section}
          onPress={() => toggleSection("security")}
        >
          <ThemedText style={styles.optionText}>Security</ThemedText>
          <Ionicons
            name={
              expandedSections.security
                ? "chevron-up-outline"
                : "chevron-down-outline"
            }
            size={24}
            color={colors.primary}
          />
        </Pressable>
        {expandedSections.security && (
          <ThemedView style={styles.sectionContent}>
            <Pressable
              style={styles.option}
              onPress={() => router.push("/settings/reset-password")}
            >
              <Ionicons
                name="lock-closed-outline"
                size={24}
                color={colors.primary}
              />
              <ThemedText style={styles.optionText}>Change Password</ThemedText>
            </Pressable>
            <Pressable
              style={styles.option}
              onPress={() => router.push("/settings/privacy")}
            >
              <Ionicons
                name="shield-checkmark-outline"
                size={24}
                color={colors.primary}
              />
              <ThemedText style={styles.optionText}>
                Privacy Settings
              </ThemedText>
            </Pressable>
          </ThemedView>
        )}

        {/* Preferences Section */}
        <Pressable
          style={styles.section}
          onPress={() => toggleSection("preferences")}
        >
          <ThemedText style={styles.optionText}>Preferences</ThemedText>
          <Ionicons
            name={
              expandedSections.preferences
                ? "chevron-up-outline"
                : "chevron-down-outline"
            }
            size={24}
            color={colors.primary}
          />
        </Pressable>
        {expandedSections.preferences && (
          <ThemedView style={styles.sectionContent}>
            <Pressable
              style={styles.option}
              onPress={() => router.push("/settings/notifications")}
            >
              <Ionicons
                name="notifications-outline"
                size={24}
                color={colors.primary}
              />
              <ThemedText style={styles.optionText}>
                Notification Settings
              </ThemedText>
            </Pressable>
            <Pressable
              style={styles.option}
              onPress={() => router.push("/settings/language")}
            >
              <Ionicons name="globe-outline" size={24} color={colors.primary} />
              <ThemedText style={styles.optionText}>Language</ThemedText>
            </Pressable>
            <Pressable
              style={styles.option}
              onPress={() => router.push("/settings/theme")}
            >
              <Ionicons
                name="color-palette-outline"
                size={24}
                color={colors.primary}
              />
              <ThemedText style={styles.optionText}>Theme Settings</ThemedText>
            </Pressable>
          </ThemedView>
        )}

        {/* About Section */}
        <Pressable
          style={styles.section}
          onPress={() => toggleSection("about")}
        >
          <ThemedText style={styles.optionText}>About</ThemedText>
          <Ionicons
            name={
              expandedSections.about
                ? "chevron-up-outline"
                : "chevron-down-outline"
            }
            size={24}
            color={colors.primary}
          />
        </Pressable>
        {expandedSections.about && (
          <ThemedView style={styles.sectionContent}>
            <Pressable
              style={styles.option}
              onPress={() => router.push("/settings/about")}
            >
              <Ionicons
                name="information-circle-outline"
                size={24}
                color={colors.primary}
              />
              <ThemedText style={styles.optionText}>About Farmus</ThemedText>
            </Pressable>
            <Pressable
              style={styles.option}
              onPress={() => {
                handleSignOut();
                router.push("/");
              }}
            >
              <Ionicons
                name="log-out-outline"
                size={24}
                color={colors.primary}
              />
              <ThemedText style={styles.optionText}>Sign Out</ThemedText>
            </Pressable>
          </ThemedView>
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
  section: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
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
