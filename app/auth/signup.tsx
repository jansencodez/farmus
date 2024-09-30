import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, Pressable, Alert, Image } from 'react-native';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { fetchWithTokenRefresh } from '../utils/auth'; 
import { baseUrl } from '../baseUrl';

export default function SignUpScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [profilePicture, setProfilePicture] = useState(null);
  const router = useRouter();

  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission required', 'Permission to access media is needed to upload a profile picture.');
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
    formData.append('name', name);
    formData.append('email', email);
    formData.append('password', password);

    if (profilePicture) {
      const filename = profilePicture.split('/').pop();
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : `image`;

      formData.append('profilePicture', {
        uri: profilePicture,
        name: filename,
        type: type,
      });
    }

    try {
      const response = await fetchWithTokenRefresh(`${baseUrl}/signup`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        await AsyncStorage.setItem('token', data.token);
        router.push('/');
      } else {
        console.error("Error Response:", data);
        Alert.alert('Error', data.message || 'An unexpected error occurred');
      }
    } catch (error) {
      console.error("Fetch Error:", error);
      Alert.alert('Error', 'An unexpected error occurred.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign Up</Text>
      <TextInput
        style={styles.input}
        placeholder="Name"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      {profilePicture && (
        <Image source={{ uri: profilePicture }} style={styles.imagePreview} />
      )}
      <Pressable onPress={handleImagePicker} style={styles.imagePickerButton}>
        <Text style={styles.imagePickerButtonText}>Pick a Profile Picture</Text>
      </Pressable>
      <Pressable style={styles.button} onPress={handleSignUp}>
        <Text style={styles.buttonText}>Sign Up</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#C8E6C9', // Light Green background
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#388E3C', // Dark Green text
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: '#795548', // Brown border
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 15,
    backgroundColor: '#FFFFFF', // White input background
  },
  button: {
    padding: 15,
    backgroundColor: '#4CAF50', // Green button
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#FFFFFF', // White text
    fontSize: 16,
    fontWeight: 'bold',
  },
  imagePickerButton: {
    padding: 15,
    backgroundColor: '#4CAF50', // Green button
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  imagePickerButtonText: {
    color: '#FFFFFF', // White text
    fontSize: 16,
    fontWeight: 'bold',
  },
  imagePreview: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginTop: 10,
    alignSelf: 'center',
    resizeMode: 'cover', // Ensures the image is fully visible within the preview box
  },
});
