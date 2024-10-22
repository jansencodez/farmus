import React, { useState } from "react";
import { View, Text, TextInput, Pressable, StyleSheet } from "react-native";
import { useTheme } from "../context/ThemeProvider";
import { baseUrl } from "../baseUrl";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";

const PasswordResetRequestScreen = () => {
  const { colors } = useTheme();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleResetRequest = async () => {
    setIsSubmitting(true);
    try {
      const response = await fetch(`${baseUrl}api/auth/reset-password`, {
        // Adjust URL
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      setMessage(data.message || "Request failed.");
    } catch (error) {
      setMessage("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ThemedView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <ThemedText style={[styles.title, { color: colors.text }]}>
        Reset Password
      </ThemedText>
      <TextInput
        style={styles.input}
        placeholder="Enter your email"
        value={email}
        onChangeText={setEmail}
        placeholderTextColor={colors.secondary}
      />
      <Pressable
        style={[
          styles.button,
          isSubmitting ? styles.buttonDisabled : styles.buttonEnabled,
        ]}
        onPress={handleResetRequest}
        disabled={isSubmitting}
      >
        <ThemedText style={[styles.buttonText, { color: colors.text }]}>
          {isSubmitting ? "Sending..." : "Send Reset Link"}
        </ThemedText>
      </Pressable>
      {message && (
        <ThemedText style={[styles.message, { color: colors.text }]}>
          {message}
        </ThemedText>
      )}
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    height: 50,
    borderColor: "#888",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 20,
  },
  button: {
    height: 50,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonEnabled: {
    backgroundColor: "#388E3C",
  },
  buttonDisabled: {
    backgroundColor: "#A0A0A0",
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  message: {
    marginTop: 20,
    textAlign: "center",
    fontSize: 16,
  },
});

export default PasswordResetRequestScreen;
