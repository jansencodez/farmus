import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  Alert,
  Image,
} from "react-native";
import { useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { fetchWithTokenRefresh } from "../utils/auth";
import { baseUrl } from "../baseUrl";
import { useTheme } from "../context/ThemeProvider"; // Update this to your actual path

export default function SignUpScreen() {
  const { colors } = useTheme(); // Get colors from theme context
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [profilePicture, setProfilePicture] = useState(null);
  const router = useRouter();

  useEffect(() => {
    (async () => {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission required",
          "Permission to access media is needed to upload a profile picture."
        );
      }
    })();
  }, []);

  const handleImagePicker = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setProfilePicture(result.assets[0].uri);
    }
  };

  const handleSignUp = async () => {
    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("password", password);

    if (profilePicture) {
      const filename = profilePicture.split("/").pop();
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : `image`;

      formData.append("profilePicture", {
        uri: profilePicture,
        name: filename,
        type: type,
      });
    }

    try {
      const response = await fetchWithTokenRefresh(`${baseUrl}/signup`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        await AsyncStorage.setItem("token", data.token);
        router.push("/");
      } else {
        console.error("Error Response:", data);
        Alert.alert("Error", data.message || "An unexpected error occurred");
      }
    } catch (error) {
      console.error("Fetch Error:", error);
      Alert.alert("Error", "An unexpected error occurred.");
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.primary }]}>Sign Up</Text>
      <TextInput
        style={[
          styles.input,
          { borderColor: colors.secondary, backgroundColor: colors.background },
        ]}
        placeholder="Name"
        placeholderTextColor={colors.placeholder}
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={[
          styles.input,
          { borderColor: colors.secondary, backgroundColor: colors.background },
        ]}
        placeholder="Email"
        placeholderTextColor={colors.placeholder}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      <TextInput
        style={[
          styles.input,
          { borderColor: colors.secondary, backgroundColor: colors.background },
        ]}
        placeholder="Password"
        placeholderTextColor={colors.placeholder}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      {profilePicture && (
        <Image source={{ uri: profilePicture }} style={styles.imagePreview} />
      )}
      <Pressable
        onPress={handleImagePicker}
        style={[styles.imagePickerButton, { backgroundColor: colors.primary }]}
      >
        <Text style={styles.imagePickerButtonText}>Pick a Profile Picture</Text>
      </Pressable>
      <Pressable
        style={[styles.button, { backgroundColor: colors.primary }]}
        onPress={handleSignUp}
      >
        <Text style={styles.buttonText}>Sign Up</Text>
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
    color: "#FFFFFF", // Keep this as white
    fontSize: 16,
    fontWeight: "bold",
  },
  imagePickerButton: {
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 10,
  },
  imagePickerButtonText: {
    color: "#FFFFFF", // Keep this as white
    fontSize: 16,
    fontWeight: "bold",
  },
  imagePreview: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginTop: 10,
    alignSelf: "center",
    resizeMode: "cover",
  },
});
