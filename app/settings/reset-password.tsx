import React, { useState } from "react";
import { View, Text, TextInput, Pressable, StyleSheet } from "react-native";
import { useTheme } from "../context/ThemeProvider";
import { baseUrl } from "../baseUrl";

const PasswordResetRequestScreen = () => {
  const { theme } = useTheme();
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
    <View
      style={[
        styles.container,
        theme === "dark" ? styles.darkContainer : styles.lightContainer,
      ]}
    >
      <Text
        style={[
          styles.title,
          theme === "dark" ? styles.darkTitle : styles.lightTitle,
        ]}
      >
        Reset Password
      </Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your email"
        value={email}
        onChangeText={setEmail}
        placeholderTextColor={theme === "dark" ? "#A0A0A0" : "#888"}
      />
      <Pressable
        style={[
          styles.button,
          isSubmitting ? styles.buttonDisabled : styles.buttonEnabled,
        ]}
        onPress={handleResetRequest}
        disabled={isSubmitting}
      >
        <Text style={styles.buttonText}>
          {isSubmitting ? "Sending..." : "Send Reset Link"}
        </Text>
      </Pressable>
      {message && (
        <Text
          style={[
            styles.message,
            theme === "dark" ? styles.darkMessage : styles.lightMessage,
          ]}
        >
          {message}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
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
    textAlign: "center",
  },
  darkTitle: {
    color: "#E0E0E0",
  },
  lightTitle: {
    color: "#388E3C",
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
    color: "#FFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  message: {
    marginTop: 20,
    textAlign: "center",
    fontSize: 16,
  },
  darkMessage: {
    color: "#E0E0E0",
  },
  lightMessage: {
    color: "#388E3C",
  },
});

export default PasswordResetRequestScreen;
