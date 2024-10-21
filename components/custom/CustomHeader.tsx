import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  TouchableOpacity,
  Alert,
  TouchableWithoutFeedback,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "@/app/context/AuthContext";
import { useTheme } from "@/app/context/ThemeProvider";
import { ThemedText } from "../ThemedText";
import { ThemedView } from "../ThemedView";

export default function CustomHeader() {
  const [menuVisible, setMenuVisible] = useState(false);
  const router = useRouter();
  const { isLoggedIn, signOut, checkAuthStatus } = useAuth();
  const { theme, colors } = useTheme(); // Use colors from the theme

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const toggleMenu = () => setMenuVisible(!menuVisible);

  const handleSignOut = async () => {
    Alert.alert("Confirm Sign Out", "Are you sure you want to sign out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Sign Out",
        onPress: async () => {
          try {
            await signOut();
            setMenuVisible(false);
            router.push("/auth/signIn");
          } catch (error) {
            console.error("Sign Out Error:", error);
          }
        },
      },
    ]);
  };

  const closeMenu = () => {
    if (menuVisible) {
      setMenuVisible(false);
    }
  };

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: colors.background }]}
    >
      <TouchableWithoutFeedback onPress={closeMenu}>
        <ThemedView
          style={[styles.header, { backgroundColor: colors.background }]}
        >
          <ThemedText style={[styles.title, { color: colors.text }]}>
            Farmus
          </ThemedText>

          <View style={styles.rightSection}>
            <TouchableOpacity
              onPress={() => {
                router.push("/cart");
              }}
              style={styles.cart}
              accessibilityLabel="View Cart"
            >
              <Ionicons name="cart-outline" size={30} color={colors.text} />
              <Pressable
                style={styles.itemsNumber}
                accessible={true}
                accessibilityLabel="10 items in cart"
              >
                <ThemedText style={{ fontSize: 12, color: "white" }}>
                  10
                </ThemedText>
              </Pressable>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={toggleMenu}
              style={styles.profileButton}
              accessibilityLabel="Open menu"
            >
              <Ionicons name="menu-outline" size={30} color={colors.text} />
            </TouchableOpacity>

            {menuVisible && (
              <ThemedView
                style={[
                  styles.dropdownMenu,
                  { backgroundColor: colors.background },
                ]}
              >
                <Pressable
                  style={styles.menuItem}
                  onPress={() => {
                    setMenuVisible(false);
                    router.push("/");
                  }}
                  accessibilityLabel="Go to Home"
                >
                  <Ionicons
                    name="home-outline"
                    size={20}
                    color={colors.text}
                    style={styles.menuIcon}
                  />
                  <ThemedText style={[styles.menuText, { color: colors.text }]}>
                    Home
                  </ThemedText>
                </Pressable>

                {isLoggedIn ? (
                  <>
                    <Pressable
                      style={styles.menuItem}
                      onPress={() => {
                        setMenuVisible(false);
                        router.push("/profile");
                      }}
                      accessibilityLabel="Go to My Profile"
                    >
                      <Ionicons
                        name="person-outline"
                        size={20}
                        color={colors.text}
                        style={styles.menuIcon}
                      />
                      <ThemedText
                        style={[styles.menuText, { color: colors.text }]}
                      >
                        My Profile
                      </ThemedText>
                    </Pressable>
                    <Pressable
                      style={styles.menuItem}
                      onPress={() => {
                        setMenuVisible(false);
                        router.push("/settings");
                      }}
                      accessibilityLabel="Go to Settings"
                    >
                      <Ionicons
                        name="settings-outline"
                        size={20}
                        color={colors.text}
                        style={styles.menuIcon}
                      />
                      <ThemedText
                        style={[styles.menuText, { color: colors.text }]}
                      >
                        Settings
                      </ThemedText>
                    </Pressable>
                    <Pressable
                      style={styles.menuItem}
                      onPress={() => {
                        setMenuVisible(false);
                        router.push("/wallet");
                      }}
                      accessibilityLabel="Go to Wallet"
                    >
                      <Ionicons
                        name="wallet-outline"
                        size={20}
                        color={colors.text}
                        style={styles.menuIcon}
                      />
                      <ThemedText
                        style={[styles.menuText, { color: colors.text }]}
                      >
                        Wallet
                      </ThemedText>
                    </Pressable>
                    <Pressable
                      style={styles.menuItem}
                      onPress={handleSignOut}
                      accessibilityLabel="Sign Out"
                    >
                      <Ionicons
                        name="log-out-outline"
                        size={20}
                        color={colors.text}
                        style={styles.menuIcon}
                      />
                      <ThemedText
                        style={[styles.menuText, { color: colors.text }]}
                      >
                        Sign Out
                      </ThemedText>
                    </Pressable>
                  </>
                ) : (
                  <>
                    <Pressable
                      style={styles.menuItem}
                      onPress={() => {
                        setMenuVisible(false);
                        router.push("/auth/signIn");
                      }}
                      accessibilityLabel="Sign In"
                    >
                      <Ionicons
                        name="log-in-outline"
                        size={20}
                        color={colors.text}
                        style={styles.menuIcon}
                      />
                      <ThemedText
                        style={[styles.menuText, { color: colors.text }]}
                      >
                        Sign In
                      </ThemedText>
                    </Pressable>
                    <Pressable
                      style={styles.menuItem}
                      onPress={() => {
                        setMenuVisible(false);
                        router.push("/auth/signup");
                      }}
                      accessibilityLabel="Sign Up"
                    >
                      <Ionicons
                        name="person-add-outline"
                        color={colors.text}
                        size={20}
                        style={styles.menuIcon}
                      />
                      <ThemedText
                        style={[styles.menuText, { color: colors.text }]}
                      >
                        Sign Up
                      </ThemedText>
                    </Pressable>
                  </>
                )}
              </ThemedView>
            )}
          </View>
        </ThemedView>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {},
  header: {
    height: 60,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 15,
    borderBottomWidth: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  rightSection: {
    flexDirection: "row",
    alignItems: "center",
  },
  profileButton: {
    padding: 5,
  },
  cart: {
    padding: 5,
    position: "relative",
  },
  itemsNumber: {
    position: "absolute",
    right: 0,
    top: 0,
    backgroundColor: "red",
    borderRadius: 10,
    paddingHorizontal: 5,
  },
  dropdownMenu: {
    position: "absolute",
    right: 15,
    top: 60,
    backgroundColor: "#FFF",
    borderRadius: 8,
    elevation: 5,
    zIndex: 10,
  },
  menuItem: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    flexDirection: "row",
    alignItems: "center",
  },
  menuIcon: {
    marginRight: 10,
  },
  menuText: {
    fontSize: 16,
  },
});
