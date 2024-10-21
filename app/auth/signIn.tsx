import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { baseUrl } from "../baseUrl";
import { fetchWithTokenRefresh } from "../utils/auth";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeProvider";
// Import the useTheme hook

export default function SignInScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { signIn } = useAuth();

  // Access theme colors
  const { colors } = useTheme();

  const handleSignIn = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please enter both email and password.");
      return;
    }
    setLoading(true);
    try {
      const response = await fetchWithTokenRefresh(`${baseUrl}/signin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const textResponse = await response.text();
      if (!response.ok) {
        throw new Error(textResponse);
      }

      // Parse the response
      const data = JSON.parse(textResponse);

      // Ensure both token and refreshToken are passed to signIn
      if (!data.token || !data.refreshToken) {
        throw new Error("Token or refresh token is missing from response.");
      }

      const expirationTime = Date.now() + 60 * 60 * 1000;

      // Pass both token and refreshToken to signIn function
      await signIn(data.token, data.refreshToken, expirationTime);

      // Navigate to profile page
      router.push("/profile");
    } catch (error) {
      Alert.alert("Error", error.message || "An unexpected error occurred.");
      console.error("SignIn Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>Sign In</Text>
      <TextInput
        style={[
          styles.input,
          { backgroundColor: "#FFFFFF", borderColor: colors.secondary },
        ]} // Use theme colors
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={[
          styles.input,
          { backgroundColor: "#FFFFFF", borderColor: colors.secondary },
        ]} // Use theme colors
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        autoCapitalize="none"
      />
      <Pressable
        style={[styles.button, { backgroundColor: colors.primary }]}
        onPress={handleSignIn}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <Text style={styles.buttonText}>Sign In</Text>
        )}
      </Pressable>

      <Pressable
        style={[styles.button, { backgroundColor: colors.primary }]}
        onPress={() => router.push("/auth/signup")}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <Text style={styles.buttonText}>Sign Up</Text>
        )}
      </Pressable>
    </View>
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
  input: {
    height: 40,
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 15,
  },
  button: {
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});
